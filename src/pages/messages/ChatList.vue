<template>

    <div 
        class="chat-list ps-md-4"
        :class="{'low-count': 3 <= 2}"
    >
        
        <h4 class="chat-list-title"> Chats </h4>

        <div class="chat-list-content">

            <SearchChatList 
                :chatList="chatList"
                @search="showSearchResult"
            />

            <div v-if="loading" class="text-center mx-auto">
                <div class="spinner-border text-primary mx-auto"></div>
            </div>

            <!-- chat item -->
            <router-link
                v-else
                v-for="(item, index) in filteredChats" :key="index + item"  
                class="chat-list-item my-3"
                active-class="active"
                :to="{name: 'chat', params: { email: item.userInfo.email }}">
                
                <div class="chat-list-item-image">
                    
                    <img v-if="item.userInfo.photoURL != null && item.userInfo.photoURL != '' && item.userInfo.photoURL != undefined" :src="item.userInfo.photoURL" alt="">

                    <img v-else :src="require('@/assets/images/user-pic.jpg')" alt="">

                </div>

                <div class="chat-list-item-info">
                    
                    <div class="chat-list-item-user-info">
                    
                        <h5 class="chat-list-item-user-name"> {{ item.userInfo.displayName ? item.userInfo.displayName : 'none name' }} </h5>

                        <p class="chat-list-item-time"> {{ item.chatInfo.content.created_at ?  String(new Date(Number(item.chatInfo.content.created_at))).split(' ')[4].split(':').slice(0, 2).join(':') : '00:00' }} </p>

                    </div>

                    <div class="chat-list-item-chat-info" >
                        
                        <p class="chat-list-item-user-message">  {{ item.chatInfo.content.text ? item.chatInfo.content.text : 'empty' }} </p>

                        <span v-if="item.chatInfo.countSeen > 0" class="chat-list-count-message"> {{ item.chatInfo.countSeen ? item.chatInfo.countSeen : '' }} </span>

                    </div>

                </div>

            </router-link>

            <p v-if="(chatList.length == 0 || filteredChats.length <= 0) && !loading" class="text-secondary text-center"> پیامی موجود نیست </p>

            <div class="chat-list-spacer-bottom">

            </div>

        </div>

    </div>

</template>

<script>
// components
import SearchChatList from '@/components/message/SearchChatList.vue'
import { ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'

export default {
    components: {
        SearchChatList
    },

    props: {
        chatList: [Object, Array],
        lastMessages: [Object, Array],
        loading: Boolean
    },

    setup(props){
        // data
        const filteredChats = ref(props.chatList)

        // watch
        watch(props, () => {
            filteredChats.value = props.chatList
        })

        // methods
        const showSearchResult = (result) => {
            filteredChats.value = result
        }

        return {
            filteredChats,
            showSearchResult
        }
    }
}
</script>

<style scoped>

</style>