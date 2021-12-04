<template>

    <div class="page-content">

        <h3 class="page-title">
           پروفایل کاربری
        </h3>

        <div class="row justify-content-center mt-5 align-items-center">

            <div class="col-md-6">
                
                <upload-profile-image 
                    :photo="photo.url"
                    @loadingChanged="updateLoading"
                    @opendError="showErrorMessage"
                    @opendSuccess="showSuccessMessage"
                    @sendedNewPhoto="getPic"
                />

            </div>

            <div class="col-md-6 mt-md-0 mt-4">

                <edit-profile-info 
                    :photo="photo.url"
                    :loading="appInfo.loading"
                    @loadingChanged="updateLoading"
                    @openedError="showErrorMessage"
                    @openedSuccess="showSuccessMessage"
                />

            </div>

        </div>

        <button @click="showModal" class="logout-btn">
           <i class="fas fa-door-open"></i>
        </button>

    </div>
    
    <Modal :show="appInfo.error != '' || appInfo.success != ''" @close="closeMessageModal">

        <p v-if="appInfo.error != ''"> {{ appInfo.error }} </p>
        <p v-else> {{ appInfo.success }} </p>

        <div :class="['modal-icon', appInfo.error != '' ? 'error' : 'success']">

            <span v-if="appInfo.error != ''">
                <i class="fas fa-exclamation-triangle"></i>
            </span> 

            <span v-else>
                <i class="fas fa-check-circle"></i>
            </span>

        </div>

        <button @click="closeMessageModal" class="button submit-button"> تایید </button>

    </Modal>

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
import { computed, reactive } from 'vue'
import { useStore } from 'vuex'

// components
import Modal from '@/components/Modal.vue'
import UploadProfileImage from '@/components/profile/UploadProfileImage.vue'
import EditProfileInfo from '@/components/profile/EditProfileInfo.vue'

// composables
import useLogout from '@/composables/useLogout'
import useModal from '@/composables/useModal'

export default {
    components: {
        Modal,
        UploadProfileImage,
        EditProfileInfo
    },

    setup(){
        // composables
        const { logout } = useLogout()
        const { isShowModal, closeModal, showModal } = useModal()

        // data
        const store = useStore()
        const appInfo = reactive({
            error: '',
            success: '',
            loading: false
        })

        // computed
        const userInfo = computed(() => {
            return store.state.auth.auth
        })
        const photo = computed(() => {
            return {
                url: userInfo.value.photoURL
            }
        })

        // methods
        const closeMessageModal = () => {
            // reset the message in the app
            appInfo.error = ''
            appInfo.success = ''
        }

        const getPic = (image) => {
            // get image and set on the form data
            photo.value.url = image
        }

        const updateLoading = (status) => {
            // set new status to loading
            appInfo.loading = status
        }

        const showErrorMessage = (error) => {
            // show error to the modal
            appInfo.error = error
        }

        const showSuccessMessage = (message) => {
            // show error to the modal
            appInfo.success = message
        }

        return {
            photo, appInfo,
            closeMessageModal, getPic, 
            logout, isShowModal, closeModal, showModal,
            updateLoading, showErrorMessage, showSuccessMessage
        }
    }
}
</script>

<style scoped>
</style>