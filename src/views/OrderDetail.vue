<template>
  <div class="order-detail">
    <h2>Order Details</h2>
    <div v-if="loading" class="loading">Loading order details...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="order">
      <h3>Order ID: {{ order._id }}</h3>
      <p>Date: {{ new Date(order.dataZatwierdzenia).toLocaleString() }}</p>
      <p>Status: {{ getStatusName(order.stanZamowienia) }}</p>
      <p>User: {{ order.nazwaUzytkownika }}</p>
      <p>Email: {{ order.email }}</p>
      <p>Phone: {{ order.numerTelefonu }}</p>
      <h4>Products:</h4>
      <ul class="product-list">
        <li v-for="item in order.listaZakupow" :key="item.item._id" class="product-item">
          <p>Product: {{ getProduct(item.item).nazwa }}</p>
          <p>Quantity: {{ item.count }}</p>
          <p>Price: {{ item.price }} zł</p>
        </li>
      </ul>
      <h4>Opinions:</h4>
      <ul class="opinion-list">
        <li v-for="opinion in order.opinia" :key="opinion._id" class="opinion-item">
          <p>Rating: {{ opinion.ocena }}</p>
          <p>Content: {{ opinion.tresc }}</p>
        </li>
      </ul>
      <div class="add-opinion" v-if="getStatusName(order.stanZamowienia) === 'zrealizowane'">
        <h4>Add Opinion</h4>
        <form @submit.prevent="submitOpinion">
          <div>
            <label for="rating">Rating:</label>
            <input type="number" id="rating" v-model="newOpinion.ocena" min="1" max="5" required>
          </div>
          <div>
            <label for="content">Content:</label>
            <textarea id="content" v-model="newOpinion.tresc" required></textarea>
          </div>
          <button type="submit">Submit Opinion</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useStore } from 'vuex';

const store = useStore();
const route = useRoute();
const orderId = route.params.id;
const order = ref(null);
const loading = ref(true);
const error = ref(null);
const newOpinion = ref({
  ocena: '',
  tresc: ''
});
const statuses = ref([]); // Initialize as an empty array

const fetchOrderDetails = async () => {
  try {
    const response = await axios.get(`http://localhost:8100/orders/${orderId}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    order.value = response.data;
  } catch (err) {
    error.value = 'Failed to fetch order details';
  } finally {
    loading.value = false;
  }
};

const fetchStatuses = async () => {
  try {
    const response = await axios.get('http://localhost:8100/status', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    statuses.value = response.data.results; // Ensure the response data is correctly assigned
  } catch (err) {
    console.error('Failed to fetch statuses:', err);
  }
};

const getStatusName = (statusId) => {
  const status = statuses.value.find(status => status._id === statusId);
  return status ? status.nazwa : 'Unknown';
};

const submitOpinion = async () => {
  try {
    const response = await axios.patch(`http://localhost:8100/orders/${orderId}/opinions`, newOpinion.value, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    order.value.opinia.push(response.data);
    newOpinion.value.ocena = '';
    newOpinion.value.tresc = '';
  } catch (err) {
    console.error('Failed to submit opinion:', err);
  }
};

const getProduct = (productId) => {
  return store.state.products.find(product => product._id === productId) || {};
};

onMounted(async () => {
  await store.dispatch('fetchProducts'); // Ensure products are fetched before fetching orders
  await fetchStatuses(); // Fetch statuses before fetching order details
  fetchOrderDetails();
});
</script>

<style scoped>
.order-detail {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading, .error {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.error {
  color: red;
}

.product-list, .opinion-list {
  list-style-type: none;
  padding: 0;
}

.product-item, .opinion-item {
  border-top: 1px solid #ddd;
  padding-top: 10px;
  margin-top: 10px;
}

.add-opinion {
  margin-top: 20px;
}

.add-opinion form {
  display: flex;
  flex-direction: column;
}

.add-opinion form div {
  margin-bottom: 10px;
}

.add-opinion form label {
  margin-bottom: 5px;
}

.add-opinion form input,
.add-opinion form textarea {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-opinion form button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-opinion form button:hover {
  background-color: #0056b3;
}
</style>