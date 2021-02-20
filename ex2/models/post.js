const Sequelize = require('sequelize');


module.exports = class Post extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            title: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            content: {
                type: Sequelize.STRING(500),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
        db.Post.belongsTo(db.User);
    }
};