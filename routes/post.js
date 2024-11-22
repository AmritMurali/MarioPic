const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")

router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .sort({createdAt:-1})
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})
router.get('/allsubpost',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .sort({createdAt:-1})
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic} = req.body
    if(!title || !body || !pic){
        return res.status(422).json({error:"Please add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log("whoops")
        console.log(err)
    })
})

router.get('/mypost', requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .sort({createdAt:-1})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like', requireLogin, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            {
                $push: { likes: req.user._id }
            },
            {
                new: true
            }
        ).populate("comments.postedBy", "_id name pic")
        .populate("postedBy", "_id name pic")
        res.json(result);
    } catch (err) {
        return res.status(422).json({ error: err });
    }
});

router.put('/unlike', requireLogin, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            {
                $pull: { likes: req.user._id }
            },
            {
                new: true
            }
        ).populate("comments.postedBy", "_id name pic")
        .populate("postedBy", "_id name pic")
        res.json(result);
    } catch (err) {
        return res.status(422).json({ error: err });
    }
});

router.put('/comment', requireLogin, async (req, res) => {
    try {
        const comment = {
            text:req.body.text,
            postedBy:req.user._id
        }
        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            {
                $push: { comments: comment }
            },
            {
                new: true
            }
        ).populate("comments.postedBy", "_id name pic")
        .populate("postedBy", "_id name pic")
        res.json(result);
    } catch (err) {
        return res.status(422).json({ error: err });
    }
});

router.delete('/deletepost/:postId',requireLogin, (req,res)=>{
    const postId = new mongoose.Types.ObjectId(req.params.postId)
    Post.findOne({_id:postId})
    .populate("postedBy","_id")
    .then(post=>{
        console.log(post)
        if(!post){
            return res.status(422).json({error:"Post not found"})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            Post.findByIdAndDelete(post._id)
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        } else {
            return res.status(422).json({error:"this isn't your post"})
        }
    }).catch(err=>{
        console.log(err)
    })
})

router.put('/deletecomment', requireLogin, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            {
                $pull: { comments: {_id: new mongoose.Types.ObjectId(req.body.commentId)} }
            },
            {
                new: true
            }
        ).populate("comments.postedBy", "_id name pic")
        .populate("postedBy", "_id name pic")
        res.json(result);
        console.log(result)
    } catch (err) {
        return res.status(422).json({ error: err });
    }
});

module.exports = router