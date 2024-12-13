<script setup>
  import {RouterView } from 'vue-router'
  import Nav from "./components/Nav.vue"
  import { useStore } from 'vuex';
  import { ref, compile, onMounted } from 'vue';
  import axios from 'axios';
  const store = useStore();
  const user = ref(null);


  onMounted(async () => {


  try {
    const response = await axios.get("http://localhost:8100/user", {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    user.value = response.data;
  } catch (err) {
    console.error(err);
  }
});

  

  
</script>

<template>
  <Nav/>
  <RouterView :user="user"/>

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
