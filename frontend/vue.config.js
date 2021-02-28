module.exports = {
  pages: {
    index: {
      entry : 'src/main.js',
      title: 'Crypto Manager'
    }
  },
  devServer: {
    port: 8080,
    proxy: {
      "/api": {
        target: 'http://localhost:80/'
      }
    }
  }
}