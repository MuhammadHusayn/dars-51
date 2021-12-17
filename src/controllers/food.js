const { read, write } = require('../lib/readFile.js')

const GET = (req, res) => {
	try {
		return res.json( read('foods') )
	} catch(error) {
		return res.end(error.message)
	}
}

module.exports = {
	GET
}