// define auth store
const store = {
    namespaced: true,

    state: () => ({
        auth: {}
    }),

    mutations: {
        SET_AUTH(state, data){
            state.auth = {...data}
        }
    },

    actions: {
        applyAuth(store, data){
            // go to mutatoions and apply the status to state
            store.commit('SET_AUTH', data.info)
        },

        updateAuth(store, data){
            const newData = store.state.auth

            // apply changes on the new data
            for(const key in data){
                newData[key] = data[key]
            }

            // go to mutations and apply new data to auth
            store.commit('SET_AUTH', newData)
        }
    }
}

export default store