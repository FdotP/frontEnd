<script setup>
import maskBg from './components/Mask.vue';
import btn from './components/Btn.vue';
import { RouterView, useRouter } from 'vue-router';
import popupcart from './components/Popupcart.vue';
import Nav from "./components/Nav.vue";
import { useStore } from 'vuex';
import { computed, onMounted } from 'vue';


const store = useStore();
const router = useRouter();

onMounted(async () => {
  await store.dispatch('setUser');
});

const getProductsInCart = computed(() => store.getters.getProductsInCart);
const getPopupCart = computed(() => store.getters.getPopupCart);
const getUser = computed(() => store.getters.getUser);

const hasProduct = computed(() => getProductsInCart.value.length > 0);

const showPopupCart = () => {
  store.dispatch('showOrHiddenPopupCart');
};

// Navigation guard to check if the user is logged in
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!store.state.user._id;
  const publicPages = ['/login', '/register', '/'];
  const authRequired = !publicPages.includes(to.path);

  if (!isLoggedIn && authRequired) {
    next('/login');
  } else {
    next();
  }
});
</script>

<template>
    <Nav :user="getUser">
      <btn btnColor="btn btn-small btn-info btn-popup"
         @click.native="showPopupCart">
         Cart
        <span class="btn-circle" v-if="hasProduct">
           {{ getProductsInCart.length }}
        </span>
      </btn>
      <transition name="appear">
        <popupcart class="cart" v-if="getPopupCart"/>
      </transition>
    </Nav>
    <RouterView :user="getUser"/>
    <maskBg v-if="getPopupCart" @click="showPopupCart"/>
</template>


<style scoped>

#app {
  margin-top: 60px;
}


body {
    font-family: 'Roboto', sans-serif;
    background-color: #FAFAFA;
  }

  a {
    color: #000;
    text-decoration: none;
  }

  .container {
    width: 100%;
  }

  .cart {
    position: absolute;
    top: 75px;
    right: 300px;
  }

  .btn-circle {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #fff;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .leave-enter-active, .leave-leave-active {
    transition: all 1.2s;
  }
  .leave-enter, .leave-leave-to {
    opacity: 0;
    transform: translateX(-50%);
  }

  .appear-enter-active {
    animation: appear-animation .5s;
  }

  .appear-leave-active {
    animation: appear-animation .5s reverse;
  }

  @keyframes appear-animation {
    0% {
      transform: translateY(-50%);
      opacity: 0;
    }
    100% {
      transform: translateY(0%);
      opacity: 1;
    }
  }

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
