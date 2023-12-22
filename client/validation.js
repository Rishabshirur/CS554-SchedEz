import { errorType, errorObject } from "./badInputs.js";

const exportedMethods = {
  checkString(strVal, varName) {
    if (!strVal || typeof strVal !== 'string') {
      throw errorObject(errorType.BAD_INPUT, `Error: ${varName} should be a non-empty string value`);
    };
    strVal = strVal.trim();
    if (!strVal) {
      throw errorObject(errorType.BAD_INPUT, `Error: ${varName} cannot contain just empty spaces`);
    };
    console.log(strVal)
    if(strVal===null){
      throw errorObject(errorType.BAD_INPUT, `Error: ${varName} cannot be null`);
    }
    if (/^\d+$/.test(strVal)) {
      throw errorObject(errorType.BAD_INPUT, `Error: ${varName} should not be a number`);
    };
    if (strVal.length > 1000) {
      throw errorObject(errorType.BAD_INPUT, `Error: ${varName} should have lesser than 1000 characters`)
    }
    return strVal;
  },
  checkAge(age) {
    if (!age) {
      throw errorObject(errorType.BAD_INPUT, `Error: age fields need to have valid values`)
    };
    if (isNaN(age)) {
      throw errorObject(errorType.BAD_INPUT, "Error: age should be number")
    };
    age = Number(age);
    if (!Number.isSafeInteger(age)) {
      throw errorObject(errorType.BAD_INPUT, "Error: age should be whole number");
    };
    if (age < 13) {
      throw errorObject(errorType.BAD_INPUT, "Error: under age")
    }
    if(age > 100){
      throw errorObject(errorType.BAD_INPUT, "Error: above age")
    }
    return age;
  },
  checkPassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      throw errorObject(errorType.BAD_INPUT, "Error: password must contain at least one digit, one lowercase letter, one uppercase letter and minimum length of 8 characters")
    }
    return password.trim();
  },
  checkMailID(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex to validate email address
    if (!emailRegex.test(email.trim())) {
      throw errorObject(errorType.BAD_INPUT, "Error: Enter valid email ID")
    }
    if(email.length > 30 || email.length < 0){
      throw errorObject(errorType.BAD_INPUT, "Error: email can be max of 20 characters") 
    }
    return email.trim().toLowerCase();
  },
  checkUsername(username) {
    username = this.checkString(username, "username");
    if (username.length < 3 || username.length > 20) {
      throw errorObject(
        errorType.BAD_INPUT,
        'Error: username should be between min 3 and max 20 characters long'
      );
    };
    const usernameRegex = /^(?=[a-zA-Z_\d]*[a-zA-Z])[a-zA-Z_\d]{3,20}$/; // Regex to validate username
    if (!usernameRegex.test(username)) {
      throw errorObject(
        errorType.BAD_INPUT,
        "Error: username should contain atleast 1 letter and can only contain alphanumeric chars and underscores")
    }
    return username.trim().toLowerCase();
  },
  checkGender(gender) {
    const allowedGenders = ["M", "F", "male", "female", "m", "f", "other"];
    if (!allowedGenders.includes(gender.toLowerCase())) {
      throw errorObject(errorType.BAD_INPUT, "Error: Enter valid gender")
    }
    return gender.toLowerCase();
  },
  checkId(id, varName) {
    if (!id) 
      throw errorObject(errorType.BAD_INPUT, `Error : ${varName} need to have valid values`)

    if (typeof id !== "string") 
      throw errorObject(errorType.BAD_INPUT, `Error:${varName} must be a string`)
    id = id.trim();
    if (id.length === 0)
      throw errorObject(errorType.BAD_INPUT, `Error: ${varName} cannot be an empty string or just spaces`)
    return id.trim();
  },
  checkBoolean(val, varName){
    if(typeof val !== "boolean") {
      throw errorObject(errorType.BAD_INPUT, `Type of ${varName} must be boolean`)
    }
    return val;
  },
  capitalizeFirst(str) {
    return str ? str[0].toUpperCase() + str.slice(1, str.length) : '';
  },
  validateNameValue(value, fieldName) {
    value = this.checkString(value, fieldName);
    const nameRegex = /^[A-Za-z\s]*$/;
    if (!nameRegex.test(value)) {
      throw errorObject(errorType.BAD_INPUT, `Error: ${fieldName} can only contain letters and spaces`);
    };
    if(value.length > 50 || value.length < 1){
      throw errorObject(errorType.BAD_INPUT, `Error: ${fieldName} can have min of 1 to to max 50 of characters`);
    }
    return value;
  },
  validateName(value, fieldName) {
    return this.validateNameValue(value, fieldName)
  },
    validateUpdateUser (userInfo) {
    userInfo.username = this.checkUsername(userInfo.username);
    userInfo.firstName = this.validateNameValue(userInfo.firstName, 'First name');
    userInfo.lastName = this.validateNameValue(userInfo.lastName, 'Last name');
    userInfo.email = this.checkMailID(userInfo.email);
    userInfo.age = this.checkAge(userInfo.age);
    if (userInfo.password) {
      userInfo.password = this.checkPassword(userInfo.password);
    }
    return userInfo;
  },
  checkDate(dateString,fieldName){
  const date1 = this.checkString(dateString,fieldName);
  const date = new Date(date1);
if (!date || isNaN(date)) {
  throw errorObject(errorType.BAD_INPUT, `Error: ${fieldName} is not valid`);
}
  },
  checkSchedule(scheduleName,fieldName){
    if(typeof scheduleName !== "string" ){
      throw errorObject(errorType.BAD_INPUT,`Error: ${fieldName} must be a string`)
    }

    if(scheduleName.trim().length === 0){
      throw errorObject(errorType.BAD_INPUT,`Error: ${fieldName} must be a non-empty string.`)
    }

    if (!/^[A-Za-z0-9\s]*$/.test(scheduleName.trim())) {
      throw errorObject(errorType.BAD_INPUT,`Error: ${fieldName} must be a non alphanumeric.`)
    }
  }
};

export default exportedMethods;