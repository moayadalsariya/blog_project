const express = require("express");
const router = express.Router({
    mergeParams: true
});
const postModel = require("../models/posts");
const commentModel = require("../models/comments");
const replyModel = require("../models/replt");

const middleware = require("../middleware/index");


// comments routes

router.get("/new", middleware.isLoggedIn, (req, res) => {
    postModel.findById(req.params.id, (err, foundPost) => {
        if (err) {
            console.log(err);
            res.redirect(`/blogs`);
        } else {
            res.render("./comment/new", {
                post_id: foundPost._id
            });
        }
    })

})

router.post("/", middleware.isLoggedIn, (req, res) => {
    let newComment = req.body.comment;
    newComment.author = req.user;
    commentModel.create(newComment, (err, createComment) => {
        if (err) {
            console.log(err);
        } else {
            postModel.findById(req.params.id, (err, foundPost) => {
                if (err) {
                    console.log(err);
                } else {
                    foundPost.comments.push(createComment);
                    foundPost.save((err, savedPost) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("comment is successful saved on DB ");
                            req.flash("success", "new comment has been created!!");
                            res.redirect(`/blogs/${req.params.id}`);
                        }
                    })
                }
            })
        }
    })
})
router.put("/:comment_id", middleware.isUserOwnComment, (req, res) => {
    let obj = req.body.comment;
    // obj.edited = Date.now();
    commentModel.findByIdAndUpdate(req.params.comment_id, obj, (err, data) => {
        if (err) {
            console.log(err);
            req.flash("error", "something went wrong!!!!");
            res.redirect(`/blogs/${req.params.id}`);
        } else {
            req.flash("success", "comment has been updated!!!!");
            console.log("Data has been updated!!!");
            res.redirect(`/blogs/${req.params.id}`);
        }

    })
})
router.delete("/:comment_id", middleware.isUserOwnComment, (req, res) => {
    commentModel.findByIdAndRemove(req.params.comment_id, (err, data) => {
        if (err) {
            console.log(err);
            req.flash("error", "something went wrong");
            res.redirect(`/blogs/${req.params.id}`);
        } else {
            req.flash("success", "comment is remove!!");
            console.log("Data has been remove!!!");
            res.redirect(`/blogs/${req.params.id}`);
        }

    })
})
router.get("/:comment_id/edit", middleware.isUserOwnComment, (req, res) => {
    commentModel.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            console.log(err);
            res.redirect(`/blogs/${req.params.id}`);
        } else {
            res.render("./comment/edit", {
                foundComment: foundComment,
                blog_id: req.params.id
            })
        }
    })
})

router.get("/:comment_id/reply/new",middleware.isLoggedIn, (req, res) => {
    res.render("comment/reply", {
        post_id: req.params.id,
        comment_id: req.params.comment_id
    })
})

router.post("/:comment_id/reply",middleware.isLoggedIn, (req, res) => {
    let newReply = req.body.reply;
    newReply.author = req.user;
    replyModel.create(newReply, (err, createdReply) => {
        if(err) {
            console.log("Error 1");
        } else {
            commentModel.findById(req.params.comment_id,(err,foundComment)=>{
                if(err) {
                    console.log("Error 2");
                } else {
                    foundComment.reply.push(createdReply);
                    foundComment.save((err,savedComment)=>{
                        if(err) {
                            console.log("Error 3");
                        } else {
                            console.log("Reply has successful created!!!");
                            req.flash("success", "new reply has been created!!");
                            res.redirect(`/blogs/${req.params.id}`);
                        }
                    })
                }
            })
        }
    })
})

module.exports = router;