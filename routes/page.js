const express = require('express');
const router = express.Router();
const { renderJoin, renderMain, renderProfile } = require('../controllers/page');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

// 공통적으로 사용하기 원하는 변수들을 res.locals로 설정
// 로그인 과정이 다 끝나면 여기서 라우터들이 동작함
router.use((req, res, next) => {
    res.locals.user = req.user;  // 로그인되어 있지 않으면 req.user는 null값을 가짐
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followingIdList = [];
    next();
});

router.get('/profile', isLoggedIn, renderProfile);
router.get('/join', isNotLoggedIn, renderJoin);
router.get('/', renderMain);

module.exports = router;