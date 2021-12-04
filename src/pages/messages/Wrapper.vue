<template>

    <div class="page-content messages-page direction-left"
        :class="{'message-page-chat': currentPage == 'chat'}">
        
        <div class="row">
            
            <div class="col-lg-4">
                
                <div class="chat-list-wrapper">

                    <ChatList  
                        v-show="currentPage == 'everything' || currentPage == 'users'"
                        :chat-list="finallyChatList"
                        :loading="chatListLoading"
                        :last-messages="lastMessages"
                    />    

                </div>

            </div>

            <div class="col-lg-8">

                <Chat 
                    v-if="(currentPage == 'chat' || currentPage == 'everything') && !isNothingChatPage"
                    :is-mobile-size="isMobileSize"
                    :chatList="chatList"
                    :myMessages="myMessages"
                    :loading="loadingChatMessage"
                    :last-messages="lastMessages"
                />

                <div v-else class="chat-empty-page">

                    <i class="far fa-comment-alt"></i>

                    <span class="mt-4 d-block"> لطفا یه شخص را برای چت انتخاب کنید </span>

                </div>

            </div>

        </div>

    </div>

    <SendChat 
        v-if="(currentPage == 'chat' || currentPage == 'everything') && !isNothingChatPage"
        :chatList="chatList"
        :loading="loadingChatMessage"
    />

</template>

<script>
import { ref, onMounted, onUnmounted, computed, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { onValue } from 'firebase/database'
 
// components
import ChatList from './ChatList.vue'
import Chat from './Chat.vue'
import SendChat from '@/components/message/SendChat.vue'

// composables
import useUser from '@/composables/useUser.js'
import useChat from '@/composables/useChat'

export default {
    components: {
        ChatList,
        Chat,
        SendChat
    },
    
    setup() {
        // composables
        const { getRealTimeUser } = useUser()
        const { getAllMessages } = useChat()

        // data
        const isMobileSize = ref(false)
        const route = useRoute()
        const store = useStore()
        const chatList = ref([])
        const chatListLoading = ref(true)
        const messages = ref(null)
        const myMessages = ref([])
        const loadingChatMessage = ref(true)
        const lastMessages = ref([])
        const allUsers = ref({})
        const chatsInfo = ref([])
        const finallyChatList = ref([])

        // computed
        const currentPage =  computed(() => {
            // check user want see a chat or chatList
            if(route.path == '/' && isMobileSize.value)
                return 'users'

            else if(!isMobileSize.value)
                return 'everything'

            else
                return 'chat'
        })
        const userInfo = computed(() => {
            return store.state.auth.auth
        })
        const isNothingChatPage = computed(() => {
            if(route.path.includes('/chat/'))
               return false
            else
               return true
        })

        // methods
        const applySizeApp = () => {
            // apply mode size app => mobile or computer
            if(window.innerWidth >= 991)
                isMobileSize.value = false
            else
                isMobileSize.value = true
        }

        const getUsers = async () => {
            // get collection users
            const collection = getRealTimeUser()

            // come get and update when changed users
            onValue(collection, (snapshot) => {
                if(snapshot.exists()){
                    allUsers.value = snapshot.val()

                    getChatList()
                    getOnlyMyMessages()
                }

            })
        }

        const sortLastMessage = (chats) => {
            
            const chatSorted = chats.sort((a, b) => {
                if(a.content.created_at < b.content.created_at)
                    return 1

                else if(a.content.created_at > b.content.created_at)
                    return -1

                else
                    return 0
            })
            const originalChatsList = []
            
            // bind user info to chat info
            chatSorted.map(item => {
                
                chatList.value.map(user => {

                    for(const key in user.chats){
                        
                        if(user.chats[key].chat_key == item.key)
                            originalChatsList.push({
                                chatInfo: item,
                                userInfo: user
                            })
                    }

                })

            })

            // change loading status to disable
            chatListLoading.value = false

            finallyChatList.value = originalChatsList
        }

        const getLastMessage = () => {
            const lastChats = []

            // go to the my messages and find each chat with my friends
            myMessages.value.map(item => {
                let lastMessage = null
                let countSeen = 0

                for(const key in item.content){
                    if(!item.content[key].seen && item.content[key].owner != userInfo.value.email)
                        countSeen++

                    lastMessage = {
                        key: item.key,
                        content: item.content[key],
                        countSeen
                    }
                }

                lastChats.push(lastMessage)
            })

            const myLastChat = []

            // get only my last chats no all
            lastChats.map(chat => {

                chatsInfo.value.map(item => {
                    if(item.chat_key == chat.key)
                        myLastChat.push(chat)

                })

            })

            sortLastMessage(myLastChat)
        }

        const getChatList = async () => {  
            let me = {}

            // get info from logged user
            for(const key in allUsers.value){

                // find my account info
                if(allUsers.value[key].email == userInfo.value.email)
                    me = allUsers.value[key]

            }
            
            const chats = []

            // get chats from user
            if(me.chats)
                for(const key in me.chats)
                    chats.push(me.chats[key])

            // get info from chat list that have email
            const chatListInfo = []

            // get info users for my chats
            for(const key in allUsers.value){
                
                chats.map(item => {

                    if(item.email == allUsers.value[key].email){
                        chatListInfo.push(allUsers.value[key])
                    }

                })

            }

            if(chatListInfo.length == 0)
                chatListLoading.value = false

            chatList.value = chatListInfo
            chatsInfo.value = chats
        }

        const getAllMessagesInfo = () => {
            // get collection
            const collection = getAllMessages()

            onValue(collection, (snapshot) => {
                if(snapshot.exists())
                    messages.value = snapshot.val()

                // change loading status to disable
                loadingChatMessage.value = false

                getChatList()
            })
        }

        const getOnlyMyMessages = () => {
            // if not be exist come back
            if(messages.value == null || chatList.value.length == 0) return

            const needMessages = []

            // come get my need messages
            for(const key in messages.value){

                chatList.value.map(item => {

                    for(const index in item.chats){
                        // if find message with this key it mean is for me
                        if(item.chats[index].chat_key == key)
                            needMessages.push({
                                key,
                                content: messages.value[key]
                            })
                    }
                })  

            }

            myMessages.value = needMessages

            // come get last message and append to chatListInfo
            getLastMessage()

            // come get last message of same messages
            const lastChatOfUsers = []

            needMessages.map(item => {
                let lastMessage = null

                let seens = 0
                // get last message of each item
                for(const key in item.content){
                    
                    if(!item.content[key].seen && item.content[key].owner != store.state.auth.auth.email)
                        ++seens

                    // get time
                    let time = new Date(Number(item.content[key].created_at))
                    time = String(time).split(' ')[4].split(':').slice(0, 2).join(':')

                    lastMessage = {
                        key: item.key,
                        text: item.content[key].text,
                        created_at: time,
                        seen: seens
                    }
                    
                }

                lastChatOfUsers.push(lastMessage)
            })

            lastMessages.value = lastChatOfUsers
        }   

        // watch
        watch(userInfo, getChatList)

        watchEffect(() => {
            // when messages or chatList updated come do
            getOnlyMyMessages(messages.value, chatList.value)
        })

        // lifecycle hooks
        onMounted(async () => {
            applySizeApp()

            // when resized app come say to me 
            window.addEventListener('resize', applySizeApp)

            await getUsers()

            getChatList()

            getAllMessagesInfo()
        })

        onUnmounted(() => {
            // delete resize event
            window.removeEventListener('resize', applySizeApp)
        })
        
        return {
            isMobileSize, currentPage, chatList,
            isNothingChatPage, myMessages, loadingChatMessage,
            lastMessages,
            chatListLoading, finallyChatList
        }
    }
}
</script>

<style scoped>

</style>