<template>
  <div id="nav" align="center">
    <router-link to="/">Home</router-link> |
    <router-link to="/portfolio">Portfolio</router-link>
  </div>
</template>

<style>
#foo-show-colors {
  color: #1976D2;
  color: #424242;
  color: #82B1FF;
  color: #FF5252;
  color: #2196F3;
  color: #4CAF50;
  color: #FFC107;
}
#nav {
  margin-bottom: 20px;
  margin-top: 20px;
}
#nav a {
  font-weight: bold;
  color: var(--v-secondary-base);
}
#nav a.router-link-exact-active {
  color: var(--v-primary-base);
}
</style>