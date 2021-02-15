<template>
  <div>
    <nav class="navbar navbar-expand-md navbar-dark bg-secondary fixed-top">
      <div class="container-fluid justify-content-between">
        <div class="align-middle">
          <router-link class="ms-2 align-middle" to="/">
            <img src="./assets/logo.png" height="50" class="bg-white p-1" alt="logo">
          </router-link>
        </div>
        <div class="navigation">
          <router-link v-if="!login.status" to="/login">Login</router-link>
          <router-link v-if="login.status" to="/">Home</router-link> <span class="text-white" v-if="login.status"> | </span>
          <router-link v-if="login.status" to="/portfolio">Portfolio</router-link> <span class="text-white" v-if="login.status"> | </span>
          <router-link v-if="login.status" to="/import">Import</router-link>
        </div>
        <div class="navigation">
          <router-link class="me-2" v-if="login.status" @click.prevent="logout" to="/login">Logout ({{user.data.username}})</router-link>
        </div>
      </div>
    </nav>

    <main class="container min-vh-100">
      <router-view :user="user.data" @login="setUser"/>
    </main><!-- /.container -->

    <footer class="footer mt-auto py-4 bg-light">
      <div class="container d-flex justify-content-between">
        <span class="text-primary">Crypto Manager</span>
        <span class="text-primary">&copy; 2021 Samuel Hess</span>
      </div>
    </footer>

  </div>
</template>

<script>
import router from "./router/index.js"
import { reactive } from "vue"

export default {
  setup() {
    const login = reactive ({status:true})
    const user = reactive({ data: {username:'demo'} })
      
    async function setUser(token) {
      let payload = token.replace(/-/g, "+").replace(/_/g, "/").split(".")[1]
      payload = JSON.parse(Buffer.from(payload, "base64").toString())
      if (payload.exp > Date.now()) {
        let response = await fetch(`/api/user/byName/${payload.username}`)
        user.data = await response.json()
        login.status = true
        console.log('You are logged in as ' + user.data.username)
        if (router.currentRoute.value.name === 'login') {
          router.push('/')
        }
      } else {
        localStorage.removeItem('jwt')
        router.push('/login')
      }
    }

    function logout() {
      login.status = false
      user.data = {}
      if (localStorage.jwt) {
        localStorage.removeItem('jwt')
        console.log('JSON Web Token in local storage deleted')
        router.push('/login')
      }
    }

    if (localStorage.jwt) {
      // setUser(localStorage.jwt)
    }

    return {
      login, 
      logout, 
      setUser, 
      user
    }
  }
  
}
</script>