import { ref } from 'vue'

export default () => {
    // data
    const isShowModal = ref(false)

    // methods
    const closeModal = () => {
        // come hide the modal
        isShowModal.value = false
    }

    const showModal = () => {
        // come show the modal
        isShowModal.value = true
    }

    return {
        isShowModal,
        closeModal, showModal
    }
}