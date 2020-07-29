const models = require("../models");
const Asset = models.assets;
const errorMsg = 'Unexpected error';
exports.assetInsert = function (assetDetails, callback) {
  Asset.create(assetDetails).then(asset => {
    callback(null, {
      status: "Asset Created Successfully",
      name: asset.name
    })
  }).catch(e => {
    callback({
      msg: e.name === 'SequelizeForeignKeyConstraintError' ? 'Shop ID provided does not exist' : errorMsg,
      error: e
    });
  })
}

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

exports.assetUpdate = async function ({ asset_id }, { name, dimension, location, status, shop_id }, callback) {
  try {
    await Asset.findOne({ where: { id: asset_id } })
      .then(async asset => {
        if (asset) {
          await Asset.update(
            { name, dimension, location, status, shop_id },
            { where: { id: asset_id } }
          ).then(result => {
            callback(null, result)
          }).catch(error => {
            console.log(`Update Database Error:${error}`);
            throw ('Shop ID provided does not exist');
          })
        } else {
          throw ('Asset ID does not exist');
        }
      }).catch(error => {
        callback(error);
      });
  } catch (error) {
    callback(error);
  }
};