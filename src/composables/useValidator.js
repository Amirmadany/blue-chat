export default () => {
    // methods
    const validate = (value, fieldType) => {
        
        // if field be email come do
        if(fieldType == 'email'){
            // email should contains (@) | in the last of email should be (.com)
            // email should have 4 characters between the last (@) and (.com)
            if(value.includes('@') && 
               value.slice(value.length - 4) == '.com' &&
               value.slice(value.lastIndexOf('@') + 1, value.lastIndexOf('.com')).length >= 4)
                return true
            else
                return false
        }
        
        // if field be password come do
        if(fieldType == 'password'){
            // password length should be 8
            if(value.length >= 8)
                return true
            else
                return false
        }
    }

    return {
        validate
    }
}