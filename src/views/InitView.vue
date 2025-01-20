<template>
    <div class="init-view">
      <h2>Initialize Database</h2>
      <form @submit.prevent="submitFile">
        <div class="form-group">
          <label for="fileInput">Select JSON File:</label>
          <input type="file" id="fileInput" @change="handleFileChange" accept=".json" required />
        </div>
        <button type="submit" class="btn btn-primary">Initialize Database</button>
      </form>
      <div v-if="message" class="alert" :class="{'alert-success': success, 'alert-danger': !success}">
        {{ message }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const file = ref(null);
  const message = ref('');
  const success = ref(false);
  
  const handleFileChange = (event) => {
    file.value = event.target.files[0];
  };
  
  const submitFile = async () => {
    if (!file.value) {
      message.value = 'Please select a file.';
      success.value = false;
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file.value);
  
    try {
      const response = await axios.post('http://localhost:8100/init', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.value = response.data.message;
      success.value = true;
    } catch (error) {
      message.value = 'Failed to initialize database.';
      success.value = false;
    }
  };
  </script>
  
  <style scoped>
  .init-view {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .btn {
    display: block;
    width: 100%;
  }
  
  .alert {
    margin-top: 20px;
    padding: 10px;
    border-radius: 4px;
  }
  
  .alert-success {
    background-color: #d4edda;
    color: #155724;
  }
  
  .alert-danger {
    background-color: #f8d7da;
    color: #721c24;
  }
  </style>