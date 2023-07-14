module.exports = function validateRequiredFields(obj, fieldArr) {
    return fieldArr.reduce((t, c) => {
        if(!obj[c] || !t) {
            return false
        }
        return true
    }, true)
}