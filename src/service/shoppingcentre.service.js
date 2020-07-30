const models = require("../models");
const Shop = models.shoppingcentres;
const sequelize = models.sequelize;
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
    callback({
      msg: error.name === 'SequelizeDatabaseError' ? 'Shop ID provided does not exist' : errorMsg,
      error
    });
  }
}

exports.shopcntrGetAll = async function ({ from, to }, callback) {
  const to_record = to || 50;
  const offset = from || 0;
  const limit = Math.min(25, to_record - offset);
  const select_query = `select s.id as shopid, s.name as shopname ,s.address,a.name as assetname ,a.location,a.status from shoppingcentres s left outer join assets a on s.id=a.shoppingcentreid limit ${limit}  offset ${offset}`;
  console.log(`select query:${select_query}`);
  try {
    const shopDetails = await sequelize.query(select_query, {
      type: Shop.SELECT
    })

    const shopResult = {};
    shopDetails[ 0 ].forEach(shopDetail => {
      const shopid = shopDetail.shopid;
      if (!shopResult[ shopid ]) {
        shopResult[ shopid ] = {};
        shopResult[ shopid ].shopid = shopDetail.shopid;
        shopResult[ shopid ].shopname = shopDetail.shopname;
        shopResult[ shopid ].address = shopDetail.address;
        shopResult[ shopid ].assets = [];
      }
      if (shopDetail.assetname) {
        shopResult[ shopid ].assets.push({
          assetname: shopDetail.assetname,
          location: shopDetail.location,
          status: shopDetail.status
        });
      }
    });
    callback(null, shopResult);
  } catch (error) {
    console.log(`Error: ${error}`);
    callback(error);
  }
};

exports.shopcntrUpdate = async function ({ shop_id, name, address }, user_id, callback) {
  try {
    const shop = await Shop.findOne({ where: { id: shop_id } })
    if (!shop) {
      return callback({ msg: 'Shopping Centre ID does not exist' });
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
    callback({
      msg: error.name,
      error
    });
  }
};