;(function() {
	var util = require('util');
	
	function Rak(promiseMod) {
		if(promiseMod)
			var rak = require('./rak.js')(promiseMod);
		else
			var rak = require('./rak.js')();
		
		return rak;
	};
	
	//
	function AngularQ(executor) {
		return 
	};
	
	// Converts the AngularJS $q API to 
	Rak.angular = function(q) {
		
		function AngularQ(executor) {
			return q(executor);
		};
		AngularQ.all = q.all;
		AngularQ.resolve = q.when;
		AngularQ.reject = q.reject;
		
		return AngularQ;
	};
	
	module.exports = Rak;

}).call(this);

