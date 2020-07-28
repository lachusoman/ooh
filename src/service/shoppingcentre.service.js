const models = require("../models");
const Shop = models.shoppingcentres;
exports.shopcntrInsert = async function (shopDetails, callback) {
    try {
        const shop = await Shop.create(shopDetails);
        if (shop) {
            callback(null, {
                status: "Shopping Centre Details Created Successfully",
                name: shop.name
            });
        }
    } catch (error) {
        callback(error);
    }
}

exports.shopcntrGetAll = async function ({ from, to }, callback) {
    const to_record = to || 50;
    const offset = from || 0;
    const limit = Math.min(25, to_record - offset);
    try {
        await Shop.findAndCountAll({
            limit, offset, order: [ [ 'id', 'ASC' ] ]
        }).then((shopDetails) => {
            callback(null, shopDetails)
        }).catch(error => {
            console.log(`View ShoppingCentre catch(Clinic): ${JSON.stringify(error)} `);
            callback(error);
        })
    } catch (error) {
        callback(error);
    }
};