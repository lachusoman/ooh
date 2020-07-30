# ooh

## Overview

This service is used to the product management team maintain records of where physical display panels are installed in shopping centres

![Main Page](https://github.com/lachusoman/ooh/blob/master/screenshots/1_mainpage.png?raw=true)

## Sample User request

#### Create User:

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

#### Create Admin:

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

### Login User

```
{"email_id":"user@ooh.com","password":"u123"}

```

### Input for Create Shopping Centre

```
{
"name":"WestField",
"address":"Parramatta"
}
```

### Input for Create Asset

```
{
"name":"Screen 1",
"dimension" : "300 \* 300",
"location": "front",
"status" : "active",
"shoppingcentreId":1
}
```

### User Operations

```
Create User
User Login
```

### Shopping Centre Operations

```
Create Shopping Centre
View Shopping Centres
Update Shopping Centre
```

### Asset Operations

```
Create Asset
View All Assets
View Assets By Name or By Status
Update Asset

```

### Audit Operations

```
View Audit details
 Only Admin can view the Audit details
 Used to track which user makes changes to the data

```

Notes:

how to login?
copy token and paste in header.

Shoppingcentre,asset ID is used to update.

express-validor
Validation errors: [{"msg":"Please provide name","param":"name","location":"body"},{"msg":"Please provide address","param":"address","location":"body"}]

JWT Token
email_id, user_type (for future enhancement to support role based access)

Logger could have used Bunyan instead

Negative cases in testing
End to End testing only done.

Error message ideally will not contain any info related to db for e.g

health endpoint for load balancer.

number of parameters will

update requires all attributes mandatory. explain why.
explain why testcases are large. ideally would be doing like user.spec.js
