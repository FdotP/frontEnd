<script setup>
import { useStore } from 'vuex';

const store = useStore();
const props = defineProps({
  user: {
    required: false, 
  }
});


const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload(); // Reload the page
  store.commit('CLEAR_CART');
  store.commit('SET_USER', {}); // Clear user from store
  router.push('/login'); // Navigate to login page
  

};

</script>

<template>
  <header>    
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div class="container-fluid">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/shop" class="nav-link">Shop</RouterLink>
          </li>
        </ul>
        
        

        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav">
            <li class="nav-item">
              <!-- <a class="nav-link active" aria-current="page" href="/">Home</a> -->
            </li>
          </ul>

          <div class="ms-auto" v-if="props.user && Object.keys(props.user).length > 0">
            <slot></slot>
          </div>
          
          <ul class="navbar-nav ms-auto">
            <li class="nav-item dropdown d-flex search">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ !props.user || Object.keys(props.user).length === 0 ? 'Signin/Signup' : props.user.login }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li v-if="props.user && props.user.role === 'admin'">
                  <RouterLink class="dropdown-item" to="/manage-orders">Manage Orders</RouterLink>
                </li>
                <li v-if="(props.user && Object.keys(props.user).length > 0) && props.user.role === 'admin'">
                  <RouterLink class="dropdown-item" to="/init">Init Database</RouterLink>
                </li>
                <li v-if="props.user && Object.keys(props.user).length > 0">
                  <RouterLink class="dropdown-item" to="/orders">My Orders</RouterLink>
                </li>
                <li v-if="props.user && Object.keys(props.user).length > 0">
                  <a class="dropdown-item" @click.prevent="logout" href="#">Logout</a>
                </li>
                <li v-if="!props.user || Object.keys(props.user).length === 0">
                  <a class="dropdown-item">
                    <RouterLink to="/login">Login</RouterLink>
                  </a>
                </li>
                <li v-if="!props.user || Object.keys(props.user).length === 0">
                  <a class="dropdown-item">
                    <RouterLink to="/register">Register</RouterLink>
                  </a>
                </li>
              </ul>
            </li>
          </ul>

        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.navbar-nav .nav-item {
  margin-right: 20px; /* Add spacing between the links */
}

.navbar-nav .nav-link {
  color: white !important; /* Change link color to white */
  font-size: 1.2rem; /* Increase font size */
}

.navbar-nav .nav-link:hover {
  color: #ccc !important; /* Change link color on hover */
}
</style>
