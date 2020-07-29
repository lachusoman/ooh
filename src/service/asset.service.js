const models = require("../models");
const Asset = models.assets;
exports.assetInsert = async function (assetDetails, callback) {
    try {
        const asset = await Asset.create(assetDetails);
        if (asset) {
            callback(null, {
                status: "Asset Created Successfully",
                name: asset.name
            });
        }
    } catch (error) {
        callback(error);
    }
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
        await Asset.update(
            { name, dimension, location, status, shop_id },
            { where: { id: asset_id } }
        ).then(result => {
            callback(null, result)
        }).catch(error => {
            callback(error);
        })
    } catch (error) {
        callback(error);
    }
};