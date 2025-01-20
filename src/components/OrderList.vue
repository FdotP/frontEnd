<template>
  <div class="order-list">
    <h2>Order List</h2>
    <div class="filter-status">
      <h4>Filter Orders by Status</h4>
      <select v-model="selectedStatus" @change="filterOrdersByStatus">
        <option value="">All Statuses</option>
        <option v-for="status in statuses" :key="status._id" :value="status._id">
          {{ status.nazwa }}
        </option>
      </select>
    </div>
    <div v-if="loading" class="loading">Loading orders...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="filteredOrders.length">
      <div v-for="order in filteredOrders" :key="order._id" class="order-item">
        <h3>Order ID: {{ order._id }}</h3>
        <p>Date: {{ new Date(order.dataZatwierdzenia).toLocaleString() }}</p>
        <p>Status: {{ getStatusName(order.stanZamowienia) }}</p>
        <p>Total: {{ calculateTotal(order.listaZakupow) }} zł</p>
        <button @click="viewOrderDetails(order._id)">View Details</button>
      </div>
    </div>
    <div v-else class="no-orders">No orders found.</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';

const store = useStore();
const router = useRouter();
const orders = ref([]);
const filteredOrders = ref([]);
const statuses = ref([]);
const selectedStatus = ref('');
const loading = ref(true);
const error = ref(null);

const fetchOrders = async () => {
  try {
    await store.dispatch('fetchOrders');
    orders.value = store.getters.getOrders;
    filteredOrders.value = orders.value;
  } catch (err) {
    error.value = 'Failed to fetch orders';
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

const filterOrdersByStatus = () => {
  if (!selectedStatus.value) {
    filteredOrders.value = orders.value;
  } else {
    filteredOrders.value = orders.value.filter(order => order.stanZamowienia === selectedStatus.value);
  }
};

const viewOrderDetails = (orderId) => {
  router.push({ path: `/orders/${orderId}` });
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.count, 0);
};

onMounted(async () => {
  await store.dispatch('fetchProducts'); // Ensure products are fetched before fetching orders
  await fetchStatuses(); // Fetch statuses before fetching orders
  fetchOrders();
});
</script>

<style scoped>
.order-list {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-list h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.filter-status {
  margin-bottom: 20px;
  text-align: center;
}

.filter-status select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.loading, .error {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.error {
  color: red;
}

.order-item {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
}

.no-orders {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
</style>