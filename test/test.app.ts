import chai = require('chai');

describe('test', () => {
	let a = 2;

	it('should work', () => {
		chai.expect(a).to.be.equal(2);
	});
});
