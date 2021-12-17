const { read, write } = require('../lib/readFile.js')

const GET = (req, res) => {
	try {
		return res.json( read('users') )
	} catch(error) {
		return res.end(error.message)
	}
}

const POST = async (req, res) => {
	try {
		const { username, contact } = await req.body
		if(!(typeof username === 'string') || username.length > 50) return res.end('Invalid username!')
		if(!(typeof contact === 'string') || !(contact.length == 12)) return res.end('Invalid contact!')

		let users = read('users', true)
		let newUser = { userId: users.length ? users[users.length - 1].userId + 1 : 1, username, contact }
		users.push(newUser)
		write('users', users)
		return res.json({ message: 'The user has been created!', data: newUser })
	} catch(error) {
		return res.end(error.message)
	}
}

module.exports = {
	POST,
	GET
}