const User = require('../models/user');
const { createUserCache } = require('../middlewares/index');
const userCache = createUserCache();

exports.follow = async (req, res, next) => {
    // req.user.id와 req.params.id가 필요
    // 현재 유저의 id와 팔로우하는 사람의 id가 필요
    try {
        const user = userCache.getUserCache();
        if (user) {
            await user.addFollowing(parseInt(req.params.id, 10));
            await userCache.setUserCache(user.id);
            res.redirect('/');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.unfollow = async (req, res, next) => {
    try {
        const user = userCache.getUserCache();
        if (user) {
            await user.removeFollowing(parseInt(req.params.id, 10));
            await userCache.setUserCache(user.id);
            res.redirect('/');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};