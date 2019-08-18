const isEmpty = str => {
  if (str.trim() === "") return true;
  else return false;
};

const isEmail = email => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

exports.validateSignupData = data => {
  const errors = {};

  for (let [key, value] of Object.entries(data)) {
    if (isEmpty(value)) {
      errors[key] = "Must not be empty.";
    }
  }

  if (!isEmpty(data.email) && !isEmail(data.email)) {
    errors.email = "Must be a valid email address.";
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords must match.";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = data => {
  const errors = {};
  
  for (let [key, value] of Object.entries(data)) {
    if (isEmpty(value)) {
      errors[key] = "Must not be empty.";
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}