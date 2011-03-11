
/**
 * Calls any number of functions at once,
 * returning them in order to the final callback.
 *
 *   orderize(
 *     function(result) {
 *       console.log(result);
 *     },
 *     function(callback) {
 *       setTimeout(function() { callback('first'); }, 2);
 *     },
 *     function(callback) {
 *       callback('second');
 *     }
 *   )
 */
exports.orderize = function(callback, timeout /* , func1, func2, ... */) {
	var functions = arguments,
		results = [],
		count = 0,
		complete = 0,
		start = 2,
		timer,
		done = false;
	
	if (isNaN(timeout)) {
		start = 1;
	} else {
		timer = setTimeout(function() {
			done = true;
			callback(results);
		}, timeout);
	}
	
	// call all functions at once, sorting out the callback results as they complete
	for (var i = start; i < arguments.length; i++) (function(i, order){
		functions[i](function(result) {
			results[order] = result;
			complete++;
			if (complete == count) {
				if (timer) {
					clearTimeout(timer);
				}
				if (!done) {
					callback(results);
				}
			}
		});
	})(i, count++);
	
	// TODO: one timeout to rule them all (aka kill them all)
};
