const models = require("../models");
const Shop = models.shoppingcentres;
exports.shopcntrInsert = async function (shopDetails, callback) {
    try {
        const shop = await Shop.create(shopDetails);
        if (shop) {
            callback(null, {
                status: "Shoping Centre Details Created Successfully",
                name: shop.name
            });
        }
    } catch (error) {
        callback(error);
    }
}