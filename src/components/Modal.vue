<template>

    <div v-if="show" class="modal" @click="close">

        <div class="modal-content">

            <slot />

        </div>

    </div>

</template>

<script>
export default {
    props: {
        show: Boolean
    },

    emits: ['close'],

    setup(props, { emit }){
        // methods
        const close = (event) => {
            // check if dont be on the content come close the modal
            if(!event.target.closest('.modal-content'))
                emit('close')
        }

        return {
            close
        }
    }
}
</script>

<style>
</style>