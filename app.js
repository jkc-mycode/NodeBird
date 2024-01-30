const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

dotenv.config();  // process.env
const pageRouter = require('./routes/page');

const app = express();
app.set('port', process.env.PORT|| 8001);
app.set('view engine', 'html');  //템플릿엔진으로 읽을 때 html 파일을 사용

// 넌적스 템플릿엔진을 사용할 때 view폴더를 사용
// 즉, render를 사용할 때 views폴더에 있는 html 파일을 사용한다는 의미
nunjucks.configure('views', {
    express: app,
    watch: true,
});

// 실제로 sequelize를 데이터베이스에 연결하는 부분
sequelize.sync()
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    })

app.use(morgan('dev'));  // 실행 로깅
app.use(express.static(path.join(__dirname, 'public')));  // 프론트에서 public 폴더를 자유롭게 접근가능하게 허용
app.use(express.json());  // json 요청 받을 수 있게 (body parser)
app.use(express.urlencoded({ extended: false }));  // form 요청 받을 수 있게 (body parser)
app.use(cookieParser(process.env.COOKIE_SECRET));  // 헤더에 있는 쿠키 데이터 파싱
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,  // 자바스크립트 접근 못하게 만들때
        secure: false,  // https 사용할 때 true
    }
}));

app.use('/', pageRouter);
// 404 미들웨어
app.use((req, res, next) => {  // 404 NOT FOUND
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});
//에러처리 미들웨어
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err: {};  // 에러 로그를 서비스한테 넘김
    res.status(err.status || 500);
    res.render('error');  // 템플릿엔진을 랜더링함 (views폴더에서 error라는 이름의 html파일을 랜더링)
})

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중...');
});