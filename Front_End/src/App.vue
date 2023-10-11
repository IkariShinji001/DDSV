<script setup>
import { RouterView } from 'vue-router'

</script>

<template>
  <div class="wrapper">
    <header>
      <router-link to="/">
      <img src="https://freepngimg.com/thumb/maserati/24485-4-maserati-logo-photos.png">
      </router-link>
      <h1>Quản lí sinh viên</h1>
    </header>
    <RouterView />
  </div>
</template>

<style>
* {
  font-family: 'Quicksand', sans-serif;
}

h1 {
  margin: 0;
  padding: 30px 0;
  text-align: center;
  font-size: 50px !important;
  font-weight: bolder !important;
}

.wrapper {
  position: relative;
  width: 100%;
  margin: 0 auto;
  background-color: rgb(243, 247, 250);
}

img{
  position: absolute;
  left: 10px;
  top: 10px;
  width: 10%;
}
</style>
