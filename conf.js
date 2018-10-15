exports.config = {
	directConnect: true,


	capabilities: {
		browserName: 'chrome',
		chromeOptions: {
			/*args: ['--window-size=800,1000']*/
			args: ['--start-maximized']
		}
	},
	/*capabilities: {
		browserName: 'chrome',
		chromeOptions: {
			args: ['user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1 AmericanAirlines']
		}
	},*/
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000
	},
	/*
	multiCapabilities: [
	 	{
	 		browserName:'firefox'
		}, 
		{
	 		browserName:'chrome'
	 	}
	 ],
	 */

	/*specs: ['testScripts/changeResBackgroundColor.js', 'testScripts/paddingForContinueButton.js'],*/
	specs: ['testScripts/testFunctions.js'],
	framework: 'jasmine',

	onPrepare: function () {
		var jasmineReporters = require('jasmine-reporters');
		jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
			consolidateAll: true,
			savePath: './target/',
			filePrefix: 'xmlresults'
		}));

		var fs = require('fs-extra');

		fs.emptyDir('./target/screenshots/', function (err) {
			console.log(err);
		});

		jasmine.getEnv().addReporter({
			specDone: function (result) {
				if (result.status == 'failed') {
					browser.getCapabilities().then(function (caps) {
						var browserName = caps.get('browserName');

						browser.takeScreenshot().then(function (png) {
							var stream = fs.createWriteStream('./target/screenshots/' + browserName + '-' + result.fullName + '.png');
							stream.write(new Buffer(png, 'base64'));
							stream.end();
						});
					});
				}
			}
		});
	},

	//HTMLReport called once tests are finished
	onComplete: function () {
		var browserName, browserVersion;
		var capsPromise = browser.getCapabilities();

		capsPromise.then(function (caps) {
			browserName = caps.get('browserName');
			browserVersion = caps.get('version');
			platform = caps.get('platform');

			var HTMLReport = require('protractor-html-reporter-2');

			testConfig = {
				reportTitle: 'Protractor Test Execution Report',
				outputPath: './target/',
				outputFilename: 'ProtractorTestReport',
				screenshotPath: './screenshots',
				testBrowser: browserName,
				browserVersion: browserVersion,
				modifiedSuiteName: false,
				screenshotsOnlyOnFailure: true,
				testPlatform: platform
			};
			new HTMLReport().from('./target/xmlresults.xml', testConfig);
		});
	}

};