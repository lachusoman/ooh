
const models = require("../models");
const Audit = models.audit;
const errorMsg = 'Unexpected error';
exports.auditGetAll = async function ({ from, to }, callback) {
    const to_record = to || 50;
    const offset = from || 0;
    const limit = Math.min(25, to_record - offset);
    try {
        const auditDetails = await Audit.findAndCountAll({
            limit, offset, order: [ [ 'id', 'ASC' ] ]
        });
        callback(null, auditDetails);
    } catch (error) {
        callback({
            msg: errorMsg,
            error
        });
    }
};