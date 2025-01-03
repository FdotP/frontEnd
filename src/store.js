import { createStore } from 'vuex';
import axios from 'axios';
import { ScatterController } from 'chart.js';


export default createStore({
  state: {
    products: [],
    cartProducts: JSON.parse(localStorage.getItem('cartProducts')) || [],  // Załaduj dane z localStorage, jeśli istnieją
    currentProduct: {},
    showModal: false,
    showPopupCart: false,
    user:{}
  },

  getters: {
    getProducts: state => state.products,
    getProductsInCart: state => state.cartProducts,
    getCurrentProduct: state => state.currentProduct,
    getShowModal: state => state.showModal,
    getPopupCart: state => state.showPopupCart,
    getUser: state => state.user,
  },

  mutations: {
    GET_PRODUCTS_FROM_DATABASE: (state, products) => {
      state.products = products;
    },
    ADD_PRODUCT: (state, product) => {
      state.cartProducts.push(product);
      localStorage.setItem('cartProducts', JSON.stringify(state.cartProducts));  // Zapisz koszyk w localStorage
    },
    REMOVE_PRODUCT: (state, index) => {
      state.cartProducts.splice(index, 1);
      localStorage.setItem('cartProducts', JSON.stringify(state.cartProducts));  // Zapisz koszyk w localStorage
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
    SET_USER:(state, user)=>{
      state.user = user;
    },
  },

  actions: {
    async getProductsFromDatabase({ commit }) {
      try {
        const response = await axios.get("http://localhost:8100/products/", {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        commit('GET_PRODUCTS_FROM_DATABASE', response.data);
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    addProduct({ commit }, product) {
      commit('ADD_PRODUCT', product);
    },
    removeProduct({ commit }, index) {
      commit('REMOVE_PRODUCT', index);
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
