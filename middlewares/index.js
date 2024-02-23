const User = require('../models/user');
const Post = require('../models/post');

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {  // 패스포트 통해서 로그인 했는지
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { 
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};

let userCache = {};
let cacheTTL = 0;

exports.createUserCache  = (req, res, next) => {
    return {
        getUserCache: () => userCache,
        getCacheTTL: () => cacheTTL,
        setUserCache: async (id) => {
            if (id === -1) {
                userCache = {};
            } else {
                userCache = await User.findOne({ 
                    where: { id },
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
                        {
                            model: Post,
                            attributes: ['id', 'content'],
                            as: 'LikedPosts',
                        },
                    ]
                })
            }
        },
        setCacheTTL: (newCacheTTL) => {
            if (newCacheTTL === 0) {
                cacheTTL = 0;
            } else {
                const TTL = 30 * 1000;
                cacheTTL = newCacheTTL + TTL;
            }
        }
    }
};