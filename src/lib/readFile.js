const fs = require('fs')
const path = require('path')

const read = (fileName, isParsed) => {
	try {
		const data = fs.readFileSync( path.join(process.cwd(), 'src', 'database', fileName + '.json'), 'UTF-8' )
		return isParsed ? JSON.parse(data || '[]') : data
	} catch(error) {
		throw error
	}
}

const write = (fileName, body) => {
	try {
		const data = fs.writeFileSync( path.join(process.cwd(), 'src', 'database', fileName + '.json'), JSON.stringify(body, null, 4) )
	} catch(error) {
		throw error
	}
}


module.exports = {
	write,
	read,
}