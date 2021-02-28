# Crypto Manager
* Gets coin information from CoinMarketCap 
* Creating portfolio by adding or importing coins
* Show market share and portfolio share of each coin

## Development
```powershell
$env:NODE_ENV="production"
```

# Deployment
In order to build the frontend on heroku the development dependencies have to be installed. 
This can be achieved by modifying the NPM config

```shell
heroku config:set NPM_CONFIG_PRODUCTION=false
```

# Links
* [CoinMarketCap](https://coinmarketcap.com)
* [CoinTracking](https://cointracking.info)