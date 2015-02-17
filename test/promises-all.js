/**
 * top level file for controlling which tests are actually run
 */
;(function() {
	
	var Q = require('q')
	  , util = require('util');

	// Tests using ES6-style Promise
	if(typeof Promise !== 'function') {
		var Promise = require('bluebird');
		var core = require('./tests/promises-core.js')(Promise);
		var basic = require('./tests/promises-basic.js')(Promise);
	}
	else {
		var core = require('./tests/promises-core.js')();
		var basic = require('./tests/promises-basic.js')();		
	};

	core();
	basic();


	// Tests using mock Angular $q
	var Aq = function(executor) {
		return new Promise(executor);
	};
	Aq.all = Promise.all;
	Aq.when = Promise.resolve;
	Aq.reject = Promise.reject;

	var core2 = require('./tests/promises-core.js')(require('../index.js').angular(Aq));
	var basic2 = require('./tests/promises-basic.js')(require('../index.js').angular(Aq));
	
	core2();
	basic2();

}).call(this);