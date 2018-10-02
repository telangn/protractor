
var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
exports.config = {
	directConnect: true,

	capabilities: {
		browserName: 'chrome',
		chromeOptions: {
			args: ['user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1 AmericanAirlines']
		}
	},
	jasmineNodeOpts: {
		defaultTimeoutInterval: 2500000
	},

	/* 
	capabilities: {
	 	'browserName': 'chrome'
	 },
	 chromeOptions: {
	 	args: ['--window-size=800,1000']
	 },
	 multiCapabilities: [
	 	{
	 		'browserName':'firefox'
	 	}, {
	 		'browserName':'chrome'
	 	}
	 ],
	 */

	specs: ['testScripts/changeResBackgroundColor.js', 'testScripts/paddingForContinueButton.js'],
	framework: 'jasmine',

	//npm install protractor-jasmine2-html-reporter --save-dev
	onPrepare: function () {
		jasmine.getEnv().addReporter(
			new Jasmine2HtmlReporter({
				savePath: 'target/screenshots'
			})
		);
	}
};

