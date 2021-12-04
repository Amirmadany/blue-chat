<template>

    <div class="profile-info mx-md-0 mx-auto">

        <div class="mb-4 mx-auto">

            <label class="profile-info-lable"> نام نمایشی </label>
            <input v-model="form.name" type="text" class="profile-info-input">

        </div>

            <div class="mb-4 mx-auto">

            <label class="profile-info-lable"> bio </label>
            <textarea v-model="form.bio" rows="2" class="profile-info-input" />

        </div>

        <div class="mb-4 mx-auto">

            <label class="profile-info-lable"> ایمیل </label>
            <input v-model="form.email" type="text" class="profile-info-input">

        </div>


        <button @click="applyChanges" class="button mt-2" :disabled="loading">
        
            <span v-if="loading" class="loading">
                <span class="spinner-border spinner-border-sm"></span>
            </span> 
        
            <span v-else>اعمال تغییرات</span>
        
        </button>

    </div>

</template>

<script>
import { computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { getAuth, updateProfile, updateEmail } from 'firebase/auth'

// composables
import useValidator from '@/composables/useValidator'
import useUser from '@/composables/useUser'

export default {
    props: {
        loading: Boolean,
        photo: String
    },

    emits: [ 'loadingChanged', 'openedError', 'openedSuccess', 'sendedFormData'],

    setup(props, { emit }){
        // composables
        const { validate }  = useValidator()
        const { updateUserInDatabase, getUsers, updateUserEmailInChats } = useUser()

        // data
        const store = useStore()

        // computed
        const userInfo = computed(() => {
            return store.state.auth.auth
        })
        const userInfoPlus = computed(() => {
            return {
                bio: store.getters['users/bio'](userInfo.value.email)
            }
        })
        const form = computed(() => {
            return {
                email: userInfo.value.email,
                photo: userInfo.value.photoURL,
                name: userInfo.value.displayName ? userInfo.value.displayName : '',
                bio: userInfoPlus.value.bio ? userInfoPlus.value.bio : ''
            }
        })

        // methods
        const checkFieldsIsValid = () => {
            let valid = false

            // should have email and name
            if(validate(form.value.email, 'email') &&
               String(form.value.name).trim().length >= 2)
               valid = true
            else
                valid = false
            
            return valid
        }

        const applyChanges = () => {
            // check data is valid or no
            const valid = checkFieldsIsValid()

            // if data dont be valid come back
            if(!valid){
                // show error message to user by modal
                emit( 'openedError', 'با دقت فیلد ها را پر کنید')
                return
            } 

            // get all info about app and user logged
            const auth = getAuth()

            // new user data
            let data = {
                displayName: form.value.name,
                photoURL: props.photo
            }

            // enable the loading status
            emit('loadingChanged', true)

            // come update the user data
            updateProfile(auth.currentUser, data)
            .then(() => {
                // show susccess message to user by modal
               emit('openedSuccess', 'با موفیت اطلاعات آپدیت شد')

                // update user logged with new data
                store.dispatch('auth/updateAuth', data)
            })  
            .catch(error => {
                // show error to user by modal
                emit('openedError', error?.message.slice(9, error.message.length - 1))
            })
            .finally(() => {
                // change loading status to disable
                emit('loadingChanged', false)
            })

            // get email new
            const email = form.value.email

            // get old email
            const emailOld = userInfo.value.email
            const bio = form.value.bio

            updateEmail(auth.currentUser, email)
            .then(() => {
                
                const info = {
                    email
                }

                // update user logged with new data
                store.dispatch('auth/updateAuth', info)

                // come update the email in the database
                updateUserInDatabase({
                    ...data,
                    photoURL: props.photo ? props.photo : '',
                    bio,
                    email: info.email
                }, emailOld) 

                // if email updated come do
                if(info.email != emailOld){
                    // come update chat's email logged user.
                    updateUserEmailInChats(emailOld)
                }

            })
            .catch(error => {
                // show error to user by modal
                emit('openedError', error?.message.slice(9, error.message.length - 1))
            })

            // update user info to the database
            updateUserInDatabase({
                ...data,
                photoURL: props.photo ? props.photo : '',
                email: userInfo.value.email,
                bio: form.value.bio
            }, userInfo.value.email)
        }

        // lifecycle hooks
        onBeforeMount(() => {
            // if dont exist users in the store come get
            if(store.state.users.users == null)
                // come get users data form database
                getUsers()
        })

        return {
            form,
            applyChanges
        }
    }
}
</script>

<style>

</style>