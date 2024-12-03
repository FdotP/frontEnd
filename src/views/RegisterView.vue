<template>
    <main class="form-signin w-100 m-auto">
        <form @submit.prevent="handleSubmit">
        <h1 class="h3 mb-3 fw-normal">Please sign up</h1>

        <div class="form-floating">
        <input type="login" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="login">
        <label for="floatingInput">Email address</label>
        </div>
        <div class="form-floating">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="password">
        <label for="floatingPassword">Password</label>
        </div>

        <button class="btn btn-primary w-100 py-2" type="submit">Sign up</button>
        <p class="mt-5 mb-3 text-body-secondary">&copy; 2017–2024</p>
    </form>
    </main>
</template>
<script>
    import axios from 'axios';
    import { reactive } from 'vue';
    export default{
        name:'register',
        data(){
            return{
                login:'',
                password:''
            }
        },
        methods:{
            handleSubmit(){
                const data = {
                    login: this.login,
                    password:this.password
                }
                axios.post("http://localhost:8100/register", data).then(
                    res => {console.log(res)},
                    this.$router.push({path:"/login"})
                ).catch(
                    err => {console.log(err)}
                )
            }
        }
    }
</script>