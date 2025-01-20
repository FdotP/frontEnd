import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    products: [],
    categories: [],
    statuses: [],
    cartProducts: JSON.parse(localStorage.getItem('cartProducts')) || [],
    currentProduct: {},
    showModal: false,
    showPopupCart: false,
    user: JSON.parse(localStorage.getItem('user')) || {}, // Ensure user is stored in state
    orders: []
  },

  getters: {
    getProducts: state => state.products,
    getCategories: state => state.categories,
    getStatuses: state => state.statuses,
    getProductsInCart: state => state.cartProducts,
    getCurrentProduct: state => state.currentProduct,
    getShowModal: state => state.showModal,
    getPopupCart: state => state.showPopupCart,
    getUser: state => state.user, // Getter for user
    getOrders: state => state.orders,
  },

  mutations: {
    setOrders: (state, orders) => {
      state.orders = orders;
    },
    setProducts: (state, products) => {
      state.products = products;
    },
    setCategories: (state, categories) => {
      state.categories = categories;
    },
    setStatuses: (state, statuses) => {
      state.statuses = statuses;
    },
    ADD_PRODUCT: (state, product) => {
      const existingProduct = state.cartProducts.find(p => p._id === product._id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.cartProducts.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cartProducts', JSON.stringify(state.cartProducts));
    },
    REMOVE_PRODUCT: (state, index) => {
      state.cartProducts.splice(index, 1);
      localStorage.setItem('cartProducts', JSON.stringify(state.cartProducts));
    },
    CLEAR_CART: (state) => {
      state.cartProducts = [];
      localStorage.removeItem('cartProducts');
    },
    INCREMENT_PRODUCT_QUANTITY: (state, productId) => {
      const product = state.cartProducts.find(p => p._id === productId);
      if (product) {
        product.quantity += 1;
        localStorage.setItem('cartProducts', JSON.stringify(state.cartProducts));
      }
    },
    DECREMENT_PRODUCT_QUANTITY: (state, productId) => {
      const product = state.cartProducts.find(p => p._id === productId);
      if (product && product.quantity > 1) {
        product.quantity -= 1;
        localStorage.setItem('cartProducts', JSON.stringify(state.cartProducts));
      }
    },
    CURRENT_PRODUCT: (state, product) => {
      state.currentProduct = product;
    },
    SHOW_MODAL: (state) => {
      state.showModal = !state.showModal;
    },
    SHOW_POPUP_CART: (state) => {
      state.showPopupCart = !state.showPopupCart;
    },
    SET_USER: (state, user) => {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user)); // Store user in local storage
    },
  },

  actions: {
    async fetchOrders({ commit }) {
      try {
        const response = await axios.get("http://localhost:8100/orders/", {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        commit('setOrders', response.data.results);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    },
    async fetchProducts({ commit }) {
      try {
        const response = await axios.get("http://localhost:8100/products/", {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        commit('setProducts', response.data.results);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    async fetchCategories({ commit }) {
      try {
        const response = await axios.get("http://localhost:8100/categories/", {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        commit('setCategories', response.data.results);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async fetchStatuses({ commit }) {
      try {
        const response = await axios.get("http://localhost:8100/status", {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        commit('setStatuses', response.data.results);
      } catch (error) {
        console.error('Error fetching statuses:', error);
      }
    },
    addProduct({ commit }, product) {
      commit('ADD_PRODUCT', product);
    },
    removeProduct({ commit }, index) {
      commit('REMOVE_PRODUCT', index);
    },
    clearCart({ commit }) {
      commit('CLEAR_CART');
    },
    incrementProductQuantity({ commit }, productId) {
      commit('INCREMENT_PRODUCT_QUANTITY', productId);
    },
    currentProduct({ commit }, product) {
      commit('CURRENT_PRODUCT', product);
    },
    showOrHiddenModal({ commit }) {
      commit('SHOW_MODAL');
    },
    showOrHiddenPopupCart({ commit }) {
      commit('SHOW_POPUP_CART');
    },
    async setUser({ commit }) {
      try {
        const response = await axios.get("http://localhost:8100/user", {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        commit('SET_USER', response.data);
      } catch (err) {
        console.error(err);
      }
    },
  },
});