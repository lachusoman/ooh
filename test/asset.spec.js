
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
  name: "Westfield",
  address: "Parramatta"
}

const asset = {
  name: "Board",
  dimension: "300*50",
  location: "Front",
  status: ACTIVE
}

const anotherAsset = {
  name: "Flex",
  dimension: "300*50",
  location: "Front",
  status: INACTIVE
}

const updated_asset = {
  name: "Screen",
  dimension: "300*50",
  location: "Front",
  status: ACTIVE
}

describe("Asset Flow", () => {
  beforeAll(async () => {
    await models.sequelize.sync();
  })
  afterAll(async () => {
    await models.sequelize.close();
    await app.close;
  });

  it("End to End testing - Create Asset, View all & Update Asset details by Logged in User", async () => {
    // Create a user
    const res = await request(app)
      .post(`${process.env.API_PREFIX}/user`)
      .send(user);

    // login using that user
    const login_res = await request(app)
      .post(`${process.env.API_PREFIX}/user/login`)
      .send({ "email_id": user.email_id, "password": user.password })
      .then(async (login_res) => {

        // grab the token
        const token = login_res.text;

        // create a SHOPPING CENTRE 
        const shop_create_response = await request(app)
          .post(`${process.env.API_PREFIX}/shop`)
          .set("authorization", token)
          .send(shop).then(async () => {
            const view_shop_response = await request(app)
              .get(`${process.env.API_PREFIX}/shop`)
              .set("authorization", token);
            expect(view_shop_response.statusCode).toEqual(200);
            let shops = JSON.parse(view_shop_response.text).rows[ 0 ];
            asset.shoppingcentreId = shops.id;
            anotherAsset.shoppingcentreId = shops.id;

            // create an ASSET for above SHOPPING CENTRE
            const asset_create_response = await request(app)
              .post(`${process.env.API_PREFIX}/asset`)
              .set("authorization", token)
              .send(asset);
            expect(asset_create_response.statusCode).toEqual(201);

            // Now verify the ASSET created
            const view_asset_response = await request(app)
              .get(`${process.env.API_PREFIX}/asset`)
              .set("authorization", token)
            expect(view_asset_response.statusCode).toEqual(200);
            const viewAssets = JSON.parse(view_asset_response.text)
            expect(viewAssets.count).toEqual(1);
            expect(viewAssets.rows[ 0 ]).toEqual(expect.objectContaining({ "dimension": "300*50", "id": 1, "location": "Front", "name": "Board", "shoppingcentreId": 1, "status": "A" }));

            // creating a second ASSET
            await request(app)
              .post(`${process.env.API_PREFIX}/asset`)
              .set("authorization", token)
              .send(anotherAsset);

            // verify the ASSET count as 2
            const viewAllAssets = await request(app)
              .get(`${process.env.API_PREFIX}/asset`)
              .set("authorization", token)
            expect(viewAllAssets.statusCode).toEqual(200);
            expect(JSON.parse(viewAllAssets.text).count).toEqual(2);

            // Verify fetching the ASSET By name
            const viewAssetByName = await request(app)
              .get(`${process.env.API_PREFIX}/asset?asset_name=Board`)
              .set("authorization", token)
            expect(viewAssetByName.statusCode).toEqual(200);
            expect(JSON.parse(viewAssetByName.text).rows[ 0 ]).toEqual(expect.objectContaining({ "dimension": "300*50", "id": 1, "location": "Front", "name": "Board", "shoppingcentreId": 1, "status": "A" }));

            // Verify fetching the ASSET By Status
            const viewAssetByStatus = await request(app)
              .get(`${process.env.API_PREFIX}/asset?asset_status=I`)
              .set("authorization", token)
            expect(viewAssetByStatus.statusCode).toEqual(200);
            expect(JSON.parse(viewAssetByStatus.text).rows[ 0 ]).toEqual(expect.objectContaining({ "dimension": "300*50", "id": 2, "location": "Front", "name": "Flex", "shoppingcentreId": 1, "status": "I" }));

            // Update the first ASSET Created
            const assets = JSON.parse(view_asset_response.text).rows[ 0 ];
            const asset_update_response = await request(app)
              .put(`${process.env.API_PREFIX}/asset/${assets.id}`)
              .set("authorization", token)
              .send(updated_asset)
            expect(asset_update_response.statusCode).toEqual(201);

            // Validate the updated ASSET
            const view_asset = await request(app)
              .get(`${process.env.API_PREFIX}/asset`)
              .set("authorization", token)
            expect(JSON.parse(view_asset.text).rows[ 0 ]).toEqual(expect.objectContaining({ "dimension": "300*50", "id": 1, "location": "Front", "name": "Screen", "shoppingcentreId": 1, "status": "A" }));
          })
      });
  });
});
