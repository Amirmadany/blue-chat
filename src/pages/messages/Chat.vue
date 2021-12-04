<template>

    <header v-if="isMobileSize" class="chat-page-header d-flex align-items-center justify-content-between">

        <button @click="backToChatList" class="header-back-btn">
            <i class="fas fa-arrow-left"></i>
        </button>

        <h6 class="chat-page-name"> {{ userData.displayName ? userData.displayName : userData.email ? userData.email : 'loading...' }} </h6>

        <div class="chat-page-image">

            <img v-if="userData.photoURL != '' && userData.photoURL != null && userData.photoURL != undefined" :src="userData.photoURL" alt="">
                    
            <img v-else :src="require('@/assets/images/user-pic.jpg')" alt="">

        </div>

    </header>

    <div class="chat-page">

        <div class="chat-page-content">

            <div v-if="messages != null && !loading" class="message-list">

                <div 
                    v-for="(item, index) in messages" :key="index"
                    class="message-list-item"
                    :class="{'me': item.owner == myAccount.email}"
                >

                    <div class="message-list-item-image">
                    
                        <img v-if="(userData.photoURL != '' && userData.photoURL != null && userData.photoURL != undefined) && item.owner != myAccount.email" :src="userData.photoURL" alt="">
                        
                        <img v-else-if="myAccount.photoURL != '' && myAccount.photoURL != null && myAccount.photoURL != undefined && item.owner == myAccount.email" :src="myAccount.photoURL" alt="">

                        <img v-else :src="require('@/assets/images/user-pic.jpg')" alt="">

                    </div>

                    <p class="message-list-item-text mb-0"> {{ item.text }} </p>

                    <span class="message-list-item-time"> {{ String(new Date(Number(item.created_at))).split(' ')[4].split(':').slice(0, 2).join(':') }} </span>

                </div>

            </div>

            <div ref="scrollAutoBottom" class="scroll-auto-to-bottom"></div>

            <div v-if="loading" class="loading-chat-list mx-auto text-center">
                <span class="spinner-border text-primary"></span>
            </div>

            <div v-if="messages == null && !loading" class="loading-chat-list mx-auto text-center">
                
                <i class="far fa-comment-alt"></i>
                <span> start message with {{ userData.displayName ? userData.displayName : 'him' }} </span>

            </div>

        </div>

    </div>    

</template>

<script>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { update } from 'firebase/database'

// composables
import useChat from '@/composables/useChat'

export default {
    props: {
        isMobileSize: {
            type: Boolean,
            default: true
        },

        myMessages: [Array, Object],
        chatList: [Array, Object],
        loading: Boolean,
        lastMessages: [Array, Object]
    },

    setup(props){
        // composables
        const { getMessages } = useChat()

        // data
        const router = useRouter()
        const route = useRoute()
        const chatEmail = ref(route.params.email)
        const store = useStore()
        const state = reactive({
            chatKey: ''
        })
        const messages = ref(null)
        const userData = ref({})
        const scrollAutoBottom = ref()

        // computed
        const myAccount = computed(() => {
            return store.state.auth.auth
        })

        // methods
        const backToChatList = () => {
            router.push({ name: 'messages' })
        }

        const seenMessage = () => {
            props.lastMessages.map(item => {
                // if find this message come seen chats
                if(item.key == state.chatKey && item.seen > 0 && store.state.auth.auth.email != item.owner){
                    // come see all message from this user
                    const collection = getMessages(item.key)

                    // update seen all messages
                    for(const key in messages.value){
                        messages.value[key].seen = true
                    }

                    update(collection, messages.value)
                    .catch((error) => {
                        console.log(error)
                    })
                }
                    
            })
        }

        const getUserData = () => {
            const users = store.state.users.users

            for(const key in users){
                if(users[key].email == route.params.email)
                    userData.value = users[key]
            }
        }

        const getChats = async () => {
            // get user data
            getUserData()

            // come check exist any message with him or no
            props.chatList.map(item => {
                // if user be same user come do
                if(item.email == chatEmail.value){

                    // find the key of chat
                    for(const index in item.chats){
                        if(item.chats[index].email == store.state.auth.auth.email)
                            state.chatKey = item.chats[index].chat_key
                    }

                    // get user data your friend
                    userData.value = item
                }
            })

            // if exist come get messages
            if(state.chatKey != null && state.chatKey != '' && state.chatKey != ''){
                props.myMessages.map(item => {
                    if(item.key == state.chatKey){
                        messages.value = item.content
        
                        // come seen all messages
                        seenMessage()
                    }
                })
            }
        }

        // watch
        watch(props, () => {
            // if user be on the chat page come get messages
            if(route.path.includes('/chat/'))
                getChats()

            scrollAutoBottom.value.scrollIntoView('smooth')
        })
        watch(route, () => {
            // update user email
            chatEmail.value = route.params.email

            // come empty the messages
            messages.value = null

            // then come get again the messages
            getChats()
        })

        // lifecycle hooks
        onMounted(() => {
           getChats()
        })

        return {
            messages, userData, myAccount, scrollAutoBottom,
            backToChatList
        }
    }
}
</script>

<style scoped>
    
    .loading-chat-list{
        margin-top: 20%;
    }

</style>