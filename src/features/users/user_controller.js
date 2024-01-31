import UserModel from "./user_model.js";
import jwt from "jsonwebtoken";

// instantiating UserModel
const modelInstance = new UserModel();
export default class UserController {
  //   To register user in the database use below method
  register(req, res) {
    // const { fname, lname, email, mobile, password } = req.body;
    // let user = { fname, lname, email, mobile, password };
    let result = modelInstance.add(req.body);
    if (!result) {
      res
        .status(400)
        .json({ success: false, message: "Error creating a Record" });
    } else {
      res.status(201).json({
        success: true,
        message: "Record saved successfully",
        result: result,
      });
    }
  }

  async login(req, res) {
    try {
      let { email, password } = req.body;
      let credentials = { email, password };
      let result = await modelInstance.isExist(credentials);
      if (result) {
        // creating json web token for cookie
        const token = jwt.sign(
          {
            userId: result._id,
            email,
          },
          "s1l3vrfi5h"
        );

        // creating cookie for session
        res.cookie("token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        res.status(200).json({
          success: true,
          message: "User logged in successfully",
          result: result,
          token,
        });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Invalid Email or Password" });
      }
    } catch (error) {
      console.error("Error while login:", error.message);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  logout(req, res) {
    res.cookie("token", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  }
}
