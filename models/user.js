const Sequelize = require('sequelize');

// 테이블 생성
class User extends Sequelize.Model {
    // 테이블 정보
    static initiate(sequelize) {
        User.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.ENUM('local', 'kakao'),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: true,  //createdAt, updatedAt
            underscored: false,
            modelName: 'User',  // 자바스크립트에서 사용하는 이름
            tableName: 'users',  // 데이터베이스에서 사용하는 테이블 이름
            paranoid: true,  // deletedAt 유저 삭제일 (soft delete)
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }
    // 테이블 관계
    static associate(db) {
        db.User.hasMany(db.Post);
        // 연예인의 팔로워를 찾으려면 연예인의 id로 찾아야 함
        db.User.belongsToMany(db.User, {  // 팔로워(유명 연예인의 팬)
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow'
        });

        // 내가 팔로잉을 하는 사람을 찾으려면 나의 id로 찾아야 함
        db.User.belongsToMany(db.User, {  // 팔로잉 (유명 연예인)
            foreignKey: 'followerId', 
            as: 'Followings',
            through: 'Follow'
        });

        db.User.belongsToMany(db.Post, {  
            through: 'Like',  
            as: 'LikedPosts',
        });
    }
}


module.exports = User;