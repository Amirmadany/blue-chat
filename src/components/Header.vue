<template>

    <header class="header">

       <div>
            <router-link :to="{ name: 'messages' }" class="header-logo d-md-block d-none">
                <img :src="require('@/assets/images/logo.svg')" alt="image">
            </router-link>
            
            <button @click="backToBeforePage" class="header-back-btn d-md-none d-block">
                <i class="fas fa-arrow-left"></i>
            </button>

       </div>

        <div class="header-info">

            <div class="header-info-actions d-md-flex d-none">

                <div class="header-info-action">

                    <router-link @click="showModal" to="" class="header-info-action-icon">
                        <i class="fas fa-door-open"></i>
                    </router-link>

                </div>

            </div>

            <router-link :to="{ name: 'edit-profile' }" class="header-user-info">
                
                <div class="header-user-info-name d-md-block d-none">
                    {{ userInfo.displayName ? userInfo.displayName : userInfo.email }}
                </div>

                <div class="header-user-info-avatar">
                    
                    <img v-if="userInfo.photoURL" :src="userInfo.photoURL" alt="image">

                    <img v-else :src="require('@/assets/images/user-pic.jpg')" alt="">
                
                </div>

            </router-link>

        </div>

    </header>

    <Modal :show="isShowModal" @close="closeModal">

        <p> آیا میخواهید خارج شوید؟ </p>

        <div class="modal-icon text-secondary">
            <i class="fas fa-door-open"></i>
        </div>

        <div class="modal-mini-buttons mt-3">
            <button @click="closeModal" class="w-50 button register-button"> انصراف </button>
            <button @click="logout" class="w-50 button submit-button"> خروج </button>
        </div>

    </Modal>

</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

// components
import Modal from '@/components/Modal.vue'

// composables
import useLogout from '@/composables/useLogout'
import useModal from '@/composables/useModal'

export default {
    components: {
        Modal
    },

    setup(){
        // composables
        const { logout } = useLogout()
        const { isShowModal, closeModal, showModal } = useModal()

        // data
        const store = useStore()
        const router = useRouter()

        // computed
        const userInfo = computed(() => {
            return store.state.auth.auth
        })

        // methods
        const backToBeforePage = () => {
            // go to back page
            router.back()
        }

        return {
            userInfo, 
            logout, isShowModal, closeModal, showModal,
            backToBeforePage
        }
    }
}
</script>

<style>

</style>