var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var should = chai.should;
var assert = chai.assert;

module.exports = {

    verifyUrl: function (url) {
        expect(browser.getCurrentUrl()).to.eventually.equal(url);
    },

    verifyText: function (locator, text) {
        var element = $(locator);
        element.getText().then(function (data) {
            expect(data).to.eventually.equal(text);
        });
    },

    verifyElementPresence: function (locator) {
        expect($(locator).isPresent()).to.eventually.equal(true);
    },

    enterStringToField: function (locator, string) {
        var element = $(locator);
        element.click();
        element.clear();
        element.sendKeys(string);
    },

    clickElement: function (locator) {
        $(locator).click();
    }
}