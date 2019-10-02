const express = require('express');
const router = express.Router();
const request = require('request');
const config  = require('config');
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

router.post('/', [
  auth,
  check('text', 'Text is required').not().isEmpty()

] , async (req, res) => {
   const errors = validationResult(req);

   if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()})

 try {
   const user = await User.findById(req.user.id).select('-password');

  console.log(user, 'user')

   const newPost = new Post({
     text: req.body.text,
     name: user.name,
     avatar: user.avatar,
     user: req.user.id
    })
   const post = await newPost.save();
   console.log(post, 'post')
    res.json({msg: 'Post created'})


 } catch(err) {
   console.error(err);
   res.status(500).send('server error')
 }

});

router.get('/', auth, async (req, res) => {

 try {
   // most recent first
   const posts = await Post.find().sort({date: -1});

    res.json(posts);

 } catch(err) {
   console.error(err.message);
   res.status(500).send('server error')
 }

});

router.get('/:id', auth, async (req, res) => {
 let { id } = req.params;

 try {
   // most recent first
   const post = await Post.findById(id).sort({date: -1});

   if(!post) {
     return res.status(404).json({msg: 'Post not found'})
   }

  res.json(post);

 } catch(err) {
   console.error(err.message);

   if(err.kind === 'ObjectId') {
     return res.status(404).json({msg: 'Post not found xx'})
   }
   res.status(500).send('server error')
 }

});



router.delete('/:postID', auth, async (req, res) => {
  let { postID } = req.params;
   const post = await Post.findById(postID);
  //check users
  if(post.user.toString() !== req.user.id) return res.status(401).json({msg: 'User not authorized'})

 try {

  await post.remove()

  res.json({msg: 'Post removed successfully'});

 } catch(err) {
   console.error(err);
   res.status(500).send('server error')
 }

});


router.post('/comment/:id', [
  auth,
  check('text', 'Text is required').not().isEmpty()

] , async (req, res) => {
   const errors = validationResult(req);
   const {id} = req.params;

   if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()})

 try {
   const user = await User.findById(req.user.id).select('-password');
   const post = await Post.findById(id);

   const newComment = {
     text: req.body.text,
     name: user.name,
     avatar: user.avatar,
     user: req.user.id
    }

   post.comments.unshift(newComment);
   await post.save()


  res.json(post.comments)


 } catch(err) {
   console.error(err);
   res.status(500).send('server error')
 }

});

router.delete('/comment/:id/:commentID', auth, async(req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const comment = post.comments.find(comment => comment.id === req.params.commentID);

    if(comment) return res.status(404).json({msg: 'Comment does not exist'});

    if(comment.user.toString() !== req.user.id) return res.status(404).json({msg: 'User not authorized'});

    const removeIndex = post.comments
          .map(comment => comment.user.toString())
          .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments )
  } catch(err) {
    console.error(err.message);
    res.status(500).send('server error')
  }
});



module.exports = router;
