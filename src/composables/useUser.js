import { getDatabase, ref, push, get, child, update  } from 'firebase/database'
import { useStore } from 'vuex'

// composables
import useChat from './useChat'

export default () => {
    // composables
    const { updateEmailOwnerInChats } = useChat()

    // data
    const store = useStore()

    // methods
    const addUserToDatabase = (info) => {
        // get database
        const database = getDatabase()
            
        // get collection or table row
        const collection = ref(database, '/users')

        // add new data to the table
        push(collection, info)
        .then(() => {
            // is ok
        })
        .catch(error => {
            console.log(error)
        })
    }

    const getUsers = async () => {
        // data
        let data = []

        // get database
        const database = getDatabase()

        // get collectiion
        const collection = ref(database);

        // get all users
        const getUsers = await get(child(collection, `users/`))

        // put users to the data
        if (getUsers.exists()) {
            // get data
            data = getUsers.val()
        } else {
            // data is not exist
            data = []
        }

        // set new data to the store
        store.dispatch('users/setUsers', data)

        return data
    }

    const findUser = async (email = '', userId = '') => {
        // get users
        const data = await getUsers()

        // get table key 
        let key = ''
        let user = {}

        // check users for finding user with userId
        for(const index in data){
            // find the user
            if(email != '' && data[index].email == email){
                key = index
                user = data[index]
            }
            
            else if(userId != '' && data[index].uid == userId){
                key = index
                user = data[index]
            }
        }

        return {
            key,
            user
        }
    }

    const updateUserInDatabase = async (info, email) => {
        // get database
        const database = getDatabase()

        // find user with id - get row key of table
        const { key } = await findUser(email)

        // if dont exist any user come add user
        if(key == '')
            await addUserToDatabase(info)

        // then come update the field
        update(ref(database, 'users/' + key), info)
        .then(() => {
            // come get users again because we have change
            getUsers()            
        })
        .catch(error => {
            console.log(error)
        }) 
    }

    const updateUserEmailInChats = (emailOld) => {
        // current user email
        const userEmail = store.state.auth.auth.email
        
        // find the users did message with him
        const users = store.state.users.users

        let chats;

        for(const key in users){
            // get all chats from logged user
            if(users[key].email == emailOld && 
               users[key].chats != undefined){
                   chats = users[key].chats
               }
        }

        // if not exist chats come back
        if(chats == undefined) return

        const shouldChangeUsers = []
        
        // update email to all chats
        for(const key in chats){
            shouldChangeUsers.push(chats[key].email)
        }

        const usersInfo = []

        // find info form users
        for(const key in users){
            shouldChangeUsers.map(item => {
                if(users[key].email == item)
                    usersInfo.push({
                        ...users[key],
                        key
                    })
            })  
        }

        // come update the user by this info
        usersInfo.map(item => {
            // come find a chat with logged user and update it
            let chats = item.chats

            for(const key in chats){
                if(chats[key].email == emailOld)
                    chats[key].email = userEmail
            }

            // update the chat in the database
            updateUserInDatabase({chats}, item.email)
        })

        // update email in the messages collection
        updateEmailOwnerInChats(emailOld, userEmail)
    }   

    const addChatToChatsUsers = async (key, userEmail) => {
        const users = store.state.users.users
        
        let indexUser = ''
        let indexMe = ''

        for(const key in users){
        
            for(const index in users[key].chats){
                if(users[key].chats[index].chat_key == key)
                    return
            }
            
            if(users[key].email == userEmail)
                indexUser = key
        
            if(users[key].email == store.state.auth.auth.email)
                indexMe = key
        }

        const url = 'users/' + indexUser + '/chats'

        const database = getDatabase()

        // come add this collection to chats of me
        const collectionMe = ref(database, 'users/' + indexMe + '/chats')

        await push(collectionMe, {
            chat_key: key,
            email: userEmail
        })

        const collection = ref(database, url)

        await push(collection, {
            chat_key: key,
            email: store.state.auth.auth.email
        })
    }   

    const getRealTimeUser = () => {
        // get database
        const database = getDatabase()
        
        // get collection
        const collection = ref(database, 'users/')

        return collection
    }

    return {
        addUserToDatabase, updateUserInDatabase,
        findUser, getUsers, updateUserEmailInChats,
        addChatToChatsUsers, getRealTimeUser
    }
}