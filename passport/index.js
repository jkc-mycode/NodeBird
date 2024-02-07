const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');


module.exports = () => {
    // controller/auth.js에 있는 req.login에 의해서 실행됨
    passport.serializeUser((user, done) => {  // user === exUser
        done(null, user.id);  //user의 id만 추출 -> req.session에 사용자 아이디를 세션에 저장
    });
    // 세션에 저장할 때 { 세션쿠키: 유저아이디 } -> 메모리에 저장
    // user정보를 통째로 사용하면 메모리가 너무 많이 사용되기에 유저아이디만 추출해서 사용
    // 하지만 메모리에 로그인정보를 저장한다는 것 자체가 문제가 되지만
    // 이에 대한 해결법은 추후에 공부할 예정
    
    // cookie-parser에 의해 객체가 된 세션 쿠키 값(123876128942)를 기준으로 유저아이디를 찾음
    // passport.session 미들웨어가 passport.deserializeUser 메서드를 호출
    // 결과적으로 req.user를 만드는 곳임
    passport.deserializeUser((id, done) => {  // 세션쿠키 값을 통해 얻은 유저 아이디를 가지고 User 정보를 복원시킴
        User.findOne({ 
            where: { id },
            // as: 'Followers'와 as: 'Followings'는 User 모델이 Follow 테이블을 통해 
            // 자기 자신과 맺고 있는 팔로우 관계를 나타내며, 이 관계를 통해 팔로워와 팔로잉 사용자의 정보를 함께 조회할 수 있음
            include: [
                {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followers',
                },
                {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followings',
                },
            ]
        })
            .then((user) => done(null, user))  // 그 복원된(조회된) 정보가 req.user가 됨
            .catch(err => done(err));
    });

    local();
    kakao();
};
