const mongoose = require("mongoose");

//db 접속
mongoose.connect('mongodb://root:root@127.0.0.1/admin', {
    dbName: 'myauth'
}).then(()=>{
    console.log("몽고디비 연결")
}).catch((err)=>{
    console.error("몽고디비 연결에러 ", err);
})

const userSchema = mongoose.Schema({
    username : String,
    userpass : String
})

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;