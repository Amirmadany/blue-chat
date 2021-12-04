<template>

    <Header 
        v-if="!isChatPage"
    />

    <Navbar 
        v-if="!isChatPage"
    />

    <main :class="{'main-content': !isChatPage}">

        <router-view></router-view>

    </main>

</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// components
import Header from '@/components/Header.vue'
import Navbar from '@/components/Navbar.vue'

export default {
    components: {
        Header,
        Navbar
    },

    setup(){
        // data
        const route = useRoute()
        const isMobileSize = ref(false)

        // computed
        const isChatPage = computed(() => {
            if(route.path.includes('/chat/') && isMobileSize.value)
                return true
            else
                return false
       })

        // methods
        const applySizeApp = () => {
            // apply mode size app => mobile or computer
            if(window.innerWidth >= 991)
                isMobileSize.value = false
            else
                isMobileSize.value = true
        }

         // lifecycle hooks
        onMounted(() => {
            applySizeApp()

            // when resized app come say to me 
            window.addEventListener('resize', applySizeApp)
        })

        onUnmounted(() => {
            // delete resize event
            window.removeEventListener('resize', applySizeApp)
        })

        return {
            isChatPage
        }
    }
}
</script>

<style>

</style>