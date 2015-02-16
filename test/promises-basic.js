/**
 * Promise parallel and series sequencer tests
 */
/*
 * Notes:
 * 1) Test info can be accessed as "this.parent.tests.stat" with suitable binding for "this".
 *    The current tests stats can only be accessed after the test has completed.
 */
;(function() {
	var assert = require('assert')
	  , rak = require('../rak')
	  , testUtils = require('./lib/test-utils.js');

	// Delay generator for setTimeout() based promises
	var mu = 100;
	var sigma = 50;
	var bound = 10;
	var tdelayGen = testUtils.delay(mu, sigma);
	var size = 10;
	var failAt = 5;
	var parallelMin = mu - sigma;
	var parallelMax = mu + sigma + bound;
	var seriesPassMin = size * (mu - sigma);
	var seriesPassMax = size * (mu + sigma) + bound;
	var seriesFailMin = failAt * (mu - sigma);
	var seriesFailMax = failAt * (mu + sigma) + bound;

var thato = this;
	// parallel executor test
	describe('promise', function() {
		describe('parallel', function() {
			it('should show resolved', function(done) {
				var promises = [];
				for(var i=0; i<size; i++) {
					promises.push(testUtils.promiseCallback(true, tdelayGen()));
				};
				var start = new Date().getTime();
				rak.parallel(promises)
				.then(function(result) {
					duration = new Date().getTime() - start;
					assert(true, result + ' when should have been resolved');
					assert(duration >= parallelMin, 'execution time ' + duration + ' < ' + parallelMin);
					assert(duration <= parallelMax, 'execution time ' + duration + ' > ' + parallelMax);
					assert(result.length === size, 'results ' + result.length + ' should be ' + size);
				}, function(fail) {
					assert(false, fail + ' when should have been resolved');
				})
				.then(done, done);
			});
			
			it('should show identical results from single input', function(done) {
				var promises = [];
				for(var i=0; i<size; i++) {
					promises.push(testUtils.promiseCallback(true, tdelayGen()));
				};
				var start = new Date().getTime();
				rak.parallel(promises, 'identical')
				.then(function(result) {
					duration = new Date().getTime() - start;
					assert(true, result + ' when should have been resolved');
					assert(duration >= parallelMin, 'execution time ' + duration + ' < ' + parallelMin);
					assert(duration <= parallelMax, 'execution time ' + duration + ' > ' + parallelMax);
					assert(result.length === size, 'results ' + result.length + ' should be ' + size);
					for(var i=0; i<result.length; i++) {
						assert(result[i] === 'identical','result[' + i + ']="' +  result[i] +  '" should be "identical"');
					};
				}, function(fail) {
					assert(false, fail + ' when should have been resolved');
				})
				.then(done, done);
			});
			
			it('should show array of results from input array', function(done) {
				var promises = [];
				var inputs = [];
				for(var i=0; i<size; i++) {
					promises.push(testUtils.promiseCallback(true, tdelayGen()));
					inputs.push('unique' + i);
				};
				var start = new Date().getTime();
				rak.parallel(promises, inputs)
				.then(function(result) {
					duration = new Date().getTime() - start;
					assert(true, result + ' when should have been resolved');
					assert(duration >= parallelMin, 'execution time ' + duration + ' < ' + parallelMin);
					assert(duration <= parallelMax, 'execution time ' + duration + ' > ' + parallelMax);
					assert(result.length === size, 'results ' + result.length + ' should be ' + size);
					for(var i=0; i<result.length; i++) {
						assert(result[i] === inputs[i],'result[' + i + ']="' 
								+ result[i] + '" should be "' + inputs[i] + '"');
					};
				}, function(fail) {
					assert(false, fail + ' when should have been resolved');
				})
				.then(done, done);
			});
			
			it('should show rejected', function(done) {
				var promises = [];
				for(var i=0; i<failAt; i++) {
					promises.push(testUtils.promiseCallback(true, tdelayGen()));
				};
				promises.push(testUtils.promiseCallback(false, tdelayGen()));
				for(var i=failAt+1; i<size; i++) {
					promises.push(testUtils.promiseCallback(true, tdelayGen()));
				};
				var start = new Date().getTime();
				rak.parallel(promises)
				.then(function(result) {
					assert(false, result + ' when should have been resolved');
				}, function(fail) {
					duration = new Date().getTime() - start;
					assert(true, fail + ' when should have been rejected');
					assert(duration >= parallelMin, 'execution time ' + duration + ' < ' + parallelMin);
					assert(duration <= parallelMax, 'execution time ' + duration + ' > ' + parallelMax);
				})
				.then(done, done);
			});
		});
	});
	
	// series executor test
	describe('promise', function() {
		describe('series', function() {
			it('should show resolved', function(done) {
				var promises = [];
				for(var i=0; i<size; i++) {
					promises.push(testUtils.promiseCallback(true, tdelayGen()));
				};
				var start = new Date().getTime();
				rak.series(promises)
				.then(function(result) {
					duration = new Date().getTime() - start;
					assert(true, result + ' when should have been resolved');
					assert(duration >= seriesPassMin, 'execution time ' + duration + ' < ' + seriesPassMin);
					assert(duration <= seriesPassMax, 'execution time ' + duration + ' > ' + seriesPassMax);
					assert(result.length === size, 'results ' + result.length + ' should be ' + size);
				}, function(fail) {
					assert(false, fail + ' when should have been resolved');
				}).then(done, done);
			});

			it('should show identical results from single input', function(done) {
				var promises = [];
				for(var i=0; i<size; i++) {
					promises.push(testUtils.promiseCallback(true, tdelayGen()));
				};
				var start = new Date().getTime();
				rak.series(promises, 'waterfall')
				.then(function(result) {
					duration = new Date().getTime() - start;
					assert(true, result + ' when should have been resolved');
					assert(duration >= seriesPassMin, 'execution time ' + duration + ' < ' + seriesPassMin);
					assert(duration <= seriesPassMax, 'execution time ' + duration + ' > ' + seriesPassMax);
					assert(result.length === size, 'results ' + result.length + ' should be ' + size);
					for(var i=0; i<result.length; i++) {
						assert(result[i] === 'waterfall','result[' + i + ']="' +  result[i] +  '" should be "waterfall"');
					};
				}, function(fail) {
					assert(false, fail + ' when should have been resolved');
				}).then(done, done);
			});

			it('should show array of results from input array', function(done) {
				var promises = [];
				var inputs = [];
				for(var i=0; i<size; i++) {
					promises.push(testUtils.promiseCallback(true, tdelayGen()));
					inputs.push('unique' + i);
				};
				var start = new Date().getTime();
				rak.series(promises, inputs)
				.then(function(result) {
					end = new Date().getTime();
					duration = new Date().getTime() - start;
					assert(true, result + ' when should have been resolved');
					assert(duration >= seriesPassMin, 'execution time ' + duration + ' < ' + seriesPassMin);
					assert(duration <= seriesPassMax, 'execution time ' + duration + ' > ' + seriesPassMax);
					assert(result.length === size, 'results ' + result.length + ' should be ' + size);
					for(var i=0; i<result.length; i++) {
						assert(result[i] === inputs[i],'result[' + i + ']="' 
								+ result[i] + '" should be "' + inputs[i] + '"');
					};
				}, function(fail) {
					assert(false, fail + ' when should have been resolved');
				}).then(done, done);
			});

			it('should show rejected', function(done) {
				var promises = [];
				for(var i=0; i<failAt; i++) {
					promises.push(testUtils.promiseCallback(true, tdelayGen()));
				};
				promises.push(testUtils.promiseCallback(false, tdelayGen()));
				for(var i=failAt+1; i<size; i++) {
					promises.push(testUtils.promiseCallback(true, tdelayGen()));
				};
				var start = new Date().getTime();
				rak.series(promises)
				.then(function(result) {
					assert(false, result + ' when should have been resolved');
				}, function(fail) {
					end = new Date().getTime();
					duration = new Date().getTime() - start;
					assert(true, fail + ' when should have been rejected');
					assert(duration >= seriesFailMin, 'execution time ' + duration + ' < ' + seriesFailMin);
					assert(duration <= seriesFailMax, 'execution time ' + duration + ' > ' + seriesFailMax);
				}).then(done, done);
			});
		});
	});

}).call(this);