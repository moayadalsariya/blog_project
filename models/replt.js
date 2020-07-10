const mongoose = require("mongoose");
const reply_schema = new mongoose.Schema({
    content: String,
    create_date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        autopopulate:true
    }
})
reply_schema.plugin(require("mongoose-autopopulate"));


module.exports = mongoose.model("reply", reply_schema);