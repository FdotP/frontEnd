<template>
  <div class="home-view">
    <div v-if="isLoggedIn">
      <h1>Welcome to the Shop</h1>
      <router-link to="/shop" class="shop-link">Go to Shop</router-link>
    </div>
    <div v-else>
      <h1>Welcome to Our Website</h1>
      <p>Please log in or register to access the shop.</p>
      <router-link to="/login" class="auth-link">Log In</router-link>
      <router-link to="/register" class="auth-link">Register</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted,ref } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

const store = useStore();
const products = ref([]);
const isLoggedIn = computed(() => !!store.state.user._id);

const fetchProducts = async () => {
  try {
    const response = await axios.get("http://localhost:8100/products/", {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    products.value = response.data;
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  if (isLoggedIn.value) {
    fetchProducts();
  }
});
</script>

<style scoped>
.home-view {
  text-align: center;
  margin-top: 60px;
}

.shop-link, .auth-link {
  display: inline-block;
  margin: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.shop-link:hover, .auth-link:hover {
  background-color: #0056b3;
}
</style>