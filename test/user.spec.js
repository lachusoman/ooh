const request = require("supertest");
const app = require("../src/app");
const models = require("../src/models")
const { USER } = require("../src/constants/constants");
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
  status: "active"
}

// describe("User Flow", () => {
//     beforeAll(async () => {
//         await models.sequelize.sync();
//     })
//     afterAll(async () => {
//         await models.sequelize.close();
//         await app.close;
//     });

//     it("Login Failure::User not found", async () => {
//         const res = await request(app)
//             .post(`${process.env.API_PREFIX}/user/login`)
//             .send({ "email_id": user.email_id, "password": user.password });
//         expect(res.statusCode).toEqual(500);
//         expect(res.text).toEqual("{\"error\":\"No such user or Incorrect Password\"}");
//     });

//     it("Create User", async () => {
//         const res = await request(app)
//             .post(`${process.env.API_PREFIX}/user`)
//             .send(user);
//         expect(res.statusCode).toEqual(201);
//     });

//     it("Login Success", async () => {
//         const res = await request(app)
//             .post(`${process.env.API_PREFIX}/user/login`)
//             .send({ "email_id": user.email_id, "password": user.password });
//         expect(res.statusCode).toEqual(200);
//     });
// });

// describe("Shopping Centre Flow", () => {
//     beforeAll(async () => {
//         await models.sequelize.sync();
//     })
//     afterAll(async () => {
//         await models.sequelize.close();
//         await app.close;
//     });

//     it("Create Shopping Centre & View all by Logged in User", async () => {
//         const res = await request(app)
//             .post(`${process.env.API_PREFIX}/user`)
//             .send(user);
//         const login_res = await request(app)
//             .post(`${process.env.API_PREFIX}/user/login`)
//             .send({ "email_id": user.email_id, "password": user.password })
//             .then(async (login_res) => {
//                 const token = JSON.parse(login_res.text).token;
//                 const shop_create_response = await request(app)
//                     .post(`${process.env.API_PREFIX}/shop`)
//                     .set("authorization", token)
//                     .send(shop);
//                 expect(shop_create_response.statusCode).toEqual(201);

//                 const view_shop_response = await request(app)
//                     .get(`${process.env.API_PREFIX}/shop`)
//                     .set("authorization", token)
//                 expect(view_shop_response.statusCode).toEqual(200);
//             });
//     });
// });

describe("Asset Flow", () => {
  beforeAll(async () => {
    await models.sequelize.sync();
  })
  afterAll(async () => {
    await models.sequelize.close();
    await app.close;
  });

  it("Create Asset & View all by Logged in User", async () => {
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

            let shops = JSON.parse(view_shop_response.text).rows[ 0 ];
            asset.shop_id = shops.id;
            const asset_create_response = await request(app)
              .post(`${process.env.API_PREFIX}/asset`)
              .set("authorization", token)
              .send(asset);
            expect(asset_create_response.statusCode).toEqual(201);

            const view_asset_response = await request(app)
              .get(`${process.env.API_PREFIX}/asset`)
              .set("authorization", token)
            expect(view_asset_response.statusCode).toEqual(200);
          })
      });
  });
});