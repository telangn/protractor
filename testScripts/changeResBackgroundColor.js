var rootVars = require('../root/rootVars.js');
var crFlow = require('../pageObjects/crFlow.js'); //from page object

var name = "Ninad";
var lastName = "Telang";
var PNR = "ABCDE";


describe('Chnage res flow', function(){
	browser.waitForAngularEnabled(false); //If testing angular app remove this line

    it('should nav to angular', function() {
        // browser.get('https://angularjs.org/');  If want to test angular app 
        browser.manage().window().setSize(380, 1000);
        browser.get(rootVars.silo1);


        browser.sleep(1000);
        $(crFlow.myTrips).click();
        //For angular app a good way to locate elements is by binding ex..(by.binding('nameOfBinding'))
        browser.sleep(1000);

        //Enter PNR and search for trip
          $(crFlow.findTripFN).sendKeys();
          $('#findReservationForm.lastName').sendKeys();
          $('#findReservationForm.recordLocator').sendKeys();
        
        element(by.id(crFlow.findTripName)).sendKeys(name);
        element(by.id(crFlow.findTripLastName)).sendKeys(lastName);
        element(by.id(crFlow.findTripPNR)).sendKeys(PNR);
        element(by.id(crFlow.findTripSubmit)).click();

        //Once in "Your trip", click on the "Change trip link"
		$(crFlow.changeResLink).click();

		//Mark first leg checkbox on the change res page
        element(by.css(crFlow.flightLegCheckbox)).click();

        //Then click continue button towards the bottom
        $(crFlow.continueButton).click();

        browser.sleep(2000);

        //Confirm background colors
		crFlow.verifyBackgroundColor();

        // element(by.model('yourName')).sendKeys('test run test run test run'); 

        /*Angular apps use data-binding so protractor would need to find a model or
        some type of ng unit to bind to 
        */

       
    });
});