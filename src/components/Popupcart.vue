<template>
  <div class="box">
    <span v-if="!hasProduct">No products :/</span>
    <div v-for="(product, index) in getProductsInCart" :key="index" class="box-item">
      <h3 class="item-name">{{ product.nazwa }}</h3>
      <span class="item-amount">amount {{ product.quantity }}</span>
      <span class="item-price">{{ product.cena * product.quantity }} zł</span>
      <button @click="decrementQuantity(product)">-</button>

      <button @click="incrementQuantity(product)">+</button>
      
      <button @click="removeProduct(index)">Remove</button>
    </div>
    <div class="cart-info" v-if="hasProduct">
      <span>Total: {{ totalPrice }} zł</span>
      <router-link to="/checkout">
        <Btn :btnColor="'btn btn-small btn-info'" @click="showPopupCart">
          View cart
        </Btn>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Btn from './Btn.vue';

const store = useStore();

const getProductsInCart = computed(() => store.getters.getProductsInCart);

const hasProduct = computed(() => getProductsInCart.value.length > 0);

const totalPrice = computed(() => {
  return getProductsInCart.value.reduce((current, next) => current + next.cena * next.quantity, 0);
});

const incrementQuantity = (product) => {
  store.commit('INCREMENT_PRODUCT_QUANTITY', product._id);
};

const decrementQuantity = (product) => {
  if (product.quantity > 1) {
    store.commit('DECREMENT_PRODUCT_QUANTITY', product._id);
  } else {
    store.commit('REMOVE_PRODUCT', getProductsInCart.value.indexOf(product));
  }
};

const removeProduct = (index) => {
  store.commit('REMOVE_PRODUCT', index);
};
</script>

<style scoped>
.box {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.box-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.item-name {
  flex: 2;
}

.item-amount, .item-price {
  flex: 1;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

.cart-info {
  margin-top: 20px;
  text-align: center;
}
</style>