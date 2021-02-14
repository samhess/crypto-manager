<template>
  <div>
    <div class="mx-auto" style="width: 60%;">
      <h1>Login</h1>
      <form @submit.prevent name="login" class="row g-3" novalidate>
        <div class="mb-2">
          <label class="form-label" for="username">Benutzername</label>
          <input @change="validate('username')" id="username" class="form-control" v-model="credentials.username" required minlength="3" maxlength="50" />
          <div class="invalid-feedback">{{validationMessages.username}}</div>
        </div>
        <div class="mb-2">
          <label class="form-label" for="password">Passwort</label>
          <input @change="validate('password')" id="password" class="form-control" v-model="credentials.password" type="password" required minlength="3" maxlength="50" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" />
          <div class="invalid-feedback">{{validationMessages.password}}</div>
        </div>
        <div class="mb-2">
           <div style="color:red">{{validationMessages.login}}</div>
        </div>
        <menu class="d-flex justify-content-end">
          <button type="sumbit" @click="login">Login</button>
        </menu>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";

export default {
  name: "Login",

  setup(props, context) {
    const credentials = reactive({ username: "", password: "" })

    const validationMessages = reactive({
      username : null,
      password : null,
      login : null
    })

    function validate(id) {
      document.forms.login.classList.add('was-validated')
      validationMessages.login = null
      let element = document.getElementById(id)
      validationMessages[id] = element.validationMessage
      if (id === 'password' && element.validity.patternMismatch) {
        validationMessages.password = 'Muss mindestens eine Zahl und einen Gross- und Kleinbuchstaben sowie mindestens 8 oder mehr Zeichen enthalten!'
      }
    }

    async function login() {
      if (document.forms.login.checkValidity()) {
        let opt = {}
        opt.method = "POST"
        opt.headers = { "Content-Type": "application/json" }
        opt.body = JSON.stringify(credentials);
        let response = await fetch("/api/user/login", opt)
        let data = await response.json();
        if (data.message) {
          // login nok
          validationMessages.login = data.message
          document.forms.login.classList.remove('was-validated')
        } else {
          // login ok
          localStorage.setItem('jwt', data.token)
          context.emit('login', data.token)
        }
      }
    }

    return { validate, validationMessages, login, credentials }
  }
}
</script>