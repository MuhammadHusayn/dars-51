const usersList = document.querySelector('.customers-list')
const userAddForm = document.querySelector('#userAdd')
const usernameInput = document.querySelector('#usernameInput')
const telephoneInput = document.querySelector('#telephoneInput')
const foodsSelect = document.querySelector('#foodsSelect')
const userHeader = document.querySelector('#userHeader')
const userIdHeader = document.querySelector('#clientId')
const ordersList = document.querySelector('.orders-list')
const foodsForm = document.querySelector('#foodsForm')
const foodsCount = document.querySelector('#foodsCount')

async function userRenderer (array) {
	const users = await request('/users')
	usersList.innerHTML = null
	users.map((user) => {
		let userItem = document.createElement('li')
		let username = document.createElement('span')
		let mobile = document.createElement('a')

		userItem.classList.add('customer-item')
		username.classList.add('customer-name')
		mobile.classList.add('customer-phone')
		mobile.setAttribute('href', `tel:+${user.contact}`)

		username.textContent = user.username
		mobile.textContent = '+' + user.contact

		userItem.appendChild(username)
		userItem.appendChild(mobile)
		usersList.appendChild(userItem)
		
		userItem.onclick = (event) => {
			window.localStorage.setItem('userId', user.userId)
			window.localStorage.setItem('username', user.username)

			ordersRenderer(user.userId)
		}
	})
}


async function foodsRenderer (array) {
	const foods = await request('/foods')
	foods.map( (food) => {
		let option = document.createElement('option')
		option.value = food.foodId
		option.textContent = food.foodName
		foodsSelect.appendChild(option)
	})
}


async function ordersRenderer (userId) {
	if(!userId) return

	userHeader.textContent = window.localStorage.getItem('username')
	userIdHeader.textContent = userId
	
	const orders = await request('/orders?userId=' + userId)
	ordersList.innerHTML = null

	for(let order of orders) {
		let li = document.createElement('li')
		let img = document.createElement('img')
		let div = document.createElement('div')
		let foodName = document.createElement('span')
		let foodCount = document.createElement('span')

		li.classList.add('order-item')
		foodName.classList.add('order-name')
		foodCount.classList.add('order-count')

		img.setAttribute('src', order.food.foodImg)
		foodName.textContent = order.food.foodName
		foodCount.textContent = order.count
		div.appendChild(foodName)
		div.appendChild(foodCount)
		li.appendChild(img)
		li.appendChild(div)
		ordersList.appendChild(li)
	}
}

userAddForm.onsubmit = async event => {
	event.preventDefault()
	let newUser = {
		username: usernameInput.value,
		contact: telephoneInput.value
	}

	await request('/users', 'POST', newUser)
	userRenderer()

	usernameInput.value = null
	telephoneInput.value = null
}

foodsForm.onsubmit = async event => {
	event.preventDefault()

	let newOrder = {
		userId: +userIdHeader.textContent,
		foodId: +foodsSelect.value,
		count: +foodsCount.value
	}

	await request('/orders', 'POST', newOrder)

	foodsSelect.value = 1
	foodsCount.value = null

	ordersRenderer(userIdHeader.textContent)
}

ordersRenderer( window.localStorage.getItem('userId') )
userRenderer()
foodsRenderer()