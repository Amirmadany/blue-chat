<template>

     <div class="profile-image mx-auto">
        
        <img v-if="photo" :src="photo" alt="image">

        <img v-else :src="require('@/assets/images/user-pic.jpg')" alt="image">

        <input @change="getPic" type="file" ref="fileUpload" class="d-none">

        <button @click="$refs.fileUpload.click()" class="add-pic-button"> 
            <i class="fas fa-plus"></i>
        </button>

        <div v-if="state.loading" class="loading-picture">

            <span class="spinner-border text-black"></span>

        </div>

    </div>

</template>

<script>
import { reactive } from 'vue'
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'

export default {
    props: {
        photo: {
            type: String,
            default: ''
        }
    },

    emits: [ 'loadingChanged', 'opendError', 'sendedNewPhoto', 'opendSuccess' ],

    setup(props, { emit }){
        // data
        const state = reactive({
            loading: false
        })

        // methods
        const getPic = (event) => {
            // get pic from file 
            const pic = event.target.files[0]
            
            // send pic to the storage
            const storage = getStorage()

            // cretae a metadata of image
            const metadata = {
                contentType: 'image/jpeg'
            }

            // Upload file and metadata to the object 'images/mountains.jpg'
            const storageRef = ref(storage, 'images/' + pic.name);
            const uploadTask = uploadBytesResumable(storageRef, pic, metadata);

            // change loading status to enable
            emit('loadingChanged', true)
            
            state.loading = true

            // upload file to the server
            uploadTask.on('state_changed', () => {
            }, 
            (error) => {
                // show error to user
                emit('opendError', error?.message.slice(9, error.message.length - 1))

                // change loading status to disable
                emit('loadingChanged', false)

                state.loading = false
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // show success message to user
                    emit('opendSuccess', 'تصویر پروفایل تغییر کرد')

                    // get image url and put on the form
                    emit('sendedNewPhoto', downloadURL) 
                    
                    // change loading status to disable
                    emit('loadingChanged', false)

                    state.loading = false
                });
            })
        }

        return {
            state,
            getPic
        }
    }
}
</script>

<style scoped>

    .loading-picture{
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.432);
        width: 100%;
        height: 100%;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
    }

</style>