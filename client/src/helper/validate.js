// import toast from "react-hot-toast";

// const errorStyle = {
//   style: {
//     border: "1px solid black",
//     fontStyle: "italic",
//   },
// };

//validation for login page
export const loginValidate = (values) => {
  const errors = {};

  usernameVerify(errors, values);

  passwordVerify(errors, values);

  return errors;
  // username validation
  // if (!values.username) {
  //   errors.username = toast.error("username is required", errorStyle);
  // } else if (values.username.length > 10) {
  //   errors.username = toast.error("username must be 10 characters or less", errorStyle);
  // } else if (values.username.includes(" ")) {
  //   errors.username = toast.error("Invalid Username!", errorStyle);
  // }

  // password validation
  // if (!values.password) {
  //   errors.password = toast.error("password is required", errorStyle);
  // } else if (!/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(values.password)) {
  //   errors.password = toast.error("Password must have special character!", errorStyle);
  // } else if (values.password.length < 6) {
  //   errors.password = toast.error("Password must be at least 6 characters", errorStyle);
  // } else if (values.password.includes(" ")) {
  //   errors.password = toast.error("Wrong password!", errorStyle);
  // }

  // return errors;
};

//register validate
export const registerValidate = (values) => {
  const errors = {};
  emailVerifiy(errors, values);
  usernameVerify(errors, values);
  passwordVerify(errors, values);

  return errors;
};

//forgot validate
export const forgotValidate = (values) => {
  // console.log("forgot passwords");
  const errors = {};
  emailVerifiy(errors, values);

  return errors;
};

//profile validation
export const profileValidate = (values) => {
  const errors = {};
  emailVerifiy(errors, values);

  return errors;
};

//reset password validation
export const resetPasswordValidate = (values) => {
  // log("reset password");
  const errors = {};

  if (!values.password) {
    errors.password = "password is required";
  } else if (!/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(values.password)) {
    errors.password = "Password must have special character!";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  } else if (values.password.includes(" ")) {
    errors.password = "Wrong password!";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Password do not match";
  }

  return errors;
};
// .............................//

//verify username
const usernameVerify = (errors = {}, values) => {
  if (!values.username) {
    errors.username = "username is required";
  } else if (values.username.length > 10) {
    errors.username = "username must be 10 characters or less";
  } else if (values.username.includes(" ")) {
    errors.username = "Invalid Username! / No Space!";
  }
};

//verify password
const passwordVerify = (errors = {}, values) => {
  if (!values.password) {
    errors.password = "password is required";
  } else if (!/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(values.password)) {
    errors.password = "Password must have special character!";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  } else if (values.password.includes(" ")) {
    errors.password = "Wrong password!";
  }
};

//verify email
const emailVerifiy = (errors = {}, values) => {
  if (!values.email) {
    errors.email = "Email is required";
  } else if (values.email.includes(" ")) {
    errors.email = "Wrong email!";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Wrong email address!";
  }
};
