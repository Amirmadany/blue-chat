<template>

    <footer class="chat-page-send-footer">

        <form @submit.prevent="sendChat" class="chat-page-send-form">

            <input v-model="message" class="chat-page-send-input" placeholder="چیزی بنویسید" />

            <button :disabled="loading || loadingSend" type="submit" class="chat-page-send-footer-button send-message-button">
                <i class="fas fa-paper-plane"></i>
            </button>

            <button type="button" class="chat-page-send-footer-button emoji-button"> 
                <i class="fas fa-grin-wink"></i>
            </button>

            <input class="d-none" type="file" ref="fileElement">

            <button @click="() => $refs.fileElement.click()" type="button" class="chat-page-send-footer-button file-button d-none"> 
                <i class="fas fa-paperclip"></i>
            </button>

        </form>

    </footer>

    <Modal :show="errorMessage != ''" @close="closeModal">

        <p v-if="errorMessage != ''"> {{ errorMessage }} </p>

        <div :class="['modal-icon', errorMessage != '' ? 'error' : 'success']">
            
            <span>
                <i class="fas fa-exclamation-triangle"></i>
            </span> 

        </div>

        <button @click="closeModal" class="button submit-button"> تایید </button>

    </Modal>

</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { push } from 'firebase/database'

// components
import Modal from '@/components/Modal'

// composables
import useChat from '@/composables/useChat'
import useUser from '@/composables/useUser'

export default {
    components: {
       Modal 
    },

    props: {
        chatList: [Object, Array],
        loading: Boolean
    },

    setup(props){
        // composables
        const { getMessages, getAllMessages } = useChat()
        const { addChatToChatsUsers } = useUser()
        const loadingSend = ref(false)

        // data
        const store = useStore()
        const chatKey = ref('')
        const route = useRoute()
        const chatEmail = ref(route.params.email)
        const message = ref('')
        const errorMessage = ref('')
        const messageTimer = ref(0)

        // computed
        const emailMe = computed(() => {
            return store.state.auth.auth.email
        })

        // methods
        const checkValid = () => {
            if(message.value.length >= 1)
                return true
            else
                return false
        }

        const sendChat = async () => {
            // come validatation on the text    
            const valid =  checkValid()

            if(!valid && messageTimer.value != null) {
                if(!valid)
                    errorMessage.value = 'لطفا فیلد را پر کنید'
                else
                    errorMessage.value = `شما هر دو ثانیه میتوانید پیام ارسال کنید، دوباره تلاش کنید`

                return
            }

            // make a info for send a message
            const messageInfo = {
                text: message.value,
                created_at: new Date().getTime(),
                owner: emailMe.value,
                seen: false
            }

            loadingSend.value = true

            if(chatKey.value != ''){
                // come add to the messages
                const collection = getMessages(chatKey.value)
    
                await push(collection, messageInfo).catch(error => {
                    errorMessage.value = error?.message
                })

                loadingSend.value = false
            }
            else {                
                // come add a collection to the messages
                const collection = getAllMessages()

                // add message to the database
                const response = await push(collection, {
                    '-AMpxS6gvIcgscai-O7sA': messageInfo
                })

                if(response.key){
                    // add a key to users
                    addChatToChatsUsers(response.key, chatEmail.value) 
                    
                    chatKey.value = response.key
                }

                loadingSend.value = false
            }

            // come reset the message
            message.value = ''

            // after each send come 2.5s wait and then send message
            messageTimer.value = setTimeout(() => {
                
                // after 2.5s come do this
                clearTimeout(messageTimer.value)
                messageTimer.value = null

            }, 2500)
        }

        const getChatKey = () => {
            // come check exist any message with him or no
            props.chatList.map(item => {
                
                // if user be same user come do
                if(item.email == chatEmail.value){

                    // find the key of chat
                    for(const index in item.chats){
                        if(item.chats[index].email == store.state.auth.auth.email)
                            chatKey.value = item.chats[index].chat_key
                    }

                }

            })
        }

        const closeModal = () => {
            // hide all modal
            errorMessage.value = ''
        }

        // watch
        watch(props, () => {
            getChatKey()
        })

        watch(route, () => {
            // come set new data
            chatEmail.value = route.params.email

            getChatKey()
        })

        onMounted(() => {
            getChatKey()
        })

        return {
            chatKey, message, errorMessage, loadingSend,
            sendChat, closeModal
        }
    }
}
</script>

<style>

</style>