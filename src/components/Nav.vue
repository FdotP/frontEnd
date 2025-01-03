<script setup>
const props = defineProps({
  user: {
    required: false, 
  }
});


const logout = () => {
  // Wylogowanie użytkownika (przykład: usunięcie tokenu i przekierowanie)
  localStorage.removeItem('token');
  
  window.location.reload(); // Odświeżenie strony, aby odświeżyć stan aplikacji
};

</script>

<template>
  <header>    
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand">
          <RouterLink to="/"> Home</RouterLink>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav">
            <li class="nav-item">
              <!-- <a class="nav-link active" aria-current="page" href="/">Home</a> -->
            </li>
          </ul>
          <slot></slot>
          <ul class="navbar-nav">
            <li class="nav-item dropdown d-flex search">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <!-- Jeśli użytkownik jest zalogowany, pokaż nazwę użytkownika, w przeciwnym razie 'Signin/Signup' -->
                {{ !props.user || Object.keys(props.user).length === 0 ?  'Signin/Signup' :props.user  }}
              </a>
              <ul class="dropdown-menu">
                <!-- Jeśli użytkownik jest zalogowany, pokaż 'Logout' -->
                <li v-if="props.user && Object.keys(props.user).length > 0"><a class="dropdown-item" @click.prevent="logout" href="#">Logout</a></li>
                <!-- Jeśli użytkownik nie jest zalogowany, pokaż opcje logowania i rejestracji -->
                <li v-if="!props.user || Object.keys(props.user).length === 0"><a class="dropdown-item">
                    <RouterLink to="/login">Login </RouterLink>
                  </a></li>
                <li v-if="!props.user || Object.keys(props.user).length === 0"><a class="dropdown-item">
                    <RouterLink to="/register">Register</RouterLink>
                  </a></li>
              </ul>
            </li>
          </ul>

        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
#navbarCollapse {
  justify-content: space-between;
}
</style>
