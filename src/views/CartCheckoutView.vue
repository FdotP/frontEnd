<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { defineProps } from 'vue';

const props = defineProps({
  user: {}
});

const store = useStore();
const router = useRouter();

const getProductsInCart = computed(() => store.getters.getProductsInCart);

const hasProduct = computed(() => getProductsInCart.value.length > 0);

const totalPrice = computed(() => {
  return getProductsInCart.value.reduce((current, next) => current + next.cena * next.quantity, 0);
});

const incrementQuantity = (product) => {
  store.commit('INCREMENT_PRODUCT_QUANTITY', product._id);
};

const decrementQuantity = (product) => {
  if (product.quantity > 1) {
    store.commit('DECREMENT_PRODUCT_QUANTITY', product._id);
  } else {
    store.commit('REMOVE_PRODUCT', getProductsInCart.value.indexOf(product));
  }
};

const remove = (index) => {
  store.commit('REMOVE_PRODUCT', index);
};

const finalizeOrder = async () => {
  try {
    const orderData = {
      dataZatwierdzenia: new Date(),
      nazwaUzytkownika: props.user.login,
      email: props.user.email,
      numerTelefonu: String(props.user.phoneNumber),
      listaZakupow: getProductsInCart.value.map(product => ({
        item: product._id,
        count: product.quantity,
        price: product.cena
      }))
    };

    await axios.post('http://localhost:8100/orders', orderData, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });

    store.commit('CLEAR_CART');
    alert('Order placed successfully!');
    router.push('/');
  } catch (error) {
    console.error('Failed to place order:', error);
    alert('Failed to place order.');
  }
};
</script>

<template>
  <div class="cart-checkout">
    <h2>Cart Checkout</h2>
    <div v-if="!hasProduct" class="empty-cart">No products in cart.</div>
    <div v-else>
      <div v-for="(product, index) in getProductsInCart" :key="index" class="cart-item">
        <div class="item-details">
          <h3>{{ product.nazwa }}</h3>
          <p>Price: {{ product.cena }} zł</p>
          <p>Quantity: {{ product.quantity }}</p>
        </div>
        <div class="item-actions">
          <button @click="decrementQuantity(product)">-</button>
          <button @click="incrementQuantity(product)">+</button>
          
          <button @click="remove(index)">Remove</button>
        </div>
      </div>
      <div class="cart-total">
        <h3>Total: {{ totalPrice }} zł</h3>
      </div>
      <button class="finalize-order" @click="finalizeOrder">Place Order</button>
    </div>
  </div>
</template>

<style scoped>
.cart-checkout {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.cart-checkout h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.empty-cart {
  text-align: center;
  color: #666;
  font-size: 18px;
  margin-top: 20px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}

.item-details {
  flex: 2;
}

.item-actions {
  display: flex;
  gap: 10px;
}

.item-actions button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.item-actions button:hover {
  background-color: #0056b3;
}

.cart-total {
  margin-top: 20px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.finalize-order {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
}

.finalize-order:hover {
  background-color: #218838;
}
</style>