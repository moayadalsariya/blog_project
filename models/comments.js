const mongoose = require("mongoose");
const comment_schema = new mongoose.Schema({
    content: String,
    create_date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        autopopulate:true
    },
    reply: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "reply",
        autopopulate:true
    }]

})
comment_schema.plugin(require("mongoose-autopopulate"));


module.exports = mongoose.model("Comments", comment_schema);