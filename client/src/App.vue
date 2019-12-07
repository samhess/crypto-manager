<template>
<div class="mdc-layout-grid">
  <div class="mdc-layout-grid__cell" id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/portfolio">Portfolio</router-link>
    </div>
    <router-view/>
  </div>
</div>
</template>
