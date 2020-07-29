'use strict';
module.exports = (sequelize, DataTypes) => {
    const audit = sequelize.define('audit', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        entity: { type: DataTypes.STRING, allowNull: false },
        entity_id: { type: DataTypes.INTEGER, allowNull: false },
        user_id: { type: DataTypes.STRING, allowNull: false },
    });
    return audit;
};