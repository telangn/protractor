module.exports = {

	myTrips: "#jq-myTripsCheckIn",
	findTripName: "findReservationForm.firstName",
	findTripLastName: "findReservationForm.lastName",
	findTripPNR: "findReservationForm.recordLocator",
	findTripSubmit: "findReservationForm.submit",
	changeResLink: "#changeResButtonLink",
	flightLegCheckbox: "span[class='control']",
	continueButton: "#findFlightsContinueButton",
	tripSummaryContinueButton: "chooseFlightsContinueButton",

	verifyBackgroundColor: function () {
		element(by.css("div[class='search-results']")).getCssValue('background-color').then(function (bgCol) {
			expect(bgCol).toBe("rgba(235, 239, 240, 1)");
		});
	},

	verifyPadding: function (button, padding) {
		element(by.id(button)).getCssValue('padding-left').then(function (data) {
			expect(data).toBe(padding);
		});
		element(by.id(button)).getCssValue('padding-right').then(function (data) {
			expect(data).toBe(padding);
		});
	}
}