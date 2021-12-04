import { getAuth, signOut } from 'firebase/auth'

export default () => {
    // methods
    const logout = () => {
        // get auth info
        const auth = getAuth()

        // sing out of the account
        signOut(auth)
    } 

    return {
        logout
    }
}