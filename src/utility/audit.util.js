const models = require("../models");
const Audit = models.audit;
const sequelize = models.sequelize;
module.exports.auditedTxn = async (operation, { user_id, entity }) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const entityCreated = await operation(transaction);
        console.log(`entity created:${JSON.stringify(entityCreated)}`)
        const auditDetails = {
            entity,
            entity_id: entityCreated.id,
            user_id
        }
        await Audit.create(auditDetails, { transaction });
        await transaction.commit();
        return entityCreated;
    } catch (error) {
        console.log(`Audit error:${error}`);
        await transaction.rollback();
        throw error;
    }
}

