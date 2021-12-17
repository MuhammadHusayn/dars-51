const { read, write } = require('../lib/readFile.js')

const GET = (req, res) => {
	try {
		let orders = read('orders', true)
		let foods = read('foods', true)
		orders = orders.map( order => {
			order.food = foods.find( food => food.foodId == order.foodId )
			delete order.foodId
			return order
		} )
		if(req.query) {
			const filteredOrders = orders.filter( order => order.userId == req.query.userId )
			return res.json(filteredOrders)
		} else {
			return res.json(orders)
		}
	} catch(error) {
		return res.end(error.message)
	}
}

const POST = async (req, res) => {
	try {
		const { userId, foodId, count } = await req.body
		if(!(typeof userId === 'number')) return res.end('Invalid userId!')
		if(!(typeof foodId === 'number')) return res.end('Invalid foodId!')
		if(!(typeof count === 'number')) return res.end('Invalid count!')

		let orders = read('orders', true)
		let order = orders.find( order => order.userId == userId && order.foodId == foodId )
		if(order) {
			order.count = +order.count + +count
		} else {
			order = { orderId: orders.length ? orders[orders.length - 1].orderId + 1 : 1, userId, foodId, count }
			orders.push(order)
		}
		write('orders', orders)
		return res.json({ message: 'The order has been created!', data: order })
	} catch(error) {
		return res.end(error.message)
	}
}

module.exports = {
	POST,
	GET
}