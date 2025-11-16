import User from "../models/model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// register controller
const registerController = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check existing user
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists with same username or email. Please login",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    // hide password in response
    newUser.password = undefined;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in register controller",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email is not registered",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // JWT generation
    const accessToken = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // remove password safely
    const { password: removed, ...userWithoutPassword } = user._doc;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: userWithoutPassword,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in login controller",
      accessToken: null,
      error,
    });
  }
};

export { registerController, loginController };
