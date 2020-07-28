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