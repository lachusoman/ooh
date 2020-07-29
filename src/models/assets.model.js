'use strict';
const { status } = require("../constants/constants");
const { ACTIVE, INACTIVE } = status;
module.exports = (sequelize, DataTypes) => {
    const assets = sequelize.define('assets', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        dimension: { type: DataTypes.STRING, allowNull: false },
        location: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.ENUM(ACTIVE, INACTIVE), allowNull: false },
        shoppingcentreId: { type: DataTypes.INTEGER, allowNull: false }
    });
    assets.associate = function (models) {
        assets.belongsTo(models.shoppingcentres);
    };
    return assets;
};