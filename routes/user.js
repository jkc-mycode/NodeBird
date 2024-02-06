const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { follow, unfollow } = require('../controllers/user');


router.post('/:id/follow', isLoggedIn, follow);
//언팔로우 만들어보기
router.post('/:id/unfollow', isLoggedIn, unfollow);

module.exports = router;