const Sequelize = require('sequelize');

module.exports = class LargeComment extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            comment: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: "LargeComment",
            tableName: "largecomments",
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
       db.LargeComment.belongsTo(db.User);
       db.LargeComment.belongsTo(db.Comment);
    }
}