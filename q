[1mdiff --git a/src/constants/constants.js b/src/constants/constants.js[m
[1mindex ea52f7c..2abf401 100644[m
[1m--- a/src/constants/constants.js[m
[1m+++ b/src/constants/constants.js[m
[36m@@ -2,4 +2,8 @@[m [mconst roles = {[m
   ADMIN: 'A',[m
   USER: 'U',[m
 }[m
[31m-module.exports = roles;[m
\ No newline at end of file[m
[32m+[m[32mconst status = {[m
[32m+[m[32m  ACTIVE: 'A',[m
[32m+[m[32m  INACTIVE: 'I',[m
[32m+[m[32m}[m
[32m+[m[32mmodule.exports = { roles, status };[m
\ No newline at end of file[m
[1mdiff --git a/src/models/assets.model.js b/src/models/assets.model.js[m
[1mindex 4802778..c89ed57 100644[m
[1m--- a/src/models/assets.model.js[m
[1m+++ b/src/models/assets.model.js[m
[36m@@ -5,7 +5,7 @@[m [mmodule.exports = (sequelize, DataTypes) => {[m
         name: { type: DataTypes.STRING, allowNull: false },[m
         dimension: { type: DataTypes.STRING, allowNull: false },[m
         location: { type: DataTypes.STRING, allowNull: false },[m
[31m-        status: { type: DataTypes.STRING, allowNull: false },[m
[32m+[m[32m        status: { type: DataTypes.ENUM("A", "I"), allowNull: false },[m
         shop_id: { type: DataTypes.INTEGER, allowNull: false }[m
     });[m
     assets.associate = function (models) {[m
[1mdiff --git a/test/asset.spec.js b/test/asset.spec.js[m
[1mnew file mode 100644[m
[1mindex 0000000..94d10ce[m
[1m--- /dev/null[m
[1m+++ b/test/asset.spec.js[m
[36m@@ -0,0 +1,92 @@[m
[32m+[m
[32m+[m[32mconst request = require("supertest");[m
[32m+[m[32mconst app = require("../src/app");[m
[32m+[m[32mconst models = require("../src/models")[m
[32m+[m[32mconst { roles, status } = require("../src/constants/constants");[m
[32m+[m[32mconst { USER } = roles;[m
[32m+[m[32mconst { ACTIVE, INACTIVE } = status;[m
[32m+[m[32mconst user = {[m
[32m+[m[32m  email_id: "user@ooh.com",[m
[32m+[m[32m  password: "user123",[m
[32m+[m[32m  first_name: "User",[m
[32m+[m[32m  last_name: "U",[m
[32m+[m[32m  user_type: USER,[m
[32m+[m[32m  contact_no: "9999999999",[m
[32m+[m[32m  dob: "1950-10-10",[m
[32m+[m[32m  address: "NSW,Sydney"[m
[32m+[m[32m}[m
[32m+[m[32mconst shop = {[m
[32m+[m[32m  name: "Westfield",[m
[32m+[m[32m  address: "Parramatta"[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mconst asset = {[m
[32m+[m[32m  name: "Board",[m
[32m+[m[32m  dimension: "300*50",[m
[32m+[m[32m  location: "Front",[m
[32m+[m[32m  status: ACTIVE[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mconst updated_asset = {[m
[32m+[m[32m  name: "Screen",[m
[32m+[m[32m  dimension: "300*50",[m
[32m+[m[32m  location: "Front",[m
[32m+[m[32m  status: ACTIVE[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mdescribe("Asset Flow", () => {[m
[32m+[m[32m  beforeAll(async () => {[m
[32m+[m[32m    await models.sequelize.sync();[m
[32m+[m[32m  })[m
[32m+[m[32m  afterAll(async () => {[m
[32m+[m[32m    await models.sequelize.close();[m
[32m+[m[32m    await app.close;[m
[32m+[m[32m  });[m
[32m+[m
[32m+[m[32m  it("Create Asset ,View all & Update Asset details by Logged in User", async () => {[m
[32m+[m[32m    const res = await request(app)[m
[32m+[m[32m      .post(`${process.env.API_PREFIX}/user`)[m
[32m+[m[32m      .send(user);[m
[32m+[m[32m    const login_res = await request(app)[m
[32m+[m[32m      .post(`${process.env.API_PREFIX}/user/login`)[m
[32m+[m[32m      .send({ "email_id": user.email_id, "password": user.password })[m
[32m+[m[32m      .then(async (login_res) => {[m
[32m+[m[32m        const token = JSON.parse(login_res.text).token;[m
[32m+[m[32m        const shop_create_response = await request(app)[m
[32m+[m[32m          .post(`${process.env.API_PREFIX}/shop`)[m
[32m+[m[32m          .set("authorization", token)[m
[32m+[m[32m          .send(shop).then(async () => {[m
[32m+[m[32m            const view_shop_response = await request(app)[m
[32m+[m[32m              .get(`${process.env.API_PREFIX}/shop`)[m
[32m+[m[32m              .set("authorization", token);[m
[32m+[m[32m            expect(view_shop_response.statusCode).toEqual(200);[m
[32m+[m
[32m+[m[32m            let shops = JSON.parse(view_shop_response.text).rows[ 0 ];[m
[32m+[m[32m            asset.shop_id = shops.id;[m
[32m+[m
[32m+[m[32m            const asset_create_response = await request(app)[m
[32m+[m[32m              .post(`${process.env.API_PREFIX}/asset`)[m
[32m+[m[32m              .set("authorization", token)[m
[32m+[m[32m              .send(asset);[m
[32m+[m[32m            expect(asset_create_response.statusCode).toEqual(201);[m
[32m+[m
[32m+[m[32m            const view_asset_response = await request(app)[m
[32m+[m[32m              .get(`${process.env.API_PREFIX}/asset`)[m
[32m+[m[32m              .set("authorization", token)[m
[32m+[m[32m            expect(view_asset_response.statusCode).toEqual(200);[m
[32m+[m
[32m+[m[32m            const assets = JSON.parse(view_asset_response.text).rows[ 0 ];[m
[32m+[m
[32m+[m[32m            const asset_update_response = await request(app)[m
[32m+[m[32m              .put(`${process.env.API_PREFIX}/asset/${assets.id}`)[m
[32m+[m[32m              .set("authorization", token)[m
[32m+[m[32m              .send(updated_asset)[m
[32m+[m[32m            expect(asset_update_response.statusCode).toEqual(201);[m
[32m+[m[32m            const view_asset = await request(app)[m
[32m+[m[32m              .get(`${process.env.API_PREFIX}/asset`)[m
[32m+[m[32m              .set("authorization", token)[m
[32m+[m[32m            console.log(`assets updated:${JSON.stringify(view_asset.text)}`)[m
[32m+[m[32m          })[m
[32m+[m[32m      });[m
[32m+[m[32m  });[m
[32m+[m[32m});[m
[1mdiff --git a/test/shop.spec.js b/test/shop.spec.js[m
[1mnew file mode 100644[m
[1mindex 0000000..ee0b6d0[m
[1m--- /dev/null[m
[1m+++ b/test/shop.spec.js[m
[36m@@ -0,0 +1,66 @@[m
[32m+[m[32mconst request = require("supertest");[m
[32m+[m[32mconst app = require("../src/app");[m
[32m+[m[32mconst models = require("../src/models")[m
[32m+[m[32mconst { roles, status } = require("../src/constants/constants");[m
[32m+[m[32mconst { USER } = roles;[m
[32m+[m[32mconst user = {[m
[32m+[m[32m    email_id: "user@ooh.com",[m
[32m+[m[32m    password: "user123",[m
[32m+[m[32m    first_name: "User",[m
[32m+[m[32m    last_name: "U",[m
[32m+[m[32m    user_type: USER,[m
[32m+[m[32m    contact_no: "9999999999",[m
[32m+[m[32m    dob: "1950-10-10",[m
[32m+[m[32m    address: "NSW,Sydney"[m
[32m+[m[32m}[m
[32m+[m[32mconst shop = {[m
[32m+[m[32m    name: "Westfield",[m
[32m+[m[32m    address: "Parramatta"[m
[32m+[m[32m}[m
[32m+[m[32mconst updated_shop = {[m
[32m+[m[32m    name: "Westfield",[m
[32m+[m[32m    address: "Town Hall"[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mdescribe("Shopping Centre Flow", () => {[m
[32m+[m[32m    beforeAll(async () => {[m
[32m+[m[32m        await models.sequelize.sync();[m
[32m+[m[32m    })[m
[32m+[m[32m    afterAll(async () => {[m
[32m+[m[32m        await models.sequelize.close();[m
[32m+[m[32m        await app.close;[m
[32m+[m[32m    });[m
[32m+[m
[32m+[m[32m    it("Create Shopping Centre ,View all & Update Details by Logged in User", async () => {[m
[32m+[m[32m        const res = await request(app)[m
[32m+[m[32m            .post(`${process.env.API_PREFIX}/user`)[m
[32m+[m[32m            .send(user);[m
[32m+[m[32m        const login_res = await request(app)[m
[32m+[m[32m            .post(`${process.env.API_PREFIX}/user/login`)[m
[32m+[m[32m            .send({ "email_id": user.email_id, "password": user.password })[m
[32m+[m[32m            .then(async (login_res) => {[m
[32m+[m[32m                const token = JSON.parse(login_res.text).token;[m
[32m+[m[32m                const shop_create_response = await request(app)[m
[32m+[m[32m                    .post(`${process.env.API_PREFIX}/shop`)[m
[32m+[m[32m                    .set("authorization", token)[m
[32m+[m[32m                    .send(shop);[m
[32m+[m[32m                expect(shop_create_response.statusCode).toEqual(201);[m
[32m+[m
[32m+[m[32m                const view_shop_response = await request(app)[m
[32m+[m[32m                    .get(`${process.env.API_PREFIX}/shop`)[m
[32m+[m[32m                    .set("authorization", token)[m
[32m+[m[32m                expect(view_shop_response.statusCode).toEqual(200);[m
[32m+[m
[32m+[m[32m                let shops = JSON.parse(view_shop_response.text).rows[ 0 ];[m
[32m+[m[32m                console.log(`View shops:${JSON.stringify(shops)}`);[m
[32m+[m
[32m+[m[32m                const shop_update_response = await request(app)[m
[32m+[m[32m                    .put(`${process.env.API_PREFIX}/shop/${shops.id}`)[m
[32m+[m[32m                    .set("authorization", token)[m
[32m+[m[32m                    .send(updated_shop)[m
[32m+[m[32m                expect(shop_update_response.statusCode).toEqual(201);[m
[32m+[m
[32m+[m[32m                console.log(`Updated shop details:${JSON.stringify(shop_update_response)}`);[m
[32m+[m[32m            });[m
[32m+[m[32m    })[m
[32m+[m[32m});[m
[1mdiff --git a/test/user.spec.js b/test/user.spec.js[m
[1mindex b24e354..ed0443b 100644[m
[1m--- a/test/user.spec.js[m
[1m+++ b/test/user.spec.js[m
[36m@@ -1,8 +1,8 @@[m
 const request = require("supertest");[m
 const app = require("../src/app");[m
 const models = require("../src/models")[m
[31m-const { USER } = require("../src/constants/constants");[m
[31m-// const { expect } = require("chai");[m
[32m+[m[32mconst { roles, status } = require("../src/constants/constants");[m
[32m+[m[32mconst { USER } = roles;[m
 const user = {[m
   email_id: "user@ooh.com",[m
   password: "user123",[m
[36m@@ -13,175 +13,8 @@[m [mconst user = {[m
   dob: "1950-10-10",[m
   address: "NSW,Sydney"[m
 }[m
[31m-const shop = {[m
[31m-  name: "Westfield",[m
[31m-  address: "Parramatta"[m
[31m-}[m
[31m-[m
[31m-const updated_shop = {[m
[31m-  name: "Westfield",[m
[31m-  address: "Town Hall"[m
[31m-}[m
[31m-[m
[31m-const asset = {[m
[31m-  name: "Board",[m
[31m-  dimension: "300*50",[m
[31m-  location: "Front",[m
[31m-  status: "active"[m
[31m-}[m
[31m-[m
[31m-const updated_asset = {[m
[31m-  name: "Screen",[m
[31m-  dimension: "300*50",[m
[31m-  location: "Front",[m
[31m-  status: "active"[m
[31m-}[m
[31m-[m
[31m-// describe("User Flow", () => {[m
[31m-//     beforeAll(async () => {[m
[31m-//         await models.sequelize.sync();[m
[31m-//     })[m
[31m-//     afterAll(async () => {[m
[31m-//         await models.sequelize.close();[m
[31m-//         await app.close;[m
[31m-//     });[m
[31m-[m
[31m-//     it("Login Failure::User not found", async () => {[m
[31m-//         const res = await request(app)[m
[31m-//             .post(`${process.env.API_PREFIX}/user/login`)[m
[31m-//             .send({ "email_id": user.email_id, "password": user.password });[m
[31m-//         expect(res.statusCode).toEqual(500);[m
[31m-//         expect(res.text).toEqual("{\"error\":\"No such user or Incorrect Password\"}");[m
[31m-//     });[m
[31m-[m
[31m-//     it("Create User", async () => {[m
[31m-//         const res = await request(app)[m
[31m-//             .post(`${process.env.API_PREFIX}/user`)[m
[31m-//             .send(user);[m
[31m-//         expect(res.statusCode).toEqual(201);[m
[31m-//     });[m
[31m-[m
[31m-//     it("Login Success", async () => {[m
[31m-//         const res = await request(app)[m
[31m-//             .post(`${process.env.API_PREFIX}/user/login`)[m
[31m-//             .send({ "email_id": user.email_id, "password": user.password });[m
[31m-//         expect(res.statusCode).toEqual(200);[m
[31m-//     });[m
[31m-// });[m
[31m-[m
[31m-// describe("Shopping Centre Flow", () => {[m
[31m-//     beforeAll(async () => {[m
[31m-//         await models.sequelize.sync();[m
[31m-//     })[m
[31m-//     afterAll(async () => {[m
[31m-//         await models.sequelize.close();[m
[31m-//         await app.close;[m
[31m-//     });[m
[31m-[m
[31m-//     it("Create Shopping Centre & View all by Logged in User", async () => {[m
[31m-//         const res = await request(app)[m
[31m-//             .post(`${process.env.API_PREFIX}/user`)[m
[31m-//             .send(user);[m
[31m-//         const login_res = await request(app)[m
[31m-//             .post(`${process.env.API_PREFIX}/user/login`)[m
[31m-//             .send({ "email_id": user.email_id, "password": user.password })[m
[31m-//             .then(async (login_res) => {[m
[31m-//                 const token = JSON.parse(login_res.text).token;[m
[31m-//                 const shop_create_response = await request(app)[m
[31m-//                     .post(`${process.env.API_PREFIX}/shop`)[m
[31m-//                     .set("authorization", token)[m
[31m-//                     .send(shop);[m
[31m-//                 expect(shop_create_response.statusCode).toEqual(201);[m
[31m-[m
[31m-//                 const view_shop_response = await request(app)[m
[31m-//                     .get(`${process.env.API_PREFIX}/shop`)[m
[31m-//                     .set("authorization", token)[m
[31m-//                 expect(view_shop_response.statusCode).toEqual(200);[m
[31m-//             });[m
[31m-//     });[m
[31m-// });[m
[31m-[m
[31m-// describe("Asset Flow", () => {[m
[31m-//   beforeAll(async () => {[m
[31m-//     await models.sequelize.sync();[m
[31m-//   })[m
[31m-//   afterAll(async () => {[m
[31m-//     await models.sequelize.close();[m
[31m-//     await app.close;[m
[31m-//   });[m
[31m-[m
[31m-//   it("Create Asset & View all by Logged in User", async () => {[m
[31m-//     const res = await request(app)[m
[31m-//       .post(`${process.env.API_PREFIX}/user`)[m
[31m-//       .send(user);[m
[31m-//     const login_res = await request(app)[m
[31m-//       .post(`${process.env.API_PREFIX}/user/login`)[m
[31m-//       .send({ "email_id": user.email_id, "password": user.password })[m
[31m-//       .then(async (login_res) => {[m
[31m-//         const token = JSON.parse(login_res.text).token;[m
[31m-//         const shop_create_response = await request(app)[m
[31m-//           .post(`${process.env.API_PREFIX}/shop`)[m
[31m-//           .set("authorization", token)[m
[31m-//           .send(shop).then(async () => {[m
[31m-//             const view_shop_response = await request(app)[m
[31m-//               .get(`${process.env.API_PREFIX}/shop`)[m
[31m-//               .set("authorization", token);[m
 [m
[31m-//             let shops = JSON.parse(view_shop_response.text).rows[ 0 ];[m
[31m-//             asset.shop_id = shops.id;[m
[31m-//             const asset_create_response = await request(app)[m
[31m-//               .post(`${process.env.API_PREFIX}/asset`)[m
[31m-//               .set("authorization", token)[m
[31m-//               .send(asset);[m
[31m-//             expect(asset_create_response.statusCode).toEqual(201);[m
[31m-[m
[31m-//             const view_asset_response = await request(app)[m
[31m-//               .get(`${process.env.API_PREFIX}/asset`)[m
[31m-//               .set("authorization", token)[m
[31m-//             expect(view_asset_response.statusCode).toEqual(200);[m
[31m-//           })[m
[31m-//       });[m
[31m-//   });[m
[31m-// });[m
[31m-[m
[31m-// describe("Shop Update Flow", () => {[m
[31m-//   beforeAll(async () => {[m
[31m-//     await models.sequelize.sync();[m
[31m-//   })[m
[31m-//   afterAll(async () => {[m
[31m-//     await models.sequelize.close();[m
[31m-//     await app.close;[m
[31m-//   });[m
[31m-[m
[31m-//   it("Create Shop & Update it by Logged in User", async () => {[m
[31m-//     const res = await request(app)[m
[31m-//       .post(`${process.env.API_PREFIX}/user`)[m
[31m-//       .send(user);[m
[31m-//     const login_res = await request(app)[m
[31m-//       .post(`${process.env.API_PREFIX}/user/login`)[m
[31m-//       .send({ "email_id": user.email_id, "password": user.password })[m
[31m-//       .then(async (login_res) => {[m
[31m-//         const token = JSON.parse(login_res.text).token;[m
[31m-//         await request(app)[m
[31m-//           .post(`${process.env.API_PREFIX}/shop`)[m
[31m-//           .set("authorization", token)[m
[31m-//           .send(shop).then(async () => {[m
[31m-//             const view_shop_response = await request(app)[m
[31m-//               .get(`${process.env.API_PREFIX}/shop`)[m
[31m-//               .set("authorization", token);[m
[31m-//             let shops = JSON.parse(view_shop_response.text).rows[ 0 ];[m
[31m-//             console.log(`shops:${process.env.API_PREFIX}/shop/${shops.id}`);[m
[31m-//             const shop_update_response = await request(app)[m
[31m-//               .put(`${process.env.API_PREFIX}/shop/${shops.id}`)[m
[31m-//               .set("authorization", token)[m
[31m-//               .send(updated_shop)[m
[31m-//             expect(shop_update_response.statusCode).toEqual(201);[m
[31m-//           })[m
[31m-//       })[m
[31m-//   })[m
[31m-// });[m
[31m-[m
[31m-describe("Shop Update Flow", () => {[m
[32m+[m[32mdescribe("User Flow", () => {[m
   beforeAll(async () => {[m
     await models.sequelize.sync();[m
   })[m
[36m@@ -190,45 +23,26 @@[m [mdescribe("Shop Update Flow", () => {[m
     await app.close;[m
   });[m
 [m
[31m-  it("Create Shop,Asset & Update Asset by Logged in User", async () => {[m
[32m+[m[32m  it("Login Failure::User not found", async () => {[m
     const res = await request(app)[m
[31m-      .post(`${process.env.API_PREFIX}/user`)[m
[31m-      .send(user);[m
[31m-    const login_res = await request(app)[m
       .post(`${process.env.API_PREFIX}/user/login`)[m
[31m-      .send({ "email_id": user.email_id, "password": user.password })[m
[31m-      .then(async (login_res) => {[m
[31m-        const token = JSON.parse(login_res.text).token;[m
[31m-        await request(app)[m
[31m-          .post(`${process.env.API_PREFIX}/shop`)[m
[31m-          .set("authorization", token)[m
[31m-          .send(shop).then(async () => {[m
[31m-            const view_shop_response = await request(app)[m
[31m-              .get(`${process.env.API_PREFIX}/shop`)[m
[31m-              .set("authorization", token);[m
[31m-            let shops = JSON.parse(view_shop_response.text).rows[ 0 ];[m
[31m-            asset.shop_id = shops.id;[m
[32m+[m[32m      .send({ "email_id": user.email_id, "password": user.password });[m
[32m+[m[32m    expect(res.statusCode).toEqual(500);[m
[32m+[m[32m    expect(res.text).toEqual("{\"error\":\"No such user or Incorrect Password\"}");[m
[32m+[m[32m  });[m
 [m
[31m-            await request(app)[m
[31m-              .post(`${process.env.API_PREFIX}/asset`)[m
[31m-              .set("authorization", token)[m
[31m-              .send(asset);[m
[31m-            const view_asset_response = await request(app)[m
[31m-              .get(`${process.env.API_PREFIX}/asset`)[m
[31m-              .set("authorization", token)[m
[32m+[m[32m  it("Create User", async () => {[m
[32m+[m[32m    const res = await request(app)[m
[32m+[m[32m      .post(`${process.env.API_PREFIX}/user`)[m
[32m+[m[32m      .send(user);[m
[32m+[m[32m    expect(res.statusCode).toEqual(201);[m
[32m+[m[32m  });[m
 [m
[31m-            const assets = JSON.parse(view_asset_response.text).rows[ 0 ];[m
[32m+[m[32m  it("Login Success", async () => {[m
[32m+[m[32m    const res = await request(app)[m
[32m+[m[32m      .post(`${process.env.API_PREFIX}/user/login`)[m
[32m+[m[32m      .send({ "email_id": user.email_id, "password": user.password });[m
[32m+[m[32m    expect(res.statusCode).toEqual(200);[m
[32m+[m[32m  });[m
[32m+[m[32m});[m
 [m
[31m-            const asset_update_response = await request(app)[m
[31m-              .put(`${process.env.API_PREFIX}/asset/${assets.id}`)[m
[31m-              .set("authorization", token)[m
[31m-              .send(updated_asset)[m
[31m-            expect(asset_update_response.statusCode).toEqual(201);[m
[31m-            const view_asset = await request(app)[m
[31m-              .get(`${process.env.API_PREFIX}/asset`)[m
[31m-              .set("authorization", token)[m
[31m-            console.log(`assets updated:${JSON.stringify(view_asset.text)}`)[m
[31m-          })[m
[31m-      })[m
[31m-  })[m
[31m-});[m
\ No newline at end of file[m
