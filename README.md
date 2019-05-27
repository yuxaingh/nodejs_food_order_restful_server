# nodejs_food_order_restful_server
This is a node.js RESTful api server for online food order system.

# To run the program
Please install MySql and import the schema

To run the server
```
npm start
```

# Implemented APIs and their payload:
```
Category:
GET localhost:3000/category

GET localhost:3000/category/id

POST localhost:3000/category
{
    "type": "category",
    "data": {
        "name"(required): "Chinese"
    }
}

PATCH localhost:3000/category
{
    "type": "category",
    "data": {
        "name"(required): "Chinese"
    }
}

Company:
GET localhost:3000/company

GET localhost:3000/company/id

POST localhost:3000/company
{
    "type": "company",
    "data": {
        "name"(required): "Mcdonal",
        "email"(required): "sunstar123@gmail.com",
        "phone"(required): "123456789",
    }
}

PATCH localhost:3000/company/id
{
    "type": "company",
    "data": {
        "name"(required): "Mcdonal",
        "email"(required): "sunstar123@gmail.com",
        "phone"(required): "123456789",
    }
}

Item:
GET localhost:3000/item

POST localhost:3000/item
{
	"type": "item",
	"data": {
		"name"(required): "Chicken Chow Main",
		"price"(required): 11.99,
		"description"(optional): "Fried noodle with chicken",
		"category"(required): 1,
		"company"(required): 2
	}
}

PATCH localhost:3000/item/id
{
	"type": "item",
	"data": {
		"name"(required): "Chicken Chow Main",
		"price"(required): 11.99,
		"description"(optional): "Fried noodle with chicken",
		"category"(required): 1,
		"company"(required): 2
	}
}

User:
GET localhost:3000/user

GET localhost:3000/user/id

POST localhost:3000/user
{
	"type": "user",
	"data": {
		"name"(required): "Tony Brain",
		"email"(required): "btony@gmail.com",
		"address"(optional): "655 cypress st",
		"phone"(optional):  "7787773333",
		"isAdmin"(required): true,
		"password"(required): "123"
	}
}

PATCH localhost:3000/user/id
{
	"type": "user",
	"data": {
		"name"(required): "Tony Brain",
		"email"(required): "btony@gmail.com",
		"address"(optional): "655 cypress st",
		"phone"(optional):  "7787773333",
		"isAdmin"(required): true,
		"password"(required): "123"
	}
}

Order:
GET localhost:3000/order

GET localhost:3000/order?user=1

GET localhost:3000/order/1

POST localhost:3000/order
{
	"type": "order",
	"data": {
		"company"(required): 1,
		"itemList"(required): [
			{
				"id": 1,
				"quantity":1
			},
			{
				"id": 2,
				"quantity":2
			}
			]
	}
}

Login:
POST localhost:3000/login
{
	"type":"login",
	"data":{
		"email"(required):"btony@gmail.com",
		"password"(required): "123"
	}
}

If you got 401 error, please login first and get JWT. Add authorization in header: Bearer "token".
```

# To do
```
Menu api
Order api
(Please design and write the api definition in above section before you actually implement the api)
```
