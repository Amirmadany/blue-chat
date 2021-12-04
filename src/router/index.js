import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'

// create router
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// use guard
import useAuth from '../composables/useAuth'

router.beforeEach((to) => {
    // get is auth or no from localStorage
    const auth = useAuth()

    if(to.meta.auth && auth)
        return true
    
    else if(to.meta.auth && !auth)
        return { name: 'auth' }

    else if(to.meta.guest && !auth)
        return true

    else if(to.meta.guest && auth)
        return { name: 'home' }

    return true
})

export default router