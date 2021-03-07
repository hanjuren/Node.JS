const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize) {
        return super.init( {
            uid: {
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, { // 팔로잉 아이디
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow',
        });
        db.User.belongsToMany(db.User, { // 팔로워 아이디
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
        });
        db.User.hasMany(db.Comment);
        db.User.hasMany(db.LargeComment);
    }
};