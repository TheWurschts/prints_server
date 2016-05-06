const Bcrypt = require('bcrypt');
const saltRounds = 10;
Bcrypt.hash(process.argv[2], saltRounds, function (err, hash) {
	console.log(hash, process.argv[2]);
	Bcrypt.compare(process.argv[2], hash, (err, isValid) => {
		console.log(isValid)
	})
});
