import { createStore } from 'vuex';
import axios from 'axios';


export default createStore({
  state: {
    products: [],
    cartProducts: [],
    currentProduct: {},
    showModal: false,
    showPopupCart: false,
  },

  getters: {
    getProducts: state => state.products,
    getProductsInCart: state => state.cartProducts,
    getCurrentProduct: state => state.currentProduct,
    getShowModal: state => state.showModal,
    getPopupCart: state => state.showPopupCart,
  },

  mutations: {
    GET_PRODUCTS_FROM_DATABASE: (state, products) => {
      state.products = products;
    },
    ADD_PRODUCT: (state, product) => {
      state.cartProducts.push(product);
    },
    REMOVE_PRODUCT: (state, index) => {
      state.cartProducts.splice(index, 1);
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
  },
});
