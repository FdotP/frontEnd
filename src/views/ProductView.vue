<template>
  <div class="product-box" style="margin-top: 60px;">
    <div class="product-image">
      <img :src="currentProduct.image" alt="">
    </div>
    <div class="product-info">
      <h2 class="product-title">{{ currentProduct.nazwa }}</h2>
      <span > {{ currentProduct.opis }} </span> <br>
      <span class="product-price"> {{ currentProduct.cena }}, 00 zł</span>
      
      <Btn :btnColor="'btn btn-large btn-success'" @click="addProductToCart(currentProduct)">
        Buy Now
      </Btn>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Btn from '../components/Btn.vue';

const store = useStore();

const currentProduct = computed(() => store.getters.getCurrentProduct);


const addProductToCart = (product) => {
  store.dispatch('addProduct', product);
};

</script>

<style scoped>
  .product-box {
    width: 800px;
    height: 400px;
    margin: 50px auto;
    box-sizing: border-box;
    padding: 1.5em;
    background-color: #fff;
    border-radius: 7px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .product-image {
    width: 300px;
  }

  .product-info {
    width: 400px;
    align-self: flex-start;
  }

  .product-title {
    font-weight: normal;
  }

  .product-price {
    font-size: 2em;
    font-weight: bolder;
  }

  .product-box button {
    width: 300px;
    margin: .3em 0;
  }
</style>
