import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

// set config 
const config = {
    apiKey: "AIzaSyDdHOGVbrnD7ne-59ufGlB0YnJA4vmv230",
    authDomain: "blue-chat-c22aa.firebaseapp.com",
    projectId: "blue-chat-c22aa",
    storageBucket: "blue-chat-c22aa.appspot.com",
    messagingSenderId: "246709085147",
    appId: "1:246709085147:web:61950ff968c96c252e3dfe"
}

// initialization firebase for app
const app = initializeApp(config)

const db = getDatabase(app)

export default db