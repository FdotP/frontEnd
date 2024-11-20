<template>

</template>
<script>
import axios from 'axios';

export default{
    name:"home",
    props:['user'],
    
    async created(){
       
        console.log(this.user)


    }
}
</script>