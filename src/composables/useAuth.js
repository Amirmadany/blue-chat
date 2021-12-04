export default () => {
    // get data from localStorage
    const isLogged = JSON.parse(localStorage.getItem('isLogged'))

    // if isLogged be ok come say is auth
    if(isLogged)
        return true
    else
        return false
}