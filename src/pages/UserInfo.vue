<template> 

    <div class="page-content show-user-info">

        <button @click="backToBeforePage" class="show-user-info-back-btn">
            <i class="fas fa-arrow-left"></i>
        </button>

        <div class="show-user-info-wrapper">

            <div v-if="!loading">
                
                <div class="show-user-info-image shadow">
                
                    <img v-if="user.photoURL != null && user.photoURL != '' && user.photoURL != undefined" :src="user.photoURL" alt="">
                    
                    <img v-else :src="require('@/assets/images/user-pic.jpg')" alt="">

                </div>

                <div class="show-user-info-title">
                    <h5> {{ user.displayName }} </h5>
                    <span class="show-user-info-email"> {{ user.email }} </span>
                </div>

                <p class="show-user-info-bio">
                    {{ user.bio }}
                </p>

                <div class="mx-auto text-center mt-5" v-if="user.email != auth.email" >
                    <router-link :to="{ name: 'chat', params: {email: user.email} }" class="button start-chat-btn login-button">
                        <i class="far fa-comment-alt"></i>
                        <span> شروع چت </span>    
                    </router-link>
                </div>

            </div>

            <div v-else class="text-center mx-auto">
                <div class="spinner-border text-primary"></div>
            </div>

        </div>

    </div>

</template>

<script>
import { computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

// composables
import useUser from '@/composables/useUser'

export default {
    setup(){
        // composables
        const { getUsers } = useUser()

        // data
        const router = useRouter()
        const email = useRoute().params.email
        const store = useStore()

        // computed
        const user = computed(() => {
            let item = {}

            // come go the store and find this user
            for(const key in store.state.users.users){
                // get a user with same email
                if(store.state.users.users[key].email == email)
                    item = store.state.users.users[key]
            }

            return item
        })
        const loading = computed(() => {
            // if exist data on the user come disable
            if(user.value.email == email)
                return false
            else
                return true
        })
        const auth = computed(() => {
            return store.state.auth.auth
        })

        // methods
        const backToBeforePage = () => {
            router.back()
        }

        const getUserInfo = () => {
            // if not exist users in the store come get users from database
            if(store.state.users.users == null)
                getUsers()
        }

        // lifecycle hooks
        onBeforeMount(() => {
            getUserInfo()
        })

        return {
            user, loading, auth,
            backToBeforePage
        }
    }
}
</script>

<style scoped>

</style>