const express = require("express");
const router = express.Router();
const postModel = require("../models/posts");
const commentModel = require("../models/comments");


const middleware = require("../middleware/index");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    }
}).single('blog[img]');


router.get("/", (req, res) => {
    console.log(__dirname);
    postModel.find({}).populate("author").exec((err, foundPost) => {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("./blog/index", {
                data: foundPost
            })
        }
    })

})

//post request
router.post("/", middleware.isLoggedIn, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            req.flash("error", "online image file are allows");
            res.redirect("/blogs");
        } else {
            if (req.file == undefined) {
                console.log(err);
                console.log(req.file);
                req.flash("error", "Please upload file");
                res.redirect("/blogs");
            } else {
                let newPost = req.body.blog;
                newPost.author = req.user;
                console.log(req.file);
                newPost.img = `/uploads/${req.file.filename}`
                postModel.create(newPost, (err, data) => {
                    if (err) {
                        req.flash("error", err.message);
                        res.redirect("/blogs");
                    } else {
                        req.flash("success", "new post has been created");
                        res.redirect("/blogs");
                        console.log("data is successful add to DB");
                    }
                })
            }
        }
    });
})

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("./blog/new");
})

// show page

router.get("/:id", (req, res) => {

    postModel.findById(req.params.id, (err, foundPost) => {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            // console.log(foundPost);
            // console.log(foundPost.comments[0]);
            res.render("./blog/show", {
                blogData: foundPost
            })
        }
    })
})

// edit api

router.put("/:id", middleware.isUserOwnPost, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            req.flash("error", "online image file are allows");
            res.redirect("/blogs");
        } else {
            let obj = req.body.blog;
            obj.edited = Date.now();

            postModel.findByIdAndUpdate(req.params.id, obj, (err, data) => {
                if (err) {
                    console.log(err);
                    req.flash("error", "Something went wrong");
                    res.redirect("/blogs");
                } else {
                    if (req.file == undefined) {
                        console.log("nothing");
                    } else {
                        try {
                            
                            fs.unlinkSync(data.img.slice(1,data.img.length));
                            console.log("Successfully deleted the file.")
                        } catch (err) {
                            throw err
                        }
                        data.img = `/uploads/${req.file.filename}`;
                    }

                    data.save(function (err, savedData) {
                        console.log("Data has been updated!!!");
                        req.flash("success", "new post has been updated!!!");
                        res.redirect("/blogs");
                    })
                }
            })
        }
    });
})
// delete api
router.delete("/:id", middleware.isUserOwnPost, (req, res) => {
    postModel.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            commentModel.deleteMany({
                _id: {
                    $in: data.comments
                }
            }, (err) => {
                if (err) {
                    console.log(err);
                    req.flash("error", "something went wrong");
                    res.redirect("/blogs");
                } else {
                    console.log("post has been remove!!!");
                    req.flash("success", "post has been remove");
                    res.redirect("/blogs");
                }
            })

        }
    })
})

// edit post

router.get("/:id/edit", middleware.isUserOwnPost, (req, res) => {
    postModel.findById(req.params.id, (err, datafound) => {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("./blog/edit", {
                blogData: datafound
            })
        }
    })
})


module.exports = router;