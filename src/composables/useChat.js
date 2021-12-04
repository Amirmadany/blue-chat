import { getDatabase, ref, get, update} from 'firebase/database'

export default () => {
    // methods
    const getMessages = (chatKey) => {
        // come get messages
        const database = getDatabase()

        const collection = ref(database, 'messages/' + chatKey)

        return collection
    }

    const getAllMessages = () => {
        const database = getDatabase()

        const collection = ref(database, 'messages/')

        return collection
    }

    const updateEmailOwnerInChats = async (oldEmail, newEmail) => {
        const collection = getAllMessages()
        
        let messages = await get(collection)
        
        let messagesFinally = {...messages.val()}

        // if not exist any message come back
        if(!messages.exists()) return

        for(const key in messagesFinally){
            
            for(const index in messagesFinally[key]){
                if(messagesFinally[key][index].owner == oldEmail)
                    messagesFinally[key][index].owner = newEmail
            }

        }   

        update(collection, messagesFinally)
        .catch(error => {
            console.log(error)
        })
    }

    return {
        getMessages, getAllMessages,
        updateEmailOwnerInChats
    }
}