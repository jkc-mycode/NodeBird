// 라우터 -> 컨트롤러(요청, 응답을 알고 있음, req랑 res) -> 서비스(요청, 응답을 모름)
// 

exports.renderProfile = (req, res, next) => {
    // 서비스를 호출
    res.render('profile', { title: '내 정보 - NodeBird' });

};

exports.renderJoin = (req, res, next) => {
    res.render('join', { title: '회원 가입 - NodeBird' });

};

exports.renderMain = (req, res, next) => {
    res.render('main', { 
        title: 'NodeBird',
        twits: [],
    });

};