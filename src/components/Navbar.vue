<template>

    <nav class="navbar">

        <ul class="nav-list">

            <li v-for="(tab, index) in tabs" :key="index + tab.icon" class="nav-list-item">

                <router-link 
                    :to="{ name: tab.link }"
                >

                    <i :class="tab.icon"></i>

                </router-link>

            </li>

            <li class="nav-list-item">

                <router-link 
                    @click.prevent="showModal"
                    to=""
                    exact-active-class="none"
                >

                    <i class="fas fa-sign-out-alt"></i>

                </router-link>

            </li>

        </ul>

    </nav>

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
import { ref } from 'vue'

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
        const tabs = ref([
            { icon: 'fas fa-comment-alt', link: 'messages' },
            { icon: 'fas fa-users', link: 'users' },
            { icon: 'fas fa-cog', link: 'edit-profile' }
        ])

        return {
            tabs, isShowModal,
            logout, closeModal, showModal
        }
    }
}   
</script>

<style scoped>

    

</style>