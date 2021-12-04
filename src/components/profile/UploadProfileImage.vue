<template>

     <div class="profile-image mx-auto">
        
        <img v-if="photo" :src="photo" alt="image">

        <img v-else :src="require('@/assets/images/user-pic.jpg')" alt="image">

        <input @change="getPic" type="file" ref="fileUpload" class="d-none">

        <button @click="$refs.fileUpload.click()" class="add-pic-button"> 
            <i class="fas fa-plus"></i>
        </button>

    </div>

</template>

<script>
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

            // upload file to the server
            uploadTask.on('state_changed', () => {
            }, 
            (error) => {
                // show error to user
                emit('opendError', error?.message.slice(9, error.message.length - 1))

                // change loading status to disable
                emit('loadingChanged', false)
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
                });
            })
        }

        return {
            getPic
        }
    }
}
</script>

<style>

</style>