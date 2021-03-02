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
### Database Setup
In the SQL client call:
```sql
CREATE DATABASE crypto;
```
Use the Knex CLI to create the tables and seed them:
```shell
knex migrate:latest
knex seed:run
```
Start backend and frontend:
### Run locally
```shell
cd backend; nodemon
cd frontend; npm run serve
```

Simulate production environment
```shell
$env:NODE_ENV = "production"
$env:DATABASE_URL = heroku config:get DATABASE_URL -a cryptomanager1
knex migrate:down --env 'production'
knex seed:run --env 'production'
```

## Deployment
Heroku will just call `npm install` , `npm build` and `npm start`.
We will install frontend and backend dependencies on *install*.
Then we will build the frontend on *build*.
Finally, we start the app on *start*.
```json
"scripts": {
  "install": "cd backend; npm i && cd ../frontend; npm i",
  "build": "npm --prefix frontend run build",
  "start": "node backend/index.js"
},
```

# Links
* [Crypto Manager](https://cryptomanager1.herokuapp.com/)
* [CoinMarketCap](https://coinmarketcap.com)
* [CoinTracking](https://cointracking.info)