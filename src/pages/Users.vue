<template>

    <div class="page-content users-page">

       <div class="form-search-wrapper">
            <form @submit.prevent="searchUsers" class="search-form">

                <div class="search-group">
                    <input v-model="search" type="text" class="search-input" placeholder="جستجوی کاربران">
                    <i class="fas fa-search search-input-icon"></i>
                </div>

            </form>
       </div>

        <div class="row g-4 mt-5 direction-left">

            <div v-if="loading" class="spinner-border text-primary mx-auto"></div>

            <div
                v-else  
                v-for="(user, index) in filteredUsers" :key="index + user.email" 
                class="col-md-3 col-sm-4 col-6 users-box"
            >

                 <router-link :to="{ name: 'user-info', params: { email: user.email } }" class="user-card shadow">

                    <div 
                        v-if="user.photoURL != '' || user.photoURL != null || user.photoURL != undefined"
                        class="user-card-image" 
                        :style="`background-image: url('${user.photoURL}')`">
                    </div>

                    <h5 class="user-card-name"> {{ user.displayName }} </h5>
                    <span class="user-card-email"> {{ user.email }} </span>

                </router-link>

            </div>

            <p v-if="users.length == 0 && !loading || (search.length > 0 && filteredUsers.length == 0)" class="text-center text-empty"> هیچ کاربری یافت نشد </p>

        </div>

        <button @click="showMoreUser" v-if="users.length - 1> optionShow.currentIndexShow && canShowMoreBtn" class="button more-users-btn"> بیشتر </button>

    </div>

</template>

<script>
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useStore } from 'vuex'

// composables
import useUser from '@/composables/useUser'

export default {
    setup(){
        // composables
        const { getUsers } = useUser()

        // data
        const store = useStore()
        const search = ref('')
        const canShowMoreBtn = ref(true)
        const usersItems = ref([])

        // computed
        const users = computed(() => {
            const users = []
            let index = 0

            for(const key in store.state.users.users){
                users[index] = store.state.users.users[key]
                index++
            }

            return users
        })
        const loading = computed(() => {
            // check exist any user or no
            if(users.value.length >= 1)
                return false
            else {
                return true
            }
        })
        const optionShow = computed(() => {
            return store.state.users.optionShow
        })
        const filteredUsers = ref([])

        // watch
        watch(users, (value) => {
            // get all user except yourself
            value.map(item => {
                if(item.email != store.state.auth.auth.email)
                    usersItems.value.push(item)   
            })

            // show user to count index
            filteredUsers.value = usersItems.value.slice(0, optionShow.value.currentIndexShow)
        })
        watch(search, () => {
            searchUsers()
        })

        // methods
        const searchUsers = () => {
            const items = []
            
            // come find users by base email or displayName
            users.value.map(item => {
                if(item.email.toLowerCase().includes(search.value.toLowerCase()) ||
                   item.displayName.toLowerCase().includes(search.value.toLowerCase()))
                    items.push(item)
                
            })

            // change filterUsers to items
            filteredUsers.value = items

            // if search value be nothing come show more btn
            if(search.value == '') {
                canShowMoreBtn.value = true
                
                // come show only users can show
                filteredUsers.value = usersItems.value.slice(0, optionShow.value.currentIndexShow)
            }
            else {
                // hide the button
                canShowMoreBtn.value = false
            }
        }

        const showMoreUser = () => {
            // show more users 
            store.dispatch('users/addCurrentIndexShow')

            filteredUsers.value = usersItems.value.slice(0, optionShow.value.currentIndexShow + optionShow.value.countEachShow)
        }

        // lifecycle hooks
        onBeforeMount(() => {
            getUsers()
        })

        return {
            search, loading, users, filteredUsers,
            canShowMoreBtn, optionShow,
            searchUsers, showMoreUser
        }
    }
}
</script>

<style scoped>

</style>