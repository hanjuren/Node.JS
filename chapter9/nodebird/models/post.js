const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Post.belongsTo(db.User); // 사용자 테이블 1 : N 게시글 테이블 관계
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // 게시글 N : M 해시태그
        db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
    }
};