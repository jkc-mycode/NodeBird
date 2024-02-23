const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { createUserCache } = require('../middlewares/index');
const userCache = createUserCache();

exports.join = async (req, res, next) => {
    const { nick, email, password } = req.body;  // 구조분해 할당에 의해 req.body에서 자동으로 할당됨
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12); // 비밀번호 암호화
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch(err) {
        console.log(err);
        next(err);
    }
};

// POST /auth/login
exports.login = (req, res, next) => {
    // login 호출 시 passport.authenticate가 실행되는데
    // 이 때 'local' 에 의해서 localStrategy가 실행됨
    // done(서버실패, 성공유저, 로직실패)이 (authError, user, info) => {}을 호출시킴
    // done에 의해서 user === exUser
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {  // 서버 실패한 경우
            console.error(authError);
            return next(authError);
        }
        if (!user) {  // 로직 실패한 경우
            return res.redirect(`/?loginError=${info.message}`);
        }
        // req.login에 의해 /passport/inde.js 가 실행됨
        return req.login(user, (loginError) => {  // 로그인 성공한 경우
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        })
    })(req, res, next);
};

// GET /auth/logout
// 로그아웃은 세션에 들어있는 세션쿠키의 객체값을 없애는 과정
// 객체값을 없애도 세션쿠키 자체는 남아있지만 객체값이 비어있기 때문에 
// passport.deserializeUser 메서드를 실행할 수 없음
exports.logout = (req, res, next) => {  
    req.logout(() => {
        userCache.setUserCache(-1);
        res.redirect('/');
    });
};