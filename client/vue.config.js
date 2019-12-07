module.exports = {
  "devServer": {
    "port": 8080,
    "proxy": {
      "/api": {
        "target": "http://localhost:80/"
      }
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}