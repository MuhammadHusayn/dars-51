const Router = require('./lib/router.js')
const fs = require('fs')
const path = require('path')
const PORT = process.env.PORT || 4000
const app = new Router()

app.static( path.join(__dirname, 'assets') )

const userController = require('./controllers/user.js')
const foodController = require('./controllers/food.js')
const orderController = require('./controllers/order.js')

app.get('/', (req, res) => {
	const file = fs.readFileSync( path.join(__dirname, 'assets', 'index.html') )
	res.writeHead(200, { 'Content-Type': 'text/html' })
	return res.end(file)
})

app.get('/users', userController.GET)
app.post('/users', userController.POST)

app.get('/foods', foodController.GET)

app.get('/orders', orderController.GET)
app.post('/orders', orderController.POST)

app.listen( PORT, () => console.log('server is running...') )