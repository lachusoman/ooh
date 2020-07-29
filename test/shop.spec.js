const request = require("supertest");
const app = require("../src/app");
const models = require("../src/models")
const { roles, status } = require("../src/constants/constants");
const { USER } = roles;
const user = {
    email_id: "user@ooh.com",
    password: "user123",
    first_name: "User",
    last_name: "U",
    user_type: USER,
    contact_no: "9999999999",
    dob: "1950-10-10",
    address: "NSW,Sydney"
}
const shop = {
    name: "Westfield",
    address: "Parramatta"
}
const updated_shop = {
    name: "Westfield",
    address: "Town Hall"
}

describe("Shopping Centre Flow", () => {
    beforeAll(async () => {
        await models.sequelize.sync();
    })
    afterAll(async () => {
        await models.sequelize.close();
        await app.close;
    });

    it("Create Shopping Centre ,View all & Update Details by Logged in User", async () => {
        const res = await request(app)
            .post(`${process.env.API_PREFIX}/user`)
            .send(user);
        const login_res = await request(app)
            .post(`${process.env.API_PREFIX}/user/login`)
            .send({ "email_id": user.email_id, "password": user.password })
            .then(async (login_res) => {
                const token = JSON.parse(login_res.text).token;
                const shop_create_response = await request(app)
                    .post(`${process.env.API_PREFIX}/shop`)
                    .set("authorization", token)
                    .send(shop);
                expect(shop_create_response.statusCode).toEqual(201);

                const view_shop_response = await request(app)
                    .get(`${process.env.API_PREFIX}/shop`)
                    .set("authorization", token)
                expect(view_shop_response.statusCode).toEqual(200);

                let shops = JSON.parse(view_shop_response.text).rows[ 0 ];
                console.log(`View shops:${JSON.stringify(shops)}`);

                const shop_update_response = await request(app)
                    .put(`${process.env.API_PREFIX}/shop/${shops.id}`)
                    .set("authorization", token)
                    .send(updated_shop)
                expect(shop_update_response.statusCode).toEqual(201);

                console.log(`Updated shop details:${JSON.stringify(shop_update_response)}`);
            });
    })
});
