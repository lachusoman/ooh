'use strict';
module.exports = (sequelize, DataTypes) => {
    const assets = sequelize.define('assets', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        dimension: { type: DataTypes.STRING, allowNull: false },
        location: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false },
        shop_id: { type: DataTypes.INTEGER }
    });
    assets.associate = function (models) {
        assets.belongsTo(models.shoppingcentres, { foreignKey: 'id', sourceKey: 'shop_id' });
    };
    return assets;
};