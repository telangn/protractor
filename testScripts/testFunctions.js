var functions = require("../Functions/functions");

describe('test my functions', function () {

    browser.waitForAngularEnabled(false);

    it('test first webpage', function () {

        browser.driver.manage().window().maximize();
        browser.get("https://angularjs.org");
        browser.sleep(1000);
        functions.verifyUrl("https://angularjs.org/");
        functions.verifyTitle("AngularJS — Superheroic JavaScript MVW Framework");
        functions.enterStringToModel('yourName', "Ninad");
        functions.verifyBindingText('yourName', "Hello Ninad!");
    });

    it('test second webpage', function () {
        functions.clickElement('body > div.container > div:nth-child(2) > div.span4 > span.pull-right.ng-isolate-scope > button');
        browser.sleep(1000);
        functions.verifyElementPresent('body > div.plunker-version-switcher > div > a');
        functions.verifyElementDisplayed('body > div.plunker-version-switcher > div > a');
    });

    it('test third webpage', function(){
        browser.get("http://toolsqa.com/automation-practice-table/");
        browser.sleep(1000);
        functions.verifyText('#content > h1', "Automation Practice Table");
        functions.verifyTableColumnCount('.//tbody/tr[1]/td', 6);
        functions.verifyTableRowCount('.//tbody/tr', 4);
    });
});