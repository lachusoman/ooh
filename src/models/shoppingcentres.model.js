'use strict';
module.exports = (sequelize, DataTypes) => {
    const shoppingcentres = sequelize.define('shoppingcentres', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING, allowNull: false }
    });
    // shoppingcentres.associate = function (models) {
    //     shoppingcentres.hasMany(models.assets, {
    //         foreignKey: 'id',
    //         sourceKey: 'id'
    //     });
    // };
    return shoppingcentres;
};