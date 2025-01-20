<template>
  <main class="form-signin w-100 m-auto">
    <form @submit.prevent="handleSubmit">
      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

      <div class="form-floating">
        <input type="text" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="login">
        <label for="floatingInput">Login</label>
      </div>
      <div class="form-floating">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="password">
        <label for="floatingPassword">Password</label>
      </div>

      <div class="form-check text-start my-3">
        <input class="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault">
        <label class="form-check-label" for="flexCheckDefault">
          Remember me
        </label>
      </div>
      <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
      <p class="mt-5 mb-3 text-body-secondary">&copy; 2017–2024</p>
    </form>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();

const login = ref('');
const password = ref('');


const handleSubmit = async () => {
  const data = {
    login: login.value,
    password: password.value,
  };

  try {
    const response = await axios.post("http://localhost:8100/login", data);
    console.log(response.data.token);
    localStorage.setItem('token', response.data.token);
    await store.dispatch('setUser');
    router.push({ path: "/shop" });
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped>
</style>
