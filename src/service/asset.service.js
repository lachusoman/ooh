const models = require("../models");
const { auditedTxn } = require("../utility/audit.util");
const Asset = models.assets;
const errorMsg = 'Unexpected error';
exports.assetInsert = async function (assetDetails, user_id, callback) {
  try {
    const operation = (transaction) => {
      return Asset.create(assetDetails, { transaction });
    }
    const asset = await auditedTxn(operation, { user_id, entity: 'Asset_Create' });
    if (asset) {
      callback(null, {
        status: "Asset Created Successfully",
        name: asset.name
      });
    }
  } catch (e) {
    console.log(`Error:${e}`)
    callback({
      msg: e.name === 'SequelizeForeignKeyConstraintError' ? 'Shop ID provided does not exist' : errorMsg,
      error: e
    });
  }
};
exports.assetGetAll = async function ({ from, to }, callback) {
  const to_record = to || 50;
  const offset = from || 0;
  const limit = Math.min(25, to_record - offset);
  try {
    await Asset.findAndCountAll({
      limit, offset, order: [ [ 'id', 'ASC' ] ]
    }).then((assetDetails) => {
      callback(null, assetDetails)
    }).catch(error => {
      console.log(`View Asset catch(Clinic): ${JSON.stringify(error)} `);
      callback(error);
    })
  } catch (error) {
    callback(error);
  }
};

exports.assetUpdate = async function ({ asset_id }, { name, dimension, location, status, shoppingcentreId }, user_id, callback) {
  try {
    const asset = await Asset.findOne({ where: { id: asset_id } })
    if (!asset) {
      return callback('Asset ID does not exist');
    }
    const operation = (transaction) => {
      Asset.update(
        { name, dimension, location, status, shoppingcentreId },
        { where: { id: asset_id }, transaction });
      return asset;
    }
    const assetUpdated = await auditedTxn(operation, { user_id, entity: 'Asset_Update' });

    if (assetUpdated) {
      callback(null, {
        status: "SUCCESS",
        msg: "Asset Details Updated Successfully",
      });
    }
  } catch (error) {
    console.log(`Update Asset Error:${error}`);
    callback(error);
  }
};
