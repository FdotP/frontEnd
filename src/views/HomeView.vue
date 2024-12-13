<script setup>
import axios from 'axios';
import Product from '../components/Product.vue';
import { ref, onMounted } from 'vue';
const props = defineProps(['user']);
console.log(props.user);

const products = ref(null);

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:8100/products/", {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    products.value = response.data; // Zakładamy, że dane mają odpowiednie właściwości
  } catch (err) {
    console.error(err);
  }
});

</script>



<template>
  <div v-if="products && products.length > 0" id="productListing">
        <div v-for="(product, index) in products" :key="index" class="item">
            <Product 
                :cena="product.cena" 
                :waga="product.waga" 
                :opis="product.opis" 
                :nazwa="product.nazwa" 
            />
        </div>
  </div>
  <div v-else>
    Ładowanie produktów...
  </div>
</template>

<style scoped>

#productListing{
    padding-top: 50px;
    margin: auto;
    display: grid;
}

    

</style>
