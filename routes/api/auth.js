const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

//@route Get api/auth
//@desc
//@access public

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error on auth route')
  }
});


//@route Get api/auth
//@desc
//@access public

router.post('/', [
  check('email', "Please include a valid email").isEmail(),
  check('email', 'Email is required')
       .not()
       .isEmpty(),

  check('password', 'Please enter a password with 6 or more characters')
       .exists()
], async (req, res) => {
console.log('I am here and  U gut', req.body)
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
  }

  const {password, email  } = req.body;
console.log(email, 'email shiiiii')
    try {
        //see if user exists
      let user = await User.findOne({email});

      if(!user) {
        return res
             .status(400)
             .json({errors: [{msg: 'Invalid Credentials'}]});
      }



    const isMatch =  await bcrypt.compare(password, user.password);

    if(!isMatch) {
      return res
         .status(400)
         .json({errors: [{msg: 'Invalid Credentials'}]});
    }


    //return jsonwebtoken
    const payload = {
      user :{
        id: user.id
      }
    }

    jwt.sign(
      payload,
      config.get('jwtToken'),
      {expiresIn: 360000 },
      (err, token) => {
         if(err) throw err;
         res.json({ token} );
      });


    } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error');

    }







});

module.exports = router;
