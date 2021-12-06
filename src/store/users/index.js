const store = {
    namespaced: true,

    state: () => ({
        users: null,
        optionShow: {
            countEachShow: 4,
            currentIndexShow: 4
        }
    }),

    getters: {
        bio: (state) => (email) => {
            // find user by base email
            for(const index in state.users){
                if(state.users[index].email == email)
                    return state.users[index].bio
            }

            return ''
        }
    },

    mutations: {
        
        SET_USERS(state, data){
            state.users = data
        },

        SET_CURRENT_INDEX_SHOW(state){
            state.optionShow.currentIndexShow += state.optionShow.countEachShow
        }

    },

    actions: {
        
        setUsers(store, data){
            // get users and set on the mutations - state
            store.commit('SET_USERS', data)
        },

        addCurrentIndexShow(store){
            // come set new current index show
            store.commit('SET_CURRENT_INDEX_SHOW')
        }

    }
}

export default store