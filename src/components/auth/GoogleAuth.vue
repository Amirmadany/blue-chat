<template>

    <button @click="loginWithGoogle" class="button register-button"> ورود با گوگل </button>

</template>

<script>
import { getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'

// composables
import useUser from '@/composables/useUser'

export default {
    emits: [
        'openedSuccess',
        'openedError',
    ],

    setup(props, { emit }){
        // composables
        const { findUser, addUserToDatabase } = useUser()

        // methods
        const loginWithGoogle = () => {
            // get auth info
            const auth = getAuth()

            // create provider google auth
            const provider = new GoogleAuthProvider()

            // try to login with google account
            signInWithPopup(auth, provider)
            .then( async (response) => {
                // show success message to user by modal
                emit('openedSuccess', 'حساب شما تایید شد')
                
                // find user from database
                const { key } = await findUser(response.user.email)
                
                // if not exist user come add user to database
                if(key == ''){
                    // get user data
                    const data = {
                        bio: '',
                        email: response.user.email,
                        photoURL: response.user.photoURL,
                        displayName: response.user.displayName,
                        uid: response.user.uid,
                        chats: []
                    }

                    // come add user to database
                    addUserToDatabase(data)
                }
            })
            .catch((error) => {
                // show errror message to user by modal
                emit('openedError', error.message.slice(9, error.message.length - 1))
            })
        }

        return {
            loginWithGoogle
        }
    }
}
</script>

<style>

</style>