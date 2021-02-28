# Crypto Manager
* Gets coin information from CoinMarketCap 
* Creating portfolio by adding or importing coins
* Show market share and portfolio share of each coin

# Deployment
In order to build the frontend on heroku the development dependencies have to be installed. 
This can be achieved by modifying the NPM config

```shell
heroku config:set NPM_CONFIG_PRODUCTION=false
```

```powershell
$env:NODE_ENV="production"
$env:DATABASE_URL="postgres://rwyplvndjzruzg:0505e8801ef1f9947e2e7970fcc68233ec3dfa50e73b85ee5a38348fe1750b20@ec2-54-228-174-49.eu-west-1.compute.amazonaws.com:5432/du06ujf30bppd"
```

# Links
* [CoinMarketCap](https://coinmarketcap.com)
* [CoinTracking](https://cointracking.info)