<template>
  <div class="product-box">
    <div v-if="loading" class="loading">Loading product details...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="product" class="product-details">
      <div class="product-info">
        <h2 class="product-title">{{ product.nazwa }}</h2>
        <p class="product-description">{{ product.opis }}</p>
        <p class="product-weight"><strong>Weight:</strong> {{ product.waga }} kg</p>
        <p class="product-category"><strong>Category:</strong> {{ getCategoryName(product.kategoria) }}</p>
        <p class="product-price"><strong>Price:</strong> {{ product.cena }} zł</p>
        <div class="button-container">
          <Btn :btnColor="'btn btn-large btn-success'" @click="addProductToCart(product)">
            Buy Now
          </Btn>
          <button v-if="isAdmin" @click="editProduct" class="edit-button">Edit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Btn from '../components/Btn.vue';
import { useStore } from 'vuex';

const store = useStore();
const route = useRoute();
const router = useRouter();
const productId = route.params.id;
const product = ref(null);
const loading = ref(true);
const error = ref(null);
const isAdmin = ref(false);

const fetchProduct = () => {
  const products = store.getters.getProducts;
  product.value = products.find(p => p._id === productId);
  if (product.value) {
    loading.value = false;
  } else {
    error.value = 'Failed to load product details.';
    loading.value = false;
  }
};

const getCategoryName = (categoryId) => {
  const categories = store.getters.getCategories;
  const category = categories.find(c => c._id === categoryId);
  return category ? category.nazwa : 'Unknown';
};

const addProductToCart = (product) => {
  store.commit('ADD_PRODUCT', product);
  alert('Product added to cart!');
};

const editProduct = () => {
  router.push(`/product-edit/${productId}`);
};

onMounted(() => {
  fetchProduct();
  const user = store.getters.getUser;
  isAdmin.value = user && user.role === 'admin';
});
</script>

<style scoped>
.product-box {
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading, .error {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.product-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.product-image img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}

.product-info {
  max-width: 600px;
}

.product-title {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #333;
}

.product-description {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #555;
}

.product-weight, .product-category, .product-price {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #333;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.edit-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.edit-button:hover {
  background-color: #0056b3;
}
</style>