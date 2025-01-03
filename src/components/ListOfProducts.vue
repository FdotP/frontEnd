<template>
  <ul class="listOfProducts" style="margin-top: 60px;">
    <li v-for="(product, index) in props.products" :key="index" class="product">
      <router-link to="/product-details">
        <h2 class="product-name"
            @click="addCurrentProduct(product)">
          {{ product.nazwa }}
        </h2>
      </router-link>
      <div class="product-price">
        <span>{{ product.cena }}, 00 Zł</span>
      </div>

      <btn btnColor="btn btn-large btn-sucess"
          @click.native="addProductToCart(product)">
        Add to cart
      </btn>
    </li>
  </ul>
</template>

<script setup>

const props = defineProps({
  products: {
    type: Array,
    required: true,  // Make sure the parent passes a value for 'products'
  }
});

import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import btn from './Btn.vue';

const store = useStore();

const addProductToCart = (product) => {
  store.dispatch('addProduct', product);
};

const addCurrentProduct = (product) => {
  store.dispatch('currentProduct', product);
};


onMounted( async () =>{
  console.log(props.products)
})

</script>

<style scoped>
  .listOfProducts {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 0;
  }

  .product {
    width: 300px;
    background-color: #fff;
    list-style: none;
    box-sizing: border-box;
    padding: 1em;
    margin: 1em 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 7px;
  }

  .product-name {
    font-size: 1.2em;
    font-weight: normal;
  }

  .product-name:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  .product-price {
    width: 100%;
    align-self: flex-start;
    display: flex;
    justify-content: space-between;
    margin-bottom: .5em;
  }

</style>

