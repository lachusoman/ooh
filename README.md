# ooh

## Overview

This service is used to the product management team maintain records of where physical display panels are installed in shopping centres

## Sample User request

#### Create User:

```
{
"email_id": "user@ooh.com",
"password":"u123",
"first_name":"User",
"last_name":"1",
"user_type": "U",
"contact_no": "+61000000000",
"dob":"1970-01-01",
"address":"Sydney,Australia"
}
```

### input for authentication

```
{"email_id":"user@ooh.com","password":"u123"}

```

### input for Shopping Centre

{
"name":"WestField",
"address":"Parramatta"
}

### input for Assets

{
"name":"Screen 1",
"dimension" : "300 \* 300",
"location": "front",
"status" : "active",
"shoppingcentreId":1
}

Notes:

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
