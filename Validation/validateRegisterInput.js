const _ = require('lodash');
const validator = require('validator');

const validateRegisterInput = (data) => {
    let errors ={}

    if(!email) email = "";
    if(!password) password = "";
    if(!password2) password2 = "";
    if(!fullName) fullName = "";
    if(!email) email = "";


    let {email , password, password2, fullName, phone, DOB} = data;
    
    //validate password
    if(validator.isLength(password, {min: 0, max: 8})){ //check length
        errors.password = "Password must have at least 8 characters"
    }
    if(!validator.equals(password, password2)) //check equal password and password2
        errors.password2 = "Password must match"
    
    //validate email
    if(!validator.isEmail(email)){
        errors.email = "Email is invalid"
    }
    if(validator.isEmpty(email)){
        errors.email = "Email is required"
    }

    //validate fullName
    if(validator.isEmpty(fullName)){
        errors.fullName = "Full name is required"
    }

    //validate phone
    if(validator.isEmpty(phone)){
        errors.phone = "Phone is required"
    }

    //validate DOB
    if(validator.isEmpty(DOB)){
        errors.DOB = " DOB is required"
    }

    return {
        errors,
        isValid: _.isEmpty(errors)
    }
}
module.exports = validateRegisterInput;