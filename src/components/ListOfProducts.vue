<template>
  <div class="list-of-products" style="margin-top: 60px;">
    <div class="filters">
      <input type="text" v-model="nameFilter" placeholder="Filter by name" />
      <select v-model="categoryFilter">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category._id" :value="category._id">
          {{ category.nazwa }}
        </option>
      </select>
    </div>
    <table class="product-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in filteredProducts" :key="index" class="product-row">
          <td>
            <router-link :to="`/product-detail/${product._id}`" class="custom-link">
              <h2 class="product-name">
                {{ product.nazwa }}
              </h2>
            </router-link>
          </td>
          <td class="product-price">
            <span>{{ product.cena }} Zł</span>
          </td>
          <td class="product-action">
            <btn btnColor="btn btn-large btn-success" @click.native="addProductToCart(product)">
              Add to cart
            </btn>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import btn from './Btn.vue';

const store = useStore();
const nameFilter = ref('');
const categoryFilter = ref('');

const products = computed(() => store.getters.getProducts);
const categories = computed(() => store.getters.getCategories);

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesName = product.nazwa.toLowerCase().includes(nameFilter.value.toLowerCase());
    const matchesCategory = !categoryFilter.value || product.kategoria === categoryFilter.value;
    return matchesName && matchesCategory;
  });
});

const addCurrentProduct = (product) => {
  store.commit('CURRENT_PRODUCT', product);
};

const addProductToCart = (product) => {
  store.dispatch('addProduct', product);
};

onMounted(() => {
  store.dispatch('fetchProducts');
  store.dispatch('fetchCategories');
});
</script>

<style scoped>
.list-of-products {
  padding: 20px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filters input,
.filters select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table th, .product-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.product-table th {
  background-color: #f9f9f9;
}

.product-name {
  margin: 0;
  color: inherit; /* Ensure the product name inherits the color from its parent */
}

.product-price {
  text-align: left;
}

.product-action {
  text-align: right;
}

.custom-link {
  text-decoration: none; /* Remove underline from links */
  color: inherit; /* Ensure the link inherits the color from its parent */
}

.custom-link:hover {
  color: #007bff; /* Change color on hover */
}

.btn {
  cursor: pointer;
}
</style>