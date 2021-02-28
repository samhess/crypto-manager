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
          <router-link v-if="!user.username" to="/login">Login</router-link>
          <router-link v-if="user.username" to="/">Home</router-link> <span class="text-white" v-if="user.username"> | </span>
          <router-link v-if="user.username" to="/portfolio">Portfolio</router-link> <span class="text-white" v-if="user.username"> | </span>
          <router-link v-if="user.username" to="/import">Import</router-link>
        </div>
        <div class="navigation">
          <router-link class="me-2" v-if="user.username" @click.prevent="logout" to="/login">Logout ({{user.username}})</router-link>
        </div>
      </div>
    </nav>

    <main class="container min-vh-100">
      <router-view :user="user" @login="setUser"/>
    </main><!-- /.container -->

    <footer class="footer mt-auto py-4 bg-light">
      <div class="container d-flex justify-content-between">
        <span class="text-primary">Crypto Manager</span>
        <span class="text-primary">&copy; 2021 Samuel Hess</span>
      </div>
    </footer>

    <!-- Toast -->
    <div class="position-fixed bottom-0 start-50 translate-middle-x p-3" style="z-index: 5">
      <div id="toast1" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">Info</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          {{toastBody}}
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import router from "./router/index.js"
import { reactive, ref, onMounted } from "vue"
import { Toast } from 'bootstrap/'

export default {
  setup() {
    const user = reactive({})

    var toast
    var toastBody = ref('')

    async function setUser(token) {
      let payload = token.replace(/-/g, "+").replace(/_/g, "/").split(".")[1]
      payload = JSON.parse(Buffer.from(payload, "base64").toString())
      if (1000*payload.exp > Date.now()) {
        Object.assign(user,payload)
        console.log('You are logged in as ' + user.username)
        if (router.currentRoute.value.name === 'login') {
          router.push('/')
        }
      } else {
        localStorage.removeItem('jwt')
        router.push('/login')
        Object.keys(user).forEach(key => delete user[key])
      }
    }

    function logout() {
      Object.keys(user).forEach(key => delete user[key])
      if (localStorage.jwt) {
        localStorage.removeItem('jwt')
        console.log('JSON Web Token in local storage deleted')
        router.push('/login')
      }
    }

    onMounted(async () =>  {
      // initialize toast
      let toastElement = document.getElementById('toast1')
      toast = new Toast(toastElement, {delay:4000})
      updateCoins()
    }) 

    async function updateCoins() {
      let response = await fetch('/api/coin/update')
      let data = await response.json()
      toastBody.value = (data) ? 'Coins updated!' : data
      toast.show()
    }

    if (localStorage.jwt) {
      setUser(localStorage.jwt)
    }

    return {
      logout, 
      setUser, 
      user,
      toastBody
    }
  }
  
}
</script>