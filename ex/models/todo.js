const Sequelize = require('sequelize');

module.exports = class Todo extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            success: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'Todo',
            tableName: 'todos',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associated(db) {
        db.Todo.belongsTo(db.User);
    }
};