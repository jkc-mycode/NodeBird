const Sequelize = require('sequelize');

// 테이블 생성
class Hashtag extends Sequelize.Model {
    // 테이블 정보
    static initiate(sequelize) {
        Hashtag.init({
            title: {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: true,
            modelName: 'Hashtag',
            tableName: 'hashtags',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })

    }
    // 테이블 관계
    static associate(db) {
        db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
    }
}


module.exports = Hashtag;