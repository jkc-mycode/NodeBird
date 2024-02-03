// app.js는 일종의 관제실이다.
// 여러 모듈들의 파일을 불러와서 구조를 만드는 것이다.
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const { sequelize } = require('./models');

dotenv.config();  // process.env
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const passportConfig = require('./passport');

const app = express();
passportConfig();
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
app.use(express.json());  // ajax json 요청 받을 수 있게 (req.body로 만들어서)
app.use(express.urlencoded({ extended: false }));  // form 요청 받을 수 있게 (req.body로 만들어서)
app.use(cookieParser(process.env.COOKIE_SECRET));  // 헤더에 있는 쿠키 데이터 파싱, { connect.sid: 123876128942 }와 같은 객체로 만듬
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,  // 자바스크립트 접근 못하게 만들때
        secure: false,  // https 사용할 때 true
    }
}));
//passport 미들웨어의 위치는 반드시 express-session 밑에 선언해야 함
app.use(passport.initialize());  // passport연결시 req.user, req.login, req.logout가 생성됨 (즉, passport가 로그인시 필요한 것들을 만들어 줌)
app.use(passport.session());  // connect.sid라는 이름으로 세션 쿠키가 브라우저로 전송 (쿠키 로그인을 도와주는 함수)

// 브라우저에 connect.sid=123876128942와 같은 쿠키가 저장됨
// 이후에는 쿠키와 함께 서버로 보내짐 (이 때 cookie-parser가 분석해서 보냄)
// passport가 cookie-parser에 의해 만들어진 객체를 통해 /passport/index.js에서 세션쿠키를 통해 유저아이디를 찾음
// passport.session 미들웨어가 passport.deserializeUser 메서드를 호출

app.use('/', pageRouter);
app.use('/auth', authRouter);

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