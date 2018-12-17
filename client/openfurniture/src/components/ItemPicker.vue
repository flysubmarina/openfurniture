<template>
    <div class="wrapper">
        <div class="item" v-for="item in items" :key="item.id">
            <h1>{{item.heading}}</h1>
            <img :src="item.src" alt=""/>
            <p class="item-text">{{item.text}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        props :{
            items: Array
        },
        data(){
            return{
                items: this.props.items
            }
        }
    }
</script>

<style scoped>

</style>