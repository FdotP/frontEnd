<template>
    <div>
      <transition name="fade">
        <div class="modal" v-if="showModal">
          <h3>Details</h3>
          <slot></slot>
          <btn btnColor="btn btn-small btn-danger" @click="closeModal">
            Close
          </btn>
        </div>
      </transition>
      <transition name="fade">
        <maskBg v-if="showModal" @click="closeModal" />
      </transition>
    </div>
  </template>
  
  <script setup>
  import { useStore } from 'vuex';
  import { computed } from 'vue';
  import btn from './Btn.vue';
  import maskBg from './Mask.vue';
  
  // Importowanie store
  const store = useStore();
  
  // Getter
  const showModal = computed(() => store.getters.getShowModal);
  
  // Metody
  const closeModal = () => {
    store.dispatch('showOrHiddenModal');
  };
  
  </script>
  
  <style scoped>
  .modal {
    width: 100%;
    max-width: 500px;
    height: 300px;
    box-sizing: border-box;
    padding: 1em;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    box-shadow: 0 0 10px rgba(144, 144, 144, 0.2);
    border: 0;
    border-radius: 5px;
    line-height: 1.5em;
    opacity: 1;
    transition: all 0.5s;
    z-index: 1;
  }
  
  .modal button {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.7s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  