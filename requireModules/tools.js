module.exports = {

  	hello: function() {
      	return "HelloDanikaPrivetZdes";
	},

	number: function(a, b) {
		return a + b;
	},

	retreive: function() {
		return function() {
			return "This is a closure";
		}
	},

}