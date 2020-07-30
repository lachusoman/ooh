const request = require("supertest");
const app = require("../src/app");
const models = require("../src/models")
const { roles, status } = require("../src/constants/constants");
const { USER } = roles;
const { ACTIVE, INACTIVE } = status;
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
    id: 1,
    name: "Westfield",
    address: "Parramatta"
}

const updated_shop = {
    id: 1,
    name: "Westfield",
    address: "Town Hall"
}

const asset = {
    id: 1,
    name: "Board",
    dimension: "300*50",
    location: "Front",
    status: ACTIVE,
    shoppingcentreid: 1
}

const anotherAsset = {
    id: 2,
    name: "Flex",
    dimension: "300*50",
    location: "Front",
    status: INACTIVE,
    shoppingcentreid: 1
}
describe("Shopping Centre Flow", () => {
    beforeAll(async () => {
        await models.sequelize.sync();
    })

    afterAll(async () => {
        await models.sequelize.close();
        await app.close;
    });

    it("End to End testing Shopping Centre- Create Shopping Centre ,View all & Update Details by Logged in User", async () => {
        // Create a user
        const res = await request(app)
            .post(`${process.env.API_PREFIX}/user`)
            .send(user);

        //Login using that user
        const login_res = await request(app)
            .post(`${process.env.API_PREFIX}/user/login`)
            .send({ "email_id": user.email_id, "password": user.password })
            .then(async (login_res) => {
                // grab the token
                const token = login_res.text;

                //Create shopping centre
                const shop_create_response = await request(app)
                    .post(`${process.env.API_PREFIX}/shop`)
                    .set("authorization", token)
                    .send(shop);
                expect(shop_create_response.statusCode).toEqual(201);

                // Verify the shopping center
                const view_shop_response = await request(app)
                    .get(`${process.env.API_PREFIX}/shop`)
                    .set("authorization", token)
                expect(view_shop_response.statusCode).toEqual(200);
                const viewShop = JSON.parse(view_shop_response.text)
                expect(viewShop).toEqual(expect.objectContaining({ "1": { "address": "Parramatta", "assets": [], "shopid": 1, "shopname": "Westfield" } }));

                // Create two Assets associated with the above created Shopping Centre
                const asset_create_response = await request(app)
                    .post(`${process.env.API_PREFIX}/asset`)
                    .set("authorization", token)
                    .send(asset);
                expect(asset_create_response.statusCode).toEqual(201);

                await request(app)
                    .post(`${process.env.API_PREFIX}/asset`)
                    .set("authorization", token)
                    .send(anotherAsset);

                // Verify the shopping center with the assets associated with it
                const viewShopsWithAssetsResponse = await request(app)
                    .get(`${process.env.API_PREFIX}/shop`)
                    .set("authorization", token)
                expect(viewShopsWithAssetsResponse.statusCode).toEqual(200);
                const viewShopWithAssets = JSON.parse(viewShopsWithAssetsResponse.text)
                expect(viewShopWithAssets).toEqual(expect.objectContaining({ "1": { "address": "Parramatta", "assets": [ { "assetname": "Board", "location": "Front", "status": "A" }, { "assetname": "Flex", "location": "Front", "status": "I" } ], "shopid": 1, "shopname": "Westfield" } }));

                // Update the shopping centre
                const shop_update_response = await request(app)
                    .put(`${process.env.API_PREFIX}/shop/1`)
                    .set("authorization", token)
                    .send(updated_shop)
                expect(shop_update_response.statusCode).toEqual(201);

                // Verify the shopping center
                const view_udpated_shop_response = await request(app)
                    .get(`${process.env.API_PREFIX}/shop`)
                    .set("authorization", token)
                expect(view_udpated_shop_response.statusCode).toEqual(200);
                const viewUpdatedShop = JSON.parse(view_udpated_shop_response.text)
                expect(viewUpdatedShop).toEqual(expect.objectContaining({ "1": { "address": "Town Hall", "assets": [ { "assetname": "Board", "location": "Front", "status": "A" }, { "assetname": "Flex", "location": "Front", "status": "I" } ], "shopid": 1, "shopname": "Westfield" } }));
            });
    })
});
