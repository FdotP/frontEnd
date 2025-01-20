<template>
  <div class="edit-product-box">
    <h2>Edit Product</h2>
    <div v-if="loading" class="loading">Loading product details...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="product" class="product-details">
      <form @submit.prevent="updateProduct">
        <div class="form-group">
          <label for="nazwa">Name:</label>
          <input type="text" id="nazwa" v-model="product.nazwa" required />
        </div>
        <div class="form-group">
          <label for="opis">Description:</label>
          <div class="description-container">
            <textarea id="opis" v-model="product.opis" required></textarea>
            <button type="button" class="btn btn-secondary" @click="generateDescription">Generate Description</button>
          </div>
        </div>
        <div class="form-group">
          <label for="cena">Price:</label>
          <input type="number" id="cena" v-model.number="product.cena" required step="0.01" min="0" />
        </div>
        <div class="form-group">
          <label for="waga">Weight:</label>
          <input type="number" id="waga" v-model.number="product.waga" required step="0.01" min="0.01" />
        </div>
        <div class="form-group">
          <label for="kategoria">Category:</label>
          <select id="kategoria" v-model="product.kategoria" required>
            <option v-for="category in categories" :key="category._id" :value="category._id">
              {{ category.nazwa }}
            </option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Update Product</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useStore } from 'vuex';

const store = useStore();
const route = useRoute();
const router = useRouter();
const productId = route.params.id;
const product = ref(null);
const categories = computed(() => store.getters.getCategories);
const loading = ref(true);
const error = ref(null);

const fetchProductDetails = async () => {
  try {
    const products = store.getters.getProducts;
    product.value = products.find(p => p._id === productId);
    if (!product.value) {
      throw new Error('Product not found');
    }
  } catch (err) {
    error.value = 'Failed to fetch product details';
  } finally {
    loading.value = false;
  }
};

const updateProduct = async () => {
  try {
    await axios.put(`http://localhost:8100/products/${productId}`, product.value, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    await store.dispatch('fetchProducts'); // Fetch products after updating
    router.push(`/product-detail/${productId}`);
  } catch (err) {
    error.value = 'Failed to update product';
  }
};

const generateDescription = async () => {
  try {
    const response = await axios.get(`http://localhost:8100/products/${productId}/seo-description`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    product.value.opis = response.data;
  } catch (err) {
    error.value = 'Failed to generate description';
  }
};

onMounted(() => {
  store.dispatch('fetchProducts');
  store.dispatch('fetchCategories');
  fetchProductDetails();
});
</script>

<style scoped>
.edit-product-box {
  max-width: 600px;
  margin: 0 auto;
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
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input, .form-group textarea, .form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.description-container {
  display: flex;
  gap: 20px;
}

.description-container textarea {
  flex: 1;
  height: 200px; /* Increase the height of the textarea */
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  margin-top: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>