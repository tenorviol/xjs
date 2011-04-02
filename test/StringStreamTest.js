var StringStream = require('../lib/StringStream');

exports.test = function(assert) {
	var stream = new StringStream();
	
	assert.equal(true, stream.writable);
	assert.equal('', stream.toString());
	
	assert.equal(true, stream.write('foo'));
	stream.write('bar');
	
	assert.equal('foobar', stream.toString());
	
	stream.on('end', function() {
		assert.equal('foobarFubar!', stream.toString());
		assert.done();
	});
	
	stream.end('Fubar!');
};
