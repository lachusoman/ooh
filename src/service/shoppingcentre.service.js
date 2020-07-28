const models = require("../models");
const Shop = models.shoppingcentres;
exports.shopcntrInsert = async function ({ name, address }, callback) {
    try {
        const shop = await Shop.create({ name, address });
        if (shop) {
            callback(null, {
                status: "Record Created Successfully",
                name: shop.name
            });
        }
    } catch (error) {
        callback(error);
    }
}