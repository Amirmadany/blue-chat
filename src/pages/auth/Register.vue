<template>

    <div class="box">

        <form @submit.prevent="registerUser" class="auth-form">

            <div class="auth-form-content">

                <input v-model.trim="user.email" class="auth-form-input" type="email" placeholder="ایمیل">
                <input v-model.trim="user.password" class="auth-form-input" type="password" placeholder="رمز عبور">
                <input v-model.trim="confirmPassword" class="auth-form-input" type="password" placeholder="تکرار رمز عبور">

            </div>

            <button class="button login-button auth-form-btn" :disabled="loading"> 
                <span v-if="loading" class="loading">
                    <span class="spinner-border spinner-border-sm"></span>
                </span>
                <span v-else>ثبت نام</span>    
            </button>
        </form>

        <GoogleAuth
            @openedError="showErrorMessage"
            @openedSuccess="showSuccessMessage"
        />

        <router-link :to="{ name: 'login' }" class="button text-button"> از قبل حساب کاربری دارید؟ </router-link>

    </div>

    <Modal :show="error != '' || success != ''" @close="closeModal">

        <p> {{ error }} {{ success }} </p>

        <div :class="['modal-icon', error ? 'error' : 'success']">
            <span v-if="error != ''">
                <i class="fas fa-exclamation-triangle"></i>
            </span>
            
            <span v-else>
                <i class="fas fa-check-circle"></i>
            </span>
        </div>

        <button @click="closeModal" class="button submit-button">تایید</button>

    </Modal>

</template>

<script>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'

// components
import Modal from '@/components/Modal.vue'
import GoogleAuth from '@/components/auth/GoogleAuth'

// composables
import useValidator from '@/composables/useValidator'
import useUser from '@/composables/useUser'

export default {
    components: {
        Modal,
        GoogleAuth
    },

    setup(){
        // composables
        const { validate } = useValidator()
        const { addUserToDatabase } = useUser()

        // data
        const user = reactive({
            email: '',
            password: '',
        })
        const confirmPassword = ref('')
        const loading = ref(false)
        const error = ref('')
        const success = ref('')
        const router = useRouter()

        // methods 
        const canRegister = () => {            
            let valid = false

            // check the email
            if(validate(user.email, 'email') &&
               validate(user.password, 'password') &&
               validate(confirmPassword.value, 'password') &&
               user.password == confirmPassword.value)
                valid = true
            else
                valid = false

            return valid
        }

        const registerUser = () => {
            // check is valid data or no
            const valid = canRegister()

            // if be valid come add data to database
            if(valid){
                // come enable the loading status
                loading.value = true

                // a bit data about auth to the database
                const auth = getAuth()

                // come create the user
                createUserWithEmailAndPassword(auth, user.email, user.password)
                .then((response) => {
                    // show success message to user
                    success.value = 'با موفقیت عضو شدید'

                    // make a data for user
                    const data = {
                        displayName: response.user.displayName ? response.user.displayName : '',
                        email: response.user.email,
                        photoURL: response.user.photoURL ? response.user.photoURL : '',
                        bio: '',
                        uid: response.user.uid,
                        chats: []
                    }

                    // add user to the database
                    addUserToDatabase(data)

                    // reset the form
                    user.email = ''
                    user.password = ''
                    confirmPassword.value = ''
                })
                .catch(problem => {
                    // show error
                    error.value = problem?.message.slice(9, problem.message.length - 1)
                })
                .finally(() => {
                    // change loading status to disable
                    loading.value = false
                })
            }

            else 
                error.value = 'ایمیل یا رمز عبور نامعتبر است'
        }

        const closeModal = () => {
            // reset all message
            error.value = ''

            // if success be come go to edit-profile page
            if(success.value != '')
                router.push({ name: 'edit-profile' })

            success.value = ''
        }

        const showErrorMessage = (message) => {
            error.value = message
        }

        const showSuccessMessage = (message) => {
            success.value = message
        }

        return {
            user, confirmPassword, error, loading,
            success,
            registerUser, closeModal, showErrorMessage,
            showSuccessMessage

        }
    }
}
</script>

<style scoped>

    .google-auth-btn{
        margin-top: 1rem;
    }

</style>