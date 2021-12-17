const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')
const qs = require('querystring')
const handlers = {}
let staticPath = ''

function Server (req, res) {
	const reqUrl = url.parse(req.url).pathname
	const queryString = url.parse(req.url).query
	const query = qs.parse(queryString)
	const method = req.method.toUpperCase()

	req.query = queryString ? query : undefined

	res.json = function (data) {
		res.writeHead(200, { 'Content-Type':'application/json' })
		return res.end( isJson(data) ? data : JSON.stringify(data) )
	}

	// /users
	// /img/cola.jpeg
	if(handlers[reqUrl]) {

		if(method === 'POST') {
			req.body = new Promise( (resolve, reject) => {
				let data = ''
				req.on('data', buffer => data += buffer)
				req.on('end', buffer => resolve(JSON.parse(data)))
			})
		}

		return handlers[reqUrl][method](req, res)
	} else {
		const fileExists = fs.existsSync(path.join(staticPath, reqUrl))
		if(fileExists && staticPath) {
			const extname = path.extname(reqUrl)

			const contentTypes = {
				'.jpeg': 'image/jpeg',
				'.jpg': 'image/jpg',
				'.png': 'image/png',
				'.svg': 'image/svg+xml',
				'.txt': 'text/plain',
				'.html': 'text/html',
				'.css': 'text/css',
				'.js': 'text/js',
			}

			const contentType = { 'Content-Type': contentTypes[extname] }

			const file = fs.readFileSync( path.join(staticPath, reqUrl) )
			res.writeHead(200, contentType)
			return res.end(file)

		} else {
			return res.end(`Cannot ${method} ${reqUrl}`)
		}
	}
}


function isJson(str) {
    try {
        JSON.parse(str)
    } catch (e) {
        return false
    }
    return true
}


function Router () {
	this.server = http.createServer(Server)

	this.get = function (path, callbackHandler) {
		handlers[path] = handlers[path] || {}
		handlers[path]['GET'] = callbackHandler
	}

	this.post = function (path, callbackHandler) {
		handlers[path] = handlers[path] || {}
		handlers[path]['POST'] = callbackHandler
	}

	this.static = function (path) {
		staticPath = path
	}

	this.listen = function (PORT, callback) {
		this.server.listen(PORT, callback)
	}
}


module.exports = Router