# ooh

## Overview

`oOh! Shopping Centre Inventory Management System` is used to the product management team maintain records of where physical display panels are installed in shopping centres.

## Tools Used

## Installation

Following are the steps to get started with `oOh! Shopping Centre Inventory Management System`

# 1. Install

Postgres db, node/npm/nodemon

# 2. Install the app and run the testcases.

```
$ git clone https://github.com/lachusoman/ooh.git
$ cd ooh
$ npm install -g nodemon
$ npm install
$ npm test
```

`Note: Currently integ. End-to-End testing is done using supertest, jest, SQLite, sinon etc. However given enough time I would prefer to follow TDD by using libraries such as sinon to mock/fake various operations such as db calls.`

# 3. Modify config/dev.env and update the following.

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=mysecretpassword
POSTGRES_DB=postgres
POSTGRES_HOST=127.0.0.1
```

I have provisioned `Postgres instance on Cloud` which could be used for `oOh! Shopping Centre Inventory Management System` to connect. I shall share the connection details in the email.

`Note: for simplicity of the test evaluator I have configured sequelize to auto-create schema objects. In a real world scenario I would use a migration scripts e.g. that provided by sequalize.`

# 4. Running the application:

```
$ npm run dev
```

# 5. Swagger UI:

on a browser goto: http://localhost:3003/api-docs/
![Main Page](https://github.com/lachusoman/ooh/blob/master/screenshots/1_mainpage.png?raw=true)

# 6. Create a user:

There are 2 types of users in `oOh! Shopping Centre Inventory Management System`. Admin (System Admin with special privilages) and User (Regular oOh! User).
`Note: In real world scenario the System admin would not be created via the public facing API`.
![Create user](https://github.com/lachusoman/ooh/blob/master/screenshots/2%20createuser.png?raw=true)

#### Sample Regular oOh! User payload:

```
{
"email_id": "user@ooh.com",
"password":"u123",
"first_name":"User",
"last_name":"1",
"user_type": "U",
"contact_no": "000000000",
"dob":"1990-01-01",
"address":"Sydney,Australia"
}
```

#### Sample Admin oOh! User payload:

```
{
"email_id": "admin@ooh.com",
"password":"admin",
"first_name":"Admin",
"last_name":"oOh",
"user_type": "A",
"contact_no": "000000000",
"dob":"1990-01-01",
"address":"Sydney,Australia"
}
```

# 7. Login User

Login to get a API Token. Use this token for subsequent calls. Token default expiry is 1h.

`Note: In real world scenario I would have truncated the password in any of the apis`

![Login & API Token](https://github.com/lachusoman/ooh/blob/master/screenshots/3%20login.png?raw=true)

# 8. Authorize

![Authorize](https://github.com/lachusoman/ooh/blob/master/screenshots/4%20whereisauthbutton.png?raw=true)
Then,
![Authorize Step 2](https://github.com/lachusoman/ooh/blob/master/screenshots/5%20authorize.png?raw=true)

### Sample user login payload

```
{"email_id":"user@ooh.com","password":"u123"}

```

# Change from here..............

# 9. Create Shopping Center

![Authorize Step 2](https://github.com/lachusoman/ooh/blob/master/screenshots/5%20authorize.png?raw=true)

### Input for Create Shopping Centre

```
{
"name":"WestField",
"address":"Parramatta"
}
```

# 10. View the created Shopping Centers

![Authorize Step 2](https://github.com/lachusoman/ooh/blob/master/screenshots/5%20authorize.png?raw=true)

# 11 Update Shopping Centre

![Authorize Step 2](https://github.com/lachusoman/ooh/blob/master/screenshots/5%20authorize.png?raw=true)

# 12. Create Asset.

![Authorize Step 2](https://github.com/lachusoman/ooh/blob/master/screenshots/5%20authorize.png?raw=true)

### Input for Create Asset

```
{
"name":"Screen 1",
"dimension" : "300 * 300",
"location": "front",
"status" : "active",
"shoppingcentreid":1
}
```

# 13. View Created All Assets

![Authorize Step 2](https://github.com/lachusoman/ooh/blob/master/screenshots/5%20authorize.png?raw=true)

### Shopping Centre Operations

# 14. View Created Assets By Name or Status

![Authorize Step 2](https://github.com/lachusoman/ooh/blob/master/screenshots/5%20authorize.png?raw=true)

# 15. Update Assets

![Authorize Step 2](https://github.com/lachusoman/ooh/blob/master/screenshots/5%20authorize.png?raw=true)

# 16. Audit Operations

Used to track which user makes changes to the data
`Only Admin can view the Audit details`
![Authorize Step 2](https://github.com/lachusoman/ooh/blob/master/screenshots/5%20authorize.png?raw=true)

Notes:
Shoppingcentre,asset ID is used to update.

express-validor
Validation errors: [{"msg":"Please provide name","param":"name","location":"body"},{"msg":"Please provide address","param":"address","location":"body"}]

Logger could have used Bunyan instead

Negative cases in testing
End to End testing only done.

health endpoint for load balancer.

number of parameters will

update requires all attributes mandatory. explain why.
explain why testcases are large. ideally would be doing like user.spec.js
