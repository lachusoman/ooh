const models = require("../models");
const Shop = models.shoppingcentres;
const Audit = models.audit;
const sequelize = models.sequelize;
exports.shopcntrInsert = async function (shopDetails, user_id, callback) {
  try {
    const operation = (transaction) => Shop.create(shopDetails, { transaction });
    const shop = auditedTxn(operation, { user_id, entity: 'ShoppingCentre_Create' });
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

async function auditedTxn(operation, { user_id, entity }) {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const shop_created = await operation(transaction);
    const auditDetails = {
      entity,
      entity_id: shop_created.id,
      user_id
    }
    const audit_created = await Audit.create(auditDetails);
    await transaction.commit();
    return shop_created;
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return error;
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

exports.shopcntrUpdate = async function ({ shop_id }, { name, address }, callback) {
  let transaction = null;
  try {
    transaction = await sequelize.transaction();
    await Shop.findOne({ where: { id: shop_id } })
      .then(async shop => {
        if (shop) {
          await Shop.update(
            { name, address },
            { where: { id: shop_id } }
          ).then(result => {
            callback(null, result)
          }).catch(error => {
            callback(error);
          })
        } else {
          throw ('Shopping Centre ID does not exist');
        }
      }).catch(err => {
        callback(err);
      })
  } catch (error) {
    callback(error);
  }
};
