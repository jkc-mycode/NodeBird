const Post = require('../models/post');
const Hashtag = require('../models/hashtag');

// 업로드한 이미지의 url를 프론트로 보내는 곳 (미리보기 때문에)
exports.afterUploadImage = (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
};

// 실제 게시글이 업로드 되는 곳
exports.uploadPost = async (req, res, next) => {
    console.log(req.body);  // req.body.content와 req.body.url를 가져올 수 있음
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if (hashtags) {
            // Post와 Hashtag 사이의 다대다 관계 생성
            const result = await Promise.all(hashtags.map((tag) => {
                return Hashtag.findOrCreate({
                    where: { title: tag.slice(1).toLowerCase() }
                });
            }));
            console.log('result: ', result);
            // Hashtag.findOrCreate()의 반환값으로 [instance, created] 형태의 배열을 반환
            // instance에는 값이, created에는 새로운 해시태그가 생성되었는지 여부가 들어 있음
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');

    } catch (error) {
        console.error(error);
        next(error);
    }
};