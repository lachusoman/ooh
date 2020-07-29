const models = require("../models");
const Shop = models.shoppingcentres;
const { auditedTxn } = require("../utility/audit.util");
exports.shopcntrInsert = async function (shopDetails, user_id, callback) {
  try {
    const operation = (transaction) => {
      return Shop.create(shopDetails, { transaction });
    }
    const shop = await auditedTxn(operation, { user_id, entity: 'ShoppingCentre_Create' });
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
      console.log(`View ShoppingCentre catch: ${JSON.stringify(error)} `);
      callback(error);
    })
  } catch (error) {
    callback(error);
  }
};

exports.shopcntrUpdate = async function ({ shop_id, name, address }, user_id, callback) {
  try {
    const shop = await Shop.findOne({ where: { id: shop_id } })
    if (!shop) {
      return callback('Shopping Centre ID does not exist');
    }
    const operation = (transaction) => {
      Shop.update({ name, address }, { where: { id: shop_id }, transaction });
      return shop;
    }
    const shopUpdated = await auditedTxn(operation, { user_id, entity: 'ShoppingCentre_Update' });
    if (shopUpdated) {
      callback(null, {
        status: "SUCCESS",
        msg: "Shopping Centre Details Updated Successfully",
      });
    }
  } catch (error) {
    console.log(`Update ShoppingCentre Error:${error}`);
    callback(error);
  }
};