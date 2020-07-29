
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

  it("Create Asset ,View all & Update Asset details by Logged in User", async () => {
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
          .send(shop).then(async () => {
            const view_shop_response = await request(app)
              .get(`${process.env.API_PREFIX}/shop`)
              .set("authorization", token);
            expect(view_shop_response.statusCode).toEqual(200);

            let shops = JSON.parse(view_shop_response.text).rows[ 0 ];
            asset.shoppingcentreId = shops.id;

            const asset_create_response = await request(app)
              .post(`${process.env.API_PREFIX}/asset`)
              .set("authorization", token)
              .send(asset);
            expect(asset_create_response.statusCode).toEqual(201);

            const view_asset_response = await request(app)
              .get(`${process.env.API_PREFIX}/asset`)
              .set("authorization", token)
            expect(view_asset_response.statusCode).toEqual(200);

            const assets = JSON.parse(view_asset_response.text).rows[ 0 ];

            const asset_update_response = await request(app)
              .put(`${process.env.API_PREFIX}/asset/${assets.id}`)
              .set("authorization", token)
              .send(updated_asset)
            expect(asset_update_response.statusCode).toEqual(201);
            const view_asset = await request(app)
              .get(`${process.env.API_PREFIX}/asset`)
              .set("authorization", token)
            console.log(`assets updated:${JSON.stringify(view_asset.text)}`)
          })
      });
  });
});
