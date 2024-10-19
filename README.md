YakShop:
YakShop is a Node.js application that helps a Yak shepherd manage their stocks of milk and wool. It provides HTTP endpoints to query the herd and current stock after a specified number of days.

Features:
Calculate milk production for the herd
Track wool (skin) production based on shaving schedules
Manage the aging and lifecycle of yaks
Provide RESTful API endpoints for querying stock and herd status

Prerequisites:
Node.js (v12.0.0 or higher recommended)
npm (usually comes with Node.js)

Installation:
Clone this repository:

git clone https://github.com/your-username/yak-shop.git

cd yak-shop

Install dependencies:

npm install

Usage:
Prepare your herd data in a JSON file (e.g., herd.json):

{
    "herd": [
        {
            "name": "Betty-1",
            "age": 4,
            "sex": "f"
        },
        {
            "name": "Betty-2",
            "age": 8,
            "sex": "f"
        },
        {
            "name": "Betty-3",
            "age": 9.5,
            "sex": "f"
        }
    ]
}

Run the application:

node yak-shop.js herd.json
The server will start, and you should see a message like:

YakShop app listening at http://localhost:3000

API Endpoints:
Get stock after T days:

GET /yak-shop/stock/:days
Example: http://localhost:3000/yak-shop/stock/13

Get herd status after T days:

GET /yak-shop/herd/:days
Example: http://localhost:3000/yak-shop/herd/13

License
This project is licensed under the MIT License - see the LICENSE file for details.