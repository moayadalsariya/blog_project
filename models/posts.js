const mongoose = require("mongoose");
const post_schema = new mongoose.Schema({
    title: {
        type: String,
        required:true
    },
    body: {
        type: String,
        required:true
    },
    img: {
        type: String,
        required:true
    },
    edited: {
        type: Date,
        default: null
    },
    create_date: {
        type: Date,
        default: Date.now
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
        autopopulate:true
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        autopopulate:true
    }
})
post_schema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Posts", post_schema);