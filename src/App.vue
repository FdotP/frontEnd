<script setup>
  import {RouterView } from 'vue-router'
  import Nav from "./components/Nav.vue"
  import { compile, onMounted } from 'vue';
  import axios from 'axios';

  let user = ''

  
  onMounted(async () => {
    try {
      await axios.get("http://localhost:8100/user",{
        headers:{
          Authorization:'Bearer ' + localStorage.getItem('token') 
        }
      }  ).then(
                    res => {
                      user = res.data
                      console.log(user)
                    }
                ).catch(
                    err => {console.log(err)}
                )
              }catch (error) {
    console.error('Wystąpił błąd:', error); // Obsługa błędu

  }

});

console.log(user)

  
</script>

<template>
  <Nav/>
  <main class="form-signin w-100 m-auto">
    <RouterView :user="user"/>
  </main>
</template>

<style scoped>

.form-signin {
  max-width: 330px;
  padding: 1rem;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
