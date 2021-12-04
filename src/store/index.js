import { createStore } from 'vuex'

// modules
import auth from './auth'
import users from './users'

// create store
const store = createStore({
    modules: {
        auth,
        users
    }
})

export default store