// 라우터 -> 컨트롤러(요청, 응답을 알고 있음, req랑 res) -> 서비스(요청, 응답을 모름)
const Post = require('../models/post');
const User = require('../models/user');
const Hashtag = require('../models/hashtag');
const bcrypt = require('bcrypt');

exports.renderProfile = (req, res, next) => {
    // 서비스를 호출
    res.render('profile', { title: '내 정보 - NodeBird' });

};

exports.renderProfileUpdate = (req, res, next) => {
    res.render('profile_update', { title: '프로필 수정 - NodeBird' })
};

exports.updateProfile = async (req, res, next) => {
    const { nick, email, password } = req.body;  // 구조분해 할당에 의해 req.body에서 자동으로 할당됨
    try {
        // 사용자가 email도 변경했을 경우 DB에서 중복체크
        if (req.user.email != email) {
            const exUser = await User.findOne({ where: { email } });
            if (exUser) {
                return res.redirect('/profile/update?error=exist');
            }
        }
        const hash = await bcrypt.hash(password, 12); // 비밀번호 암호화
        await User.update({
            email: email,
            nick: nick,
            password: hash,
        }, {
            where: { id: req.user.id }
        });
        return res.redirect('/');
    } catch(err) {
        console.log(err);
        next(err);
    }
};

exports.renderJoin = (req, res, next) => {
    res.render('join', { title: '회원 가입 - NodeBird' });

};

exports.renderMain = async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createdAt', 'DESC']]
        });
        res.render('main', { 
            title: 'NodeBird',
            twits: posts,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.renderHashtag = async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query } });
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({
                include: [{ model: User, attributes: ['id', 'nick'] }],
                order: [['createdAt', 'DESC']]
            });
        }
        res.render('main', {
            title: `${query} | NodeBird`,
            twits: posts,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};