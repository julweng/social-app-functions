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
  console.log(errors);
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
  };
};

exports.reduceUserDetails = data => {
  const userDetails = {};

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;

  if (!isEmpty(data.website.trim())) {
    // if user submitted a website url that does not have https:// or at least http://
    if (data.website.trim().substring(0, 4) !== "http") {
      userDetails.website = `http://${data.website.trim()}`;
    } else {
      userDetails.website = data.website;
    }
  }

  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};
