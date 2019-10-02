const express = require('express');
const router = express.Router();
const request = require('request');
const config  = require('config');
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');



const Profile = require('../../models/Profile');
const User = require('../../models/User');


//@route Get api/profile/me
//@desc  Get urrent users profile
//@access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);

    if(!profile) return res.status(400).json({msg: 'No profile for this user'});

   res.json(profile);

 } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }

});


//@route Get api/profile/
//@desc  Get urrent users profile
//@access Private

router.post('/', [auth, [
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills required').not().isEmpty()
 ]
],
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()})

  const {
    company,
    website,
    location,
    bio,
    status,
    gitHubUsername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;

  // build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  profileFields.social = {};

  if(company)         profileFields.company          = company;
  if(website)         profileFields.website          = website;
  if(location)        profileFields.location         = location;
  if(bio)             profileFields.bio              = bio;
  if(status)          profileFields.status           = status;
  if(gitHubUsername)  profileFields.gitHubUsername   = gitHubUsername;
  if(youtube)         profileFields.social.youtube          = youtube;
  if(facebook)        profileFields.social.facebook         = facebook;
  if(twitter)         profileFields.social.twitter          = twitter;
  if(instagram)       profileFields.social.instagram        = instagram;
  if(linkedin)        profileFields.social.linkedin         = linkedin;
  if(skills)     {
      profileFields.skills  = skills.split(',').map(skill=> skill.trim());
  }

try {
  let profile = await Profile.findOne({user: req.user.id});

  if(profile) {
    profile = await Profile.findOneAndUpdate({user: req.user.id},
      { $set: profileFields },
      { new : true }
    );
    return res.json(profile);
  }

  profile = new Profile(profileFields);

  await profile.save();
  res.json(profile);
} catch(err) {
   console.error(err);
   res.status(500).send('Server Error');
}


});


//@route  Get api/profile
//@desc Get all profiles
//@access Public
router.get('/', async(req, res) => {
  try{
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  }catch(err) {
    console.log(errr.message);
    res.send(500).send('Server error on all profile route')
  }
});


//@route  Get api/profile/user/:userid
//@desc Get all profiles
//@access Public
router.get('/user/:userid', async(req, res) => {
  let {userid} = req.params;
  console.log(userid, 'params')

  try{
    const profile = await Profile.findOne({user: userid}).populate('user', ['name', 'avatar']);

    if(!profile) return res.status(400).json({msg: 'There is no profile for this user'});
    res.json(profile);
  }catch(err) {
    console.log(errr.message);
    res.send(500).send('Server error on all profile route')
  }
});


//@route  Get api/profile/user/:userid
//@desc Get all profiles
//@access Public
router.delete('/', auth, async(req, res) => {

  try{
    await Profile.findOneAndRemove({user: req.user.id});
    await User.findOneAndRemove({ _id: req.user.id });
    res.send('User and profile removed');
  }catch(err) {
    console.log(errr.message);
    res.send(500).send('Server error on all profile route')
  }
})

router.put('/experience', [
auth,
[
  check('title', 'Title is required')
    .not()
    .isEmpty(),
  check('company', 'Company is required')
    .not()
    .isEmpty(),
  check('from', 'From date is required')
    .not()
    .isEmpty()
]
], async(req, res) => {

const errors = validationResult(req);
// console.log(errors.isEmpty, 'errors')
if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
 }  = req.body;

 const newExp = {
   title,
   company,
   location,
   from,
   to,
   current,
   description
 }

 try {
   const profile = await Profile.findOne({ user: req.user.id });
   console.log(newExp, 'newExp')
   profile.experience.unshift(newExp);
  let test = await profile.save();

  console.log(test, 'test')
   res.json(profile);
 } catch(err) {
   console.error(err.message);
   res.status(500).send('Server error');
 }


});


router.delete('/experience/:expId', auth, async(req, res) => {


   try {
    const { expID } = req.params;

    const profile  = Profile.findOne( {user: req.user.id });
    const removeIndex = profile.experience.map(item => item.id).indexOf(expID);
    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);

   } catch(err) {
     console.error(err.message);
     res.status(500).send('Server Error')
   }
});


router.put('/education', [
auth,
[
  check('school', 'School is required')
    .not()
    .isEmpty(),
  check('degree', 'Degree is required')
    .not()
    .isEmpty(),
  check('fieldofstudy', 'Field of study is required')
    .not()
    .isEmpty(),
  check('from', 'From date is required')
    .not()
    .isEmpty()
]
], async(req, res) => {

const errors = validationResult(req);
// console.log(errors.isEmpty, 'errors')
if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

const {
    school,
    degree,
    fieldofstudy,
    from
 }  = req.body;

 const newEdu = {
   school,
   degree,
   fieldofstudy,
   from
 }

 try {
   const profile = await Profile.findOne({ user: req.user.id });
   // console.log(newExp, 'newExp')
   profile.education.unshift(newEdu);
    await profile.save();

   res.json(profile);
 } catch(err) {
   console.error(err.message);
   res.status(500).send('Server error');
 }


});


router.delete('/education/:eduId', auth, async(req, res) => {


   try {
    const { eduID } = req.params;

    const profile  = Profile.findOne( {user: req.user.id });
    const removeIndex = profile.experience.map(item => item.id).indexOf(expID);
    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);

   } catch(err) {
     console.error(err.message);
     res.status(500).send('Server Error')
   }
});


router.get('/github/:username', async(req, res) => {


   try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${config.get('githubClientID')}&client_secret=
            ${config.get('githubSecret')}`,
      method: 'GET',
      headers: {'user-agent': 'node.js'}
    }

   await request(options, (err, response, body) => {
       if(err) console.error(err);

       if(response.statusCode !== 200) res.status(404).json({msg: 'No gibhub profiles found'});

      res.json(JSON.parse(body));
   });
   } catch(err) {
     console.error(err.message);
     res.status(500).send('Server Error')
   }
});


router.put('/likes/:id', auth, async (req,res) => {
  try {
  const post = await Post.findById(req.params.id);

  if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
    return res.json(400).json({msg: 'Post already liked'})
  }

 post.likes.unshift({user: req.user.id});

 await post.save();

 res.json(post.likes);


  } catch(err) {
    console.error(err.message);
    res.status(500).send('server error')
  }
})

router.put('/unlike/:id', auth, async (req,res) => {
  try {
  const post = await Post.findById(req.params.id);

  if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
    return res.json(400).json({msg: 'Post already unliked'})
  }

 const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id) ;
 post.likes.splice(removeIndex, 1);

 await post.save();

 res.json(post.likes);


  } catch(err) {
    console.error(err.message);
    res.status(500).send('server error')
  }
})


module.exports = router;
