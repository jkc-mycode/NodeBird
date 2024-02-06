const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { afterUploadImage, uploadPost } = require('../controllers/post');

try {
    fs.readdirSync('uploads');
} catch (error) {
    fs.mkdirSync('uploads');
}

// 이미지를 올리기 위한 multer
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            console.log(file);
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            console.log(file);
            const ext = path.extname(file.originalname);  // 확장자를 추출
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);  // 이미지.png -> 이미지12039123.png와 같이 변경(중복 제거를 위해)
        }
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
});

// multer 사용 시 FormData객체에서 사용하는 formData.append('img', this.files[0])의 'img'변수와 동일하게 사용해야 함
router.post('/img', isLoggedIn,upload.single('img'), afterUploadImage);

const upload2 = multer();  // 게시글을 올리기 위한 multer
router.post('/', isLoggedIn, upload2.none(), uploadPost);


module.exports = router;