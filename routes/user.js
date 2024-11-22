const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")
const User = mongoose.model("User")

router.put('/user/:id', requireLogin, (req, res) => {
    try {
        User.findOne({
            _id:req.params.id
        }).select("-password")
        .then(user=>{ 
            try {
                Post.find({postedBy:req.params.id})
                .populate("postedBy", "_id name")
                .then(posts=>{
                    res.json({user,posts})
                })  
    
            } catch(err) {
                return res.status(422).json({error:err})
            }
        }).catch(err=>{
            return res.status(404).json({error:"User not found"})
        })

    } catch(err) {
        return res.status(422).json({error:err})
    }
});

router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    }).select("-password")
    .then(follow=>{
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{new:true}).select("-password")
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    }).catch(err=>{
        return res.status(422).json({error:err})
    })
})

router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    }).select("-password")
    .then(follow=>{
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{new:true}).select("-password")
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    }).catch(err=>{
        return res.status(422).json({error:err})
    })
})

router.put('/updatepic', requireLogin, async (req, res) => {
    try {
            const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { pic: req.body.pic } },
            { new: true }
        );
        return res.json(updatedUser);
    } catch (err) {
        return res.status(422).json({ error: "Pic can't be updated" });
    }
});

router.delete('/deleteuser', requireLogin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        await Post.deleteMany({ postedBy: req.user._id });
        await Post.updateMany(
            {},
            {
                $pull: {
                    comments: { postedBy: req.user._id }
                }
            }
        );
        await Post.updateMany(
            {},
            {
                $pull: {
                    likes: req.user._id
                }
            }
        );
        await User.updateMany(
            {},
            {
                $pull : {
                    followers:req.user._id
                }
            }
        );
        await User.updateMany(
            {},
            {
                $pull : {
                    following:req.user._id
                }
            }
        );
        return res.json({ message: "Delete successful" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router