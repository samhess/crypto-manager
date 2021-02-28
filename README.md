[[_TOC_]]

# Crypto Manager
## Features
* Get coin information from CoinMarketCap 
* Create portfolio by adding or importing coins
* Show market share and portfolio share of each coin
* Import coins from CoinTracking

## Database
Supported databases include
* MySQL (tested locally)
* MariaDB (compatible with MySQL)
* PostgreSQL (tested on Heroku)

## Development
### Local Installation
```sql
CREATE DATABASE crypto;
```
```shell
knex migrate:latest
knex seed:run
```
### Run locally
```shell
cd backend; nodemon
cd frontend; npm run serve
```

Simulate production environment
```powershell
$env:NODE_ENV="production"
```

## Deployment
Heroku will just call `npm install` and `npm start`.
We will install frontend and backend dependencies on postinstall.
Then we will build the frontend.
Finally, we start the app.
```json
"postinstall": "cd backend; npm i && cd ../frontend; npm i",
"prestart": "npm --prefix frontend run build",
"start": "node backend/index.js",
```
In order to build the frontend on heroku the development dependencies have to be and remain installed. 
This can be achieved by modifying the NPM config
```shell
heroku config:set NPM_CONFIG_PRODUCTION=false
```

# Links
* [CoinMarketCap](https://coinmarketcap.com)
* [CoinTracking](https://cointracking.info)