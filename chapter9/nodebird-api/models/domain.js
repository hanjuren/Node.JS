const Sequelize = require('sequelize');

module.exports = class Domain extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            host: {
                type: Sequelize.STRING(80),
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM('free', 'premium'), // ENUM : 넣을 수 있는 값을 제한하는 데이터형식
                allowNull: false,
            },
            clientSecret: {
                type: Sequelize.UUID, // UUID : 충돌 가능성이 적은 랜덤한 문자열
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'Domain',
            tableName: 'domains',
        });
    }

    static associate(db) {
        db.Domain.belongsTo(db.User); // User모델과  1 : N 관계를 가진다.
    }
};