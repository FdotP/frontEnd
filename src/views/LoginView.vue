<template>
    <main class="form-signin w-100 m-auto">
      <form @submit.prevent="handleSubmit">
      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

      <div class="form-floating">
        <input type="login" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="login">
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="password">
        <label for="floatingPassword">Password</label>
      </div>

      <div class="form-check text-start my-3">
        <input class="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault">
        <label class="form-check-label" for="flexCheckDefault">
          Remember me
        </label>
      </div>
      <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
      <p class="mt-5 mb-3 text-body-secondary">&copy; 2017–2024</p>
    </form>
</main>
</template>
<script>
    import axios from 'axios';
    export default{
        name:'login',
        data(){
            return{
                login:'',
                password:''
            }
        },
        methods:{
            async handleSubmit(){
                const data = {
                    login: this.login,
                    password:this.password
                }
                const response = await axios.post("http://localhost:8100/login", data).then(
                    res => {
                      console.log(res.data.token)
                      localStorage.setItem('token',res.data.token);
                      this.$router.push({path:"/"})
                    }
                ).catch(
                    err => {console.log(err)}
                )
                
            }

        }
    }
  </script>

  <style scoped>
    

  </style>