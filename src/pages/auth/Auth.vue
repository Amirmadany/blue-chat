<template>

    <main class="mx-sm-0 mx-4">

        <div class="info-box" @click="showModal">
            <i class="fas fa-question"></i>
        </div>

        <div class="icon">
            <img src="@/assets/images/logo.svg" alt="">
        </div>

        <Modal :show="isShowModal" @close="closeModal">

            <p> لطفا با فیلتر شکن وارد شوید </p>

            <div class="modal-icon">
                <i class="fas fa-info-circle"></i>
            </div>

            <button @click="closeModal" class="button submit-button"> متوجه شدم </button>

        </Modal>

        <div v-if="content == 'content-one'" class="content box">

            <router-link :to="{ name: 'login' }" class="button login-button"> وارد شوید </router-link>
            <router-link :to="{ name: 'register' }" class="button register-button">ثبت نام</router-link>

        </div>

        <div v-else class="content box">

            <router-view></router-view>

        </div>

    </main>

</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// components
import Modal from '../../components/Modal.vue'

// composables
import useModal from '@/composables/useModal'

export default {
    components: {
        Modal
    },

    setup(){
        // composables
        const { isShowModal, closeModal, showModal } = useModal()

        // data
        const route = useRoute()

        // computed
        const content = computed(() => {
            // if in the route exist login or register come do
            if(route.path.includes('login') || route.path.includes('register'))
                return 'content-two'

            else
                return 'content-one'
        })

        return {
            isShowModal, content,
            closeModal, showModal
        }
    }
}
</script>

<style scoped>

    main{
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .icon{
        width: 7.5rem;
        height: 7.5rem;
        margin-bottom: 3.5rem;
    }

    .icon img{
        width: 100%;
        height: 100%;
    }

    .info-box{
        border-radius: 50%;
        background: #4e91e6;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        position: fixed;
        left: 1rem;
        top: 1rem;
        cursor: pointer;
    }

</style>