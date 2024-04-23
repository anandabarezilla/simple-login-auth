import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import UserModel from "../models/userModel.js";

// middleware
// verify user
export const verifyUser = async (req, res, next) => {
  try {
    const { username } = req.method === "GET" ? req.query : req.body;

    const existUser = await UserModel.findOne({ username });

    if (!existUser) {
      return res.status(404).json({ error: "Cannot find user!" });
    }

    next();
  } catch (error) {
    return res.status(404).json({ error: "Authentication Failed" });
  }
};

// POST : REGISTER USER
export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: "All field must be filled" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existEmail = await UserModel.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ error: "Email already registered! Use another email to register!" });
    }

    const existUsername = await UserModel.findOne({ username });
    if (existUsername) {
      return res.status(400).json({ error: "Username already exists! make a unique one!" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    if (password) {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
          email,
          username,
          password: hashedPassword,
        });

        return res.status(201).json({ message: "Registration success!" });
      } catch (error) {
        res.status(500).json({ error: "Failed to create new user" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// POST : LOGIN
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All field must be filled" });
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "Invalid username or password" });
    }

    try {
      const matchPassword = await bcrypt.compare(password, user.password);
      if (!matchPassword) {
        return res.status(400).json({ error: "Wrong Password!" });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "login success",
        username: user.username,
        token,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// GET : GET ALL USER
export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();

    if (users.length === 0) {
      return res.status(404).json({ message: "No User" });
    }

    // remove unnecesary data
    const sanitizedUser = users.map((user) => {
      const { password, ...rest } = user.toJSON();
      return rest;
    });
    return res.status(200).json(sanitizedUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET : GET USER
export const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // remove unnecesary data
    const { password, ...rest } = user.toJSON();
    return res.status(200).json({ message: "User retrieved successfully", user: rest });
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve user data" });
  }
};

// PUT : UPDATE PROFILE
export const updateUser = async (req, res) => {
  // res.json('update user)
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const body = req.body;
    if (!body) {
      return res.status(400).json({ error: "Invalid data for update! use the right token!" });
    }

    try {
      const data = await UserModel.updateOne({ _id: userId }, body);

      if (!data) {
        return res.status(400).json({ error: "Invalid data. Cannot update the user" });
      }
      return res.status(201).json({ message: "data updated!", data });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

// GET : GENERATE OTP

export const generateOTP = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    // if (!validator.isEmail(email)) {
    //   return res.status(400).json({ error: "Invalid email format!" });
    // }

    req.app.locals.OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
    res.app.locals.token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.status(201).send({ code: req.app.locals.OTP });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

// GET : VERIFY OTP

export const verifyOTP = async (req, res) => {
  try {
    const code = req.query.code;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
      req.app.locals.OTP = null;
      req.app.locals.resetSession = true;
      return res.status(200).json({ message: "Verify Success!" });
    }

    return res.status(400).json({ error: "Invalid OTP" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// successfully redirect user when OTP user is valid
// GET : CREATE RESET SESSION

export const createResetSession = (req, res) => {
  const token = req.app.locals.token;
  try {
    if (req.app.locals.resetSession) {
      //req.app.locals.resetSession = false; // allow access to this route only once!

      // req.app.locals.token = null; // own experiment, so nulling the token in resetSession
      const tokenVerify = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(404).json({ error: "Invalid or expired token" });
        }

        return decoded;
      });

      // return res.status(200).json({ message: "Access granted!" });
      return res.status(200).json({ flag: req.app.locals.resetSession, tokenVerify });
    }
  } catch (error) {
    return res.status(440).send({ error: "Session expired" });
  }
};

//PUT: RESET PASSWORD

export const resetPassword = async (req, res) => {
  //resetpassword
  try {
    if (!req.app.locals.resetSession) {
      return res.status(440).json({ error: "Session expired" });
    }

    try {
      const { username, password } = req.body;

      const user = await UserModel.findOne({ username });

      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      if (!hashedPassword) {
        return res.status(500).json({ error: "Unable to hash password" });
      }

      const data = await UserModel.updateOne({ username: user.username }, { password: hashedPassword });

      req.app.locals.resetSession = false;
      req.app.locals.token = null;

      return res.status(201).json({ message: "Reset password successfully", data });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET: GET USER INFO BY EMAIL
export const getEmailUser = async (req, res) => {
  try {
    const { email } = req.params;
    const emailUser = await UserModel.findOne({ email });
    if (!emailUser) {
      return res.status(404).json({ error: "email not found!" });
    }
    const { password, ...rest } = emailUser.toJSON();
    return res.status(200).json({ message: "get email", emailUser: rest });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
