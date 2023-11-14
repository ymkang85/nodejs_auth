const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("./database");
const { compareSync } = require("bcrypt");

passport.use(new LocalStrategy(
    function (username, userpass, done) {
        //username 찾기 - 조회 실패: err, 결과없음 !user , 성공 user
        UserModel.findOne({ username: username }, function (err, user) {
            if (err) { return done(err) }
            if (!user) {
                return done(null, false, { message: "회원정보가 없다!!" });
            }
            //비밀번호 조회는 bcrypt의 compareSync 함수를 이용해야 함
            if (!compareSync(userpass, user.userpass)) {
                return done(null, false, { message: "비밀번호 확인해!!" });
            }
            return done(null, user);
        })
    }
));

//세션을 이용해 사용자 정보 유지
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//세션 ID를 이용해 사용자 정보 가져오기
passport.deserializeUser(function (id, done) {
    UserModel.findById(id, function (err, user) {
        done(err, user);
    })
});
