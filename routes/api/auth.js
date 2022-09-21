const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");


//@route    GET api/auth
//@desc     Test route
//@access   Public
router.get("/",auth,async(req,res)=>{
  
  try {
    const user=await User.findById(req.user.id).select("-password");
    res.json(user);
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
})



//@route    POST api/auth
//@desc     Login/ authenticate
//@access   Public
router.post(
  "/",
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),

  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors.array());
    // console.log(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //Check if user exits
      let user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ errors: [{ msg: "User does not exist" }] });
      }

      const checkPsw = await bcrypt.compare(password, user.password); //put plain text behind
      // console.log(password + "ANDDDDDD" + user.password);
      // console.log(checkPsw);
      if (!checkPsw) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //Return Jasonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          // console.log(token);
          res.json({ token: token , user : user});
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
