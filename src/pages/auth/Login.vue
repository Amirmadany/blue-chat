<template>

    <div class="box">

        <form @submit.prevent="loginUser" class="auth-form">

            <div class="auth-form-content">

                <input v-model.trim="user.email" class="auth-form-input" type="email" placeholder="ایمیل">
                <input v-model.trim="user.password" class="auth-form-input" type="password" placeholder="رمز عبور">

            </div>

            <button class="button login-button auth-form-btn" :disabled="loading"> 
                <span v-if="loading" class="loading">
                    <span class="spinner-border spinner-border-sm"></span>
                </span>
                <span v-else>ورود</span>    
            </button>

        </form>

        <GoogleAuth 
            @openedError="showErrorMessage"
            @openedSuccess="showSuccessMessage"
        />

        <router-link :to="{ name: 'register' }" class="button text-button"> حساب کاربری ندارید؟ </router-link>

    </div>

    <Modal :show="errorMessage != '' || successMessage != ''" @close="closeModal">

        <p v-if="errorMessage != ''"> {{ errorMessage }} </p>
        <p v-else> {{ successMessage }} </p>

        <div :class="['modal-icon', errorMessage != '' ? 'error' : 'success']">
            
            <span v-if="errorMessage != ''">
                <i class="fas fa-exclamation-triangle"></i>
            </span> 

            <span v-else>
                <i class="fas fa-check-circle"></i>
            </span>

        </div>

        <button @click="closeModal" class="button submit-button"> تایید </button>

    </Modal>

</template>

<script>
import { reactive, ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

// components
import Modal from '@/components/Modal.vue'
import GoogleAuth from '@/components/auth/GoogleAuth.vue'

// composables
import useValidator from '@/composables/useValidator'

export default {
    components: {
        Modal,
        GoogleAuth
    },

    setup(){
        // composables
        const { validate } = useValidator()

        // data
        const user = reactive({
            email: '',
            password: ''
        })
        const loading = ref(false)
        const errorMessage = ref('')
        const successMessage = ref('')
        const router = useRouter()

        // methods
        const checkDataIsValid = () => {
            // come validate email and password
            if(validate(user.email, 'email') &&
               validate(user.password, 'password'))
                return true
            else
                return false
        }

        const loginUser = () => {
            // check data is valid or no
            const valid = checkDataIsValid()

            // if data be not valid come dont login
            if(!valid){
                // show error to user
                errorMessage.value = 'ایمیل یا رمز عبور به درستی وارد نشده'

                return
            }

            // enable loading status
            loading.value = true

            // get a bit data from auth 
            const auth = getAuth()

            signInWithEmailAndPassword(auth, user.email, user.password)
            .then(() => {
                // show success message to user
                successMessage.value = 'حساب شما تایید شد'
            }) 
            .catch(error => {
                // show error to user in modal
                errorMessage.value = error.message.slice(9, error.message.length - 1)
            })
            .finally(() => {
                // change loading status to disable
                loading.value = false
            })
        }

        const closeModal = () => {
            // reset all messages
            errorMessage.value = ''

            // if success exist come reset and go to the home page
            if(successMessage.value != '')
                router.push({ name: 'messages' })

            successMessage.value = ''
        }

        const showErrorMessage = (error) => {
            errorMessage.value = error
        }

        const showSuccessMessage = (success) => {
            successMessage.value = success
        }

        return {
            user, loading, errorMessage, successMessage,
            loginUser, closeModal, showErrorMessage,
            showSuccessMessage
        }
    }
}
</script>

<style scoped>

</style>