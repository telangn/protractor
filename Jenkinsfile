//Lets define a unique label for this build.
@Library('Utility-Pipeline')
def roomName = '#redshirts-builds'
def pipeline = new com.pgi.jenkins.Pipeline()
def label = "buildpod.pgi-ng-pageobject-lib.${env.BUILD_NUMBER}"
def buildImage = 'docker.artifactory.pgi-tools.com/helpers/scala-sbt:bionic-3'

def isPR = env.BRANCH_NAME.startsWith("PR-")
def isLongLived = env.BRANCH_NAME.matches("(master|feature/.+/master|release/.+)")
def targetBranch = env.CHANGE_TARGET

// We only care about PRs and long lived branches
def shouldCreateArtifact = isPR || isLongLived

if (shouldCreateArtifact) {
    pipeline.setNotificationRoom(roomName)
}

def cleanBranchName(name) {
    // Semver only allows [0-9A-Za-z-]
    return name.replaceAll(/([^0-9a-zA-Z-])/, "-")
}

podTemplate(
    label: label,
    containers: [
        // We can add as many as needed here it seems
        containerTemplate(name: 'scala-sbt', image: buildImage, ttyEnabled: true, command: 'cat')
    ],
    volumes: [
        // This is more for testing currently -- not sure yet if this is a good long-term solution or not.. so stay tuned.
        hostPathVolume(hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock')
    ],
    imagePullSecrets: [ 'artifactory-pgitools' ],
) {
    //Lets use our pod template (referenced by label)
    node(label) {
        scmInfo = checkout scm
        def imageTag = sh(returnStdout: true, script: "git describe --always").trim()
        def scannerHome = tool 'SonarQubeScanner';
        currentBuild.displayName = imageTag


        if (shouldCreateArtifact) {
            pipeline.sendNotifications('STARTED', label, imageTag);
        }
        container('scala-sbt') {
            withNPM(npmrcConfig: 'npmrc-pgi-tools') {

                try {
                    stage('Install JS') {
                        sh "yarn config set registry https://artifactory.pgi-tools.com/artifactory/api/npm/npm/"
                        sh "yarn install --verbose --frozen-lockfile"
                    }
                } catch (e) {
                    if (shouldCreateArtifact) {
                        pipeline.sendNotifications('FAILURE', 'Install JS', imageTag)
                    }
                    currentBuild.rawBuild.result = Result.FAILURE
                    throw new hudson.AbortException('INSTALL JS FAILURE')
                }

                try {
                    stage('Build Library JS') {
                        sh "yarn run build:pageobject"
                    }
                } catch (e) {
                    if (shouldCreateArtifact) {
                        pipeline.sendNotifications('FAILURE', 'Build Library JS', imageTag);
                    }
                    currentBuild.rawBuild.result = Result.FAILURE
                    throw new hudson.AbortException('Build Library JS FAILURE')
                }

                try {
                    PACKAGE_VERSION = sh(
                        script: 'node -pe "require(\'./dist/pageobject/package.json\').version"',
                        returnStdout: true
                    ).trim()

                    PUBLISHED_VERSIONS = sh(
                        script: 'npm info @pgi/ng-pageobject-lib versions',
                        returnStdout: true
                    ).trim()

                    def versionIsPublished = (PUBLISHED_VERSIONS ==~ /(?s).*'${PACKAGE_VERSION}'.*/)

                    def hasBuildableBranchName = (env.BRANCH_NAME ==~ /release\/.+/)

                    PUBLISHING_NEW_RELEASE = !versionIsPublished && (env.BRANCH_NAME == 'master' || hasBuildableBranchName)
                }
                catch (e) {
                    // No published version found so only publish a new version if we're on master,
                    // otherwise we publish a snapshot
                    echo "Failed to verify version against artifactory due to error: ${e}"
                    PUBLISHING_NEW_RELEASE = env.BRANCH_NAME == 'master'
                }

                if (shouldCreateArtifact) {
                    // We only care to publish for PRs and long lived branches
                    try {
                        stage('Publish JS') {
                            if (PUBLISHING_NEW_RELEASE) {
                                sh "npm publish dist/pageobject"

                                withEnv([
                                    'GIT_COMMITTER_NAME="PGi Tools Jenkins"',
                                    'GIT_COMMITTER_EMAIL="jenkins@pgi-tools.com"',
                                    'CONTAINER_TAG=' + PACKAGE_VERSION
                                ]) {
                                    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'jenkins-pgitools',
                                                    usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                                    // Note using single quotes does not expand the $, passes unexpanded to the shell prompt
                                    // where it is expanded by the shell itself.  That's why we used withEnv() above to pass
                                    // in the CONTAINER_TAG env var.
                                    sh '''
                                        git tag -a -m "Version `${CONTAINER_TAG}` automatically published." ${CONTAINER_TAG}
                                        git push --tags https://${USERNAME}:${PASSWORD}@bitbucket.pgi-tools.com/scm/cs/pgi-ng-pageobject-lib.git
                                        '''
                                    }
                                }
                            } else {
                                sh "node snapshot-project.js ${env.BUILD_NUMBER} ${cleanBranchName(env.BRANCH_NAME)}"
                                sh "npm publish dist/pageobject --tag ${env.BRANCH_NAME}"
                            }

                            NEW_VERSION = sh(
                                    script: 'node -pe "require(\'./dist/pageobject/package.json\').version"',
                                    returnStdout: true
                            ).trim()
                            currentBuild.displayName = NEW_VERSION
                        }
                    } catch (e) {
                        pipeline.sendNotifications('FAILURE', 'Publish JS', imageTag);
                        currentBuild.rawBuild.result = Result.FAILURE
                        throw new hudson.AbortException('PUBLISH JS FAILURE')
                    }
                }

                try {
                    stage('SonarQube analysis') {
                        withSonarQubeEnv('SonarQube') {
                            def sonarCmd = "${scannerHome}/bin/sonar-scanner -X"
                            if (isPR) {
                                // Set up which branch we're trying to merge into if this is a PR
                                sonarCmd = sonarCmd + " -Dsonar.pullrequest.branch=${env.BRANCH_NAME} -Dsonar.pullrequest.key=${env.BRANCH_NAME} -Dsonar.pullrequest.base=${targetBranch}"
                            } else {
                                sonarCmd = sonarCmd + " -Dsonar.branch.name=${env.BRANCH_NAME}"
                            }
                            sh """${sonarCmd} -Dsonar.projectVersion=${imageTag}"""
                        }
                    }

                    stage("Quality Gate") {
                        timeout(time: 5, unit: 'MINUTES') {
                            def qg = waitForQualityGate() // Reuse taskId previously collected by withSonarQubeEnv
                            if (qg.status != 'OK') {
                                error "Pipeline aborted due to quality gate failure: ${qg.status}"
                            }
                        }
                    }
                } catch (e) {
                    if (shouldCreateArtifact) {
                        pipeline.sendNotifications('FAILURE', 'SONAR FAILURE', imageTag)
                    }
                    currentBuild.rawBuild.result = Result.FAILURE
                    throw new hudson.AbortException('SONAR FAILURE')
                }
            }
        }
        stage('Notify Success'){
            if (shouldCreateArtifact) {
                pipeline.sendNotifications('SUCCESS', '', imageTag);
            }
        }
    }
}
