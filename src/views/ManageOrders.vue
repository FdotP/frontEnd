<template>
    <div class="manage-orders">
      <div class="order-list-container">
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
            <div v-for="order in filteredOrders" :key="order._id" class="order-item" @click="selectOrder(order)">
              <h3>Order ID: {{ order._id }}</h3>
              <p>Date: {{ new Date(order.dataZatwierdzenia).toLocaleString() }}</p>
              <p>Status: {{ getStatusName(order.stanZamowienia) }}</p>
              <p>Total: {{ calculateTotal(order.listaZakupow) }} zł</p>
              <div v-if="selectedOrder && selectedOrder._id === order._id" class="order-details-container">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> {{ selectedOrder._id }}</p>
                <p><strong>Date:</strong> {{ new Date(selectedOrder.dataZatwierdzenia).toLocaleString() }}</p>
                <p><strong>Status:</strong>
                  <select v-model="selectedOrder.stanZamowienia">
                    <option v-for="status in statuses" :key="status._id" :value="status._id">
                      {{ status.nazwa }}
                    </option>
                  </select>
                </p>
                <p><strong>User:</strong> {{ selectedOrder.nazwaUzytkownika }}</p>
                <p><strong>Email:</strong> {{ selectedOrder.email }}</p>
                <p><strong>Phone:</strong> {{ selectedOrder.numerTelefonu }}</p>
                <table class="order-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Total Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in selectedOrder.listaZakupow" :key="index">
                      <td>{{ getProduct(item.item).nazwa }}</td>
                      <td>
                        <button @click="decrementQuantity(index)">-</button>
                        <input type="number" v-model.number="item.count" min="1" />
                        <button @click="incrementQuantity(index)">+</button>
                      </td>
                      <td>{{ item.price * item.count }} zł</td>
                      <td>
                        <button @click="removeItem(index)">Remove</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="contact-form">
                  <h3>Contact Information</h3>
                  <form @submit.prevent="submitOrder">
                    <div>
                      <label for="username">Username:</label>
                      <input type="text" id="username" v-model="contactInfo.username" required />
                    </div>
                    <div>
                      <label for="email">Email:</label>
                      <input type="email" id="email" v-model="contactInfo.email" required />
                    </div>
                    <div>
                      <label for="phone">Phone:</label>
                      <input type="tel" id="phone" v-model="contactInfo.phone" required />
                    </div>
                    <div>
                      <h3>Total: {{ calculateTotal(selectedOrder.listaZakupow) }} zł</h3>
                    </div>
                    <button type="submit">Submit Order</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-orders">No orders found.</div>
        </div>
      </div>
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
  const statuses = computed(() => store.getters.getStatuses); // Use computed property for statuses
  const selectedStatus = ref('');
  const selectedOrder = ref(null);
  const loading = ref(true);
  const error = ref(null);
  const contactInfo = ref({
    username: '',
    email: '',
    phone: ''
  });
  
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
  
  const selectOrder = (order) => {
    selectedOrder.value = order;
    contactInfo.value.username = order.nazwaUzytkownika;
    contactInfo.value.email = order.email;
    contactInfo.value.phone = order.numerTelefonu;
  };
  
  const getProduct = (productId) => {
    return store.state.products.find(product => product._id === productId) || {};
  };
  
  const incrementQuantity = (index) => {
    selectedOrder.value.listaZakupow[index].count += 1;
  };
  
  const decrementQuantity = (index) => {
    if (selectedOrder.value.listaZakupow[index].count > 1) {
      selectedOrder.value.listaZakupow[index].count -= 1;
    }
  };
  
  const removeItem = (index) => {
    selectedOrder.value.listaZakupow.splice(index, 1);
  };
  
  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.count, 0);
  };
  
  const submitOrder = async () => {
    if (!contactInfo.value.username || !contactInfo.value.email || !contactInfo.value.phone) {
      alert('Please fill in all contact information.');
      return;
    }
    try {
        console.log(selectedOrder.value);
      const response = await axios.patch(`http://localhost:8100/orders/${selectedOrder.value._id}`, {
        _id: selectedOrder.value._id,
        dataZatwierdzenia: selectedOrder.value.dataZatwierdzenia,
        stanZamowienia: getStatusName(selectedOrder.value.stanZamowienia),
        nazwaUzytkownika: contactInfo.value.username,
        email: contactInfo.value.email,
        numerTelefonu: contactInfo.value.phone,
        listaZakupow: selectedOrder.value.listaZakupow,
        opinia: selectedOrder.value.opinie,
      }, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      alert('Order submitted successfully!');
    } catch (err) {
      console.error('Failed to submit order:', err);
      alert('Failed to submit order.');
    }
  };
  
  onMounted(async () => {
    await store.dispatch('fetchProducts'); // Ensure products are fetched before fetching orders
    await store.dispatch('fetchStatuses'); // Fetch statuses using store
    fetchOrders();
  });
  </script>
  
  <style scoped>
  .manage-orders {
    display: flex;
    gap: 20px;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .order-list-container {
    flex: 4;
  }
  
  .order-details-container {
    margin-top: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .order-list {
    padding: 20px;
    background-color: #fff;
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
    cursor: pointer;
  }
  
  .no-orders {
    text-align: center;
    margin-top: 20px;
    color: #666;
  }
  
  .order-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .order-table th, .order-table td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  .contact-form {
    margin-top: 20px;
  }
  
  .contact-form form {
    display: flex;
    flex-direction: column;
  }
  
  .contact-form form div {
    margin-bottom: 10px;
  }
  
  .contact-form form label {
    margin-bottom: 5px;
  }
  
  .contact-form form input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
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