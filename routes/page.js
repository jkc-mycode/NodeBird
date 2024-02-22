const express = require('express');
const router = express.Router();
const { renderJoin, renderMain, renderProfile, renderHashtag, renderProfileUpdate, updateProfile, searchUserPost } = require('../controllers/page');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

// 공통적으로 사용하기 원하는 변수들을 res.locals로 설정
// 로그인 과정이 다 끝나면 여기서 라우터들이 동작함
router.use((req, res, next) => {
    res.locals.user = req.user;  // 로그인되어 있지 않으면 req.user는 null값을 가짐
    res.locals.followerCount = req.user?.Followers?.length || 0;
    res.locals.followingCount = req.user?.Followings?.length || 0;
    res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
    res.locals.LikedPostContentList = req.user?.LikedPosts?.map(f => f.content) || [];
    next();
});

router.get('/profile', isLoggedIn, renderProfile);
router.get('/profile/update', isLoggedIn, renderProfileUpdate);
router.post('/profile/update_process', isLoggedIn, updateProfile);

router.get('/join', isNotLoggedIn, renderJoin);
router.get('/', renderMain);
router.get('/hashtag', renderHashtag);  // hashtag?hashtag=node

router.get('/user/:id', searchUserPost);

module.exports = router;