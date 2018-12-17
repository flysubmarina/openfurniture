<template>
    <div>
        <item-picker :items="items"></item-picker>
    </div>
</template>

<script>
    import ItemPicker from '../components/ItemPicker.vue'
    export default {
        components:{
            ItemPicker
        },
        data(){
            return{
                items:[
                    {id: 0, heading:'Диван', src:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/A_brown_sofa_%282005-03-03%29.jpg/250px-A_brown_sofa_%282005-03-03%29.jpg'}
                ]
            }
        }
    }
</script>

<style scoped>

</style>