<template>

    <router-view></router-view>

</template>

<script>
import { onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    setup() {
        // data
        const store = useStore()
        const router = useRouter()

        // methods
        const getAuthStatus = () => {
            // get app info
            const auth = getAuth()

            // when auth in the app changed come do it
            onAuthStateChanged(auth, (user) => {
                // if user exist - isLogged
                if(user){
                    // check if user dont have name come go to profile page
                    if(user.displayName == null)
                        router.push({ name: 'edit-profile' })

                    // go to store and apply auth status
                    store.dispatch('auth/applyAuth', { info: user })

                    // come set isLogged in the localStorage
                    localStorage.setItem('isLogged', 'true')
                }
                
                else {
                    // go to store and apply auth status
                    store.dispatch('auth/applyAuth', { info: {} })

                    // come set isLogged in the localStorage
                    localStorage.setItem('isLogged', 'false')

                    // go to auth page
                    router.push({ name: 'auth' })
                }
            })
        }

        // lifecycle hooks
        onMounted(() => {
            getAuthStatus()
        })
    }
}
</script>

<style>

</style>