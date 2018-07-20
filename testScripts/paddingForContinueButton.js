var rootVars = require('../root/rootVars.js');
var crFlow = require('../pageObjects/crFlow.js'); //from page object

var name = "Ninad";
var lastName = "Telang";
var PNR = "ABCDE";


describe('Padding for continue button', function(){
	browser.waitForAngularEnabled(false);

    it('on trip summary page', function() {
        browser.manage().window().setSize(380, 1000);
        browser.get(rootVars.silo2);

        browser.sleep(1000);
        $(crFlow.myTrips).click();
        browser.sleep(1000);

        element(by.id(crFlow.findTripName)).sendKeys(name);
        element(by.id(crFlow.findTripLastName)).sendKeys(lastName);
        element(by.id(crFlow.findTripPNR)).sendKeys(PNR);
        element(by.id(crFlow.findTripSubmit)).click();

		$(crFlow.changeResLink).click();
        element(by.css(crFlow.flightLegCheckbox)).click();
        $(crFlow.continueButton).click();

        browser.sleep(10000); // Keep getting an error here

		element(by.id('flightSelectButton-0-6')).click();

        browser.sleep(5000);

        //Trip summary page
        crFlow.verifyContinueButtonPadding(crFlow.tripSummaryContinueButton, '0px');
    });
});