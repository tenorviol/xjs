
/**
 * Calls any number of functions in parallel,
 * ordering their callback results for the final callback.
 *
 *   orderize(
 *     function(result) {
 *       console.log('ultimate result:');
 *       console.log(result);  // ['first', 'second']
 *     },
 *     function(callback) {
 *       setTimeout(function() { callback('first'); }, 200);
 *     },
 *     function(callback) {
 *       callback('second');
 *     }
 *   )
 */
exports.orderize = function(callback, timeout /* , func1, func2, ... */) {
	var args = arguments,
		results = [],     // callback results ordered by args position
		count = 0,        // called function count
		complete = 0,     // complete callback count
		first = 2,        // first function position in the args list
		threaten = true,  // threaten pulling the plug after timeout ms
		punisher,         // timeout handler
		done = false;     // semaphore so callback will only be called once
	
	if (isNaN(timeout)) {
		first = 1;
		threaten = false;
	}
	
	for (var i = first; i < arguments.length; i++) (function(i, order){
		args[i](function(result) {
			results[order] = result;
			complete++;
			if (complete == count) {
				if (punisher) {
					clearTimeout(punisher);
				}
				if (!done) {
					callback(results);
				}
			}
		});
	})(i, count++);
	
	if (threaten && complete < count) {
		punisher = setTimeout(function() {
			done = true;
			callback(results);
		}, timeout);
	}
};
