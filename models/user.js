const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    img:String,
    create_date: {
        type: Date,
        default: Date.now
    }
})
userSchema.plugin(passportLocalMongoose, {
    usernameField: 'username',
    passwordField: "password"
});
module.exports = mongoose.model("Users", userSchema);