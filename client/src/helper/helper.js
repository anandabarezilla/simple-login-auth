import axios from "axios";
import { jwtDecode } from "jwt-decode";

axios.defaults.baseURL = import.meta.env.VITE_BASEURL;

//get username from token
export const getUsername = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject("Cannot find token!");
    }

    const decoded = jwtDecode(token);
    // console.log(decoded);
    return decoded;
  } catch (error) {
    return Promise.reject({ error });
  }
};

//register user
export const registerUser = async (credentials) => {
  try {
    const response = await axios.post(`/api/register`, credentials);
    const { data, status } = response;

    //send email
    if (status === 201) {
      const { username, email } = credentials;
      // await sendRegistrationEmail(username, email, data.message)
      await axios.post("/api/registerMail", {
        username,
        userEmail: email,
        text: data.message,
      });

      return data.message;
    }

    return data.message;
  } catch (error) {
    // console.log(error.response.data.error);
    return Promise.reject({ error });
  }
};

//get user details by id
export const getUser = async (id) => {
  try {
    const response = await axios.get(`/api/users/${id}`);
    // console.log(response.data);
    const { data } = response;

    return data;
  } catch (error) {
    // console.log(error);
    return Promise.reject({ error });
  }
};

//get user details by email (????)
export const getEmailUser = async (email) => {
  try {
    const response = await axios.get(`/api/getEmailUser/${email}`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//login user
export const loginUser = async ({ username, password }) => {
  try {
    const response = await axios.post("/api/login", { username, password });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    return Promise.reject({ error });
  }
};

//update user
export const updateUser = async (response) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.put("/api/update", response, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log(data);
    return data;
  } catch (error) {
    return Promise.reject({ error });
  }
};

//generate otp
export const generateOTP = async ({ email }) => {
  try {
    const emailUser = await getEmailUser(email);
    if (!emailUser) {
      console.error("invalid email");
    } else {
      const response = await axios.get(`/api/generateOTP?email=${email}`);
      const {
        data: { code },
        status,
      } = response;

      if (status === 201) {
        const data = emailUser;
        const { username, email } = data.emailUser;

        let text = `This is your otp code: ${code}`;

        await axios.post("/api/registerMail", {
          username,
          userEmail: email,
          text,
          subject: "OTP code for reset password",
        });

        return data;
      }
    }
  } catch (error) {
    return Promise.reject({ error });
  }
};

// verify otp

export const verifyOTP = async (code) => {
  try {
    const data = await axios.get(`/api/verifyOTP?`, { params: { code } });

    // console.log(data);
    return data;
  } catch (error) {
    return Promise.reject({ error });
  }
};

// reset password

export const resetPassword = async ({ username, password }) => {
  try {
    const data = await axios.put("/api/resetPassword", { username, password });
    // console.log(data);
  } catch (error) {
    return Promise.reject({ error });
  }
};
