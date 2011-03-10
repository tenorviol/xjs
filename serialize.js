
function serialize(foo) {
	var results = [],
		count = 0,
		responses = 0;
	
	// call all functions at once, sorting out the callback responses as they come
	for (var i in arguments) {
		count++;
		arguments[i](function(sequence, data) {
			console.log('callback: '+sequence);
			results[sequence] = data;
			responses++;
			if (responses == count) {
				console.log(results);
			}
		}, i);
	}
	
	// TODO: one timeout to rule them all (aka kill them all)
}

// TODO: formalize into a test
serialize(
	function(callback, sequence) {
		console.log('called: '+sequence);
		setTimeout(function() {
			callback(sequence, 'foo');
		}, 20);
	},
	function(callback, sequence) {
		console.log('called: '+sequence);
		callback(sequence, 'bar');
	},
	function(callback, sequence) {
		console.log('called: '+sequence);
		callback(sequence, 'barbaz');
	}
);
