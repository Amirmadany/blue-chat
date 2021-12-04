<template>

    <form @submit.prevent="" class="search-user-chats-form">
        
        <div class="search-user-chats-wrapper">
        
            <input v-model="search" class="search-user-chats-input" type="text" placeholder="جستجوی کاربران">
        
            <i class="search-user-chats-icon fas fa-search"></i>
        
        </div>  

    </form>

</template>

<script>
import { ref, watch } from 'vue'

export default {
    props: {
        chatList: [Object, Array]
    },

    emits: ['search'],

    setup(props, { emit }){
        // data
        const search = ref('')

        // watch
        watch(search, (value) => {
            const result = []

            // find the chat
            props.chatList.map(item => {
                if(item.userInfo.displayName.toLowerCase().includes(value.toLowerCase()) || 
                   item.userInfo.email.toLowerCase().includes(value.toLowerCase()))
                    result.push(item)
            })

            // come go to parent and give search result
            emit('search', result)
        })

        return {
            search
        }
    }
}
</script>

<style>

</style>