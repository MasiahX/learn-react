const jwt = require('jsonwebtoken');
const config = require('config');



module.exports = (req, res, next) => {
   // get token from header

   const token = req.header('x-auth-token');

   //check if no token
   if(!token) {
     return res.status(401).json({
       msg: 'No token, authorization denied'
     })
   }

   try {

     const decoded = jwt.verify(token, config.get('jwtToken'));
     console.log(decoded, 'decoded')
     req.user = decoded.user;
     next()
   } catch(err) {
     console.log(err, 'error')
     res.status(401).json({msg: 'Eek! Token is not valid'})
   }
};
