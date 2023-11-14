const express = require("express");
const ejs = require("ejs");
const { hashSync } = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
const UserModel = require('./config/database');
const passport = require('passport');

app.set('view engine', 'ejs')

app.use(express.json());
app.use(express.urlencoded( { extended: false }))

/** 여기까지가 express 기본 설정 및 라이브러리 import */

/** 여기 부터 session 및 db 저장소 설정 */
app.use(session({
    secret: 'musecom',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ 
                mongoUrl: 'mongodb://127.0.0.1/myauth', 
                collectionName: 'sessions'
    }),
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24
     }
  }))

/** 패스포트 설정 => 로그인 전략(config/passport) 을 이용해 로그인 정책 수립*/
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

/** 라우팅 및 뷰 */
app.get("/", (req, res)=>{
    res.send("Hello World");
})

app.get("/login", (req, res)=>{
    res.render("login");
})

app.post("/login", passport.authenticate("local", { successRedirect: "protected"}))

app.get("/register", (req, res)=>{
    res.render("register");
})

app.post("/register", (req, res)=>{
    const user = new UserModel({
        username: req.body.username,
        userpass: hashSync(req.body.userpass, 10) 
        //해시함수를 이용해 암호화, 두번째 인자로 salt지정
     });
     user.save().then(user=>console.log(user));
     res.send({ user });
})

/** 서버 시작 */
app.listen(5000, (req, res)=>{
    console.log("Listening to port 5000");
})