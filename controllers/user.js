const User = require('../models/user');

exports.follow = async (req, res, next) => {
    // req.user.id와 req.params.id가 필요
    // 현재 유저의 id와 팔로우하는 사람의 id가 필요
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (user) {
            await user.addFollowing(parseInt(req.params.id, 10));
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.unfollow = (req, res, next) => {

};