var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var should = chai.should;
var assert = chai.assert;

module.exports = {

    verifyUrl: function (url) {
        browser.getCurrentUrl().then(function (data) {
            expect(data).to.equal(url);
        });
    },

    verifyTitle: function (title) {
        browser.getTitle().then(function (data) {
            expect(data).to.equal(title);
        });
    },

    verifyText: function (locator, text) {
        $(locator).getText().then(function (data) {
            expect(data).to.equal(text);
        });
    },

    verifyElementPresent: function (locator) {
        $(locator).isPresent().then(function (data) {
            expect(data).to.be.true;
        });
    },

    verifyElementDisplayed: function (locator) {
        $(locator).isDisplayed().then(function (data) {
            expect(data).to.be.true;
        });
    },

    enterStringToField: function (locator, string) {
        var element = $(locator);
        element.click();
        element.clear();
        element.sendKeys(string);
    },

    clickElement: function (locator) {
        $(locator).click();
    },

    verifyTableRowCount: function (locator, count) {
        /*$(locator).all(by.xpath('.//tbody/tr')).count().then(function (data) {
            expect(data).to.equal(parseInt(count));
        });*/
        var table = element.all(by.css(locator));
        table.all(by.tagName("tr")).count().then(function (data) {
            expect(data).to.equal(count);
        });
    },

    verifyTableColumnCount: function (locator, count) {
        /*$(locator).all(by.xpath('.//tbody/tr/td')).count().then(function (data) {
            expect(data).to.equal(parseInt(count));
        });*/
        var table = element.all(by.css(locator));
        table.all(by.tagName("td")).count().then(function (data) {
            expect(data).to.equal(count);
        });
    },

    enterStringToModel: function (locator, string) {
        element(by.model(locator)).sendKeys(string);
    },

    verifyModelText: function (locator, string) {
        element(by.model(locator)).getText().then(function (data) {
            expect(data).to.equal(string);
        });
    },

    verifyBindingText: function (locator, string) {
        element(by.binding(locator)).getText().then(function (data) {
            expect(data).to.equal(string);
        });
    }
}