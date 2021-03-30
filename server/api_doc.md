### Title:

- Dragon Todo

### URL:

- http://localhost:3001

### Params:

```
| id: integer
```

### Methods:

1. Users

```
- POST /users/register
- POST /users/login
- post /users/googleLogin
```

2. Todos

```
- POST /todos
- GET /todos?status=completed
- GET /todos?status=uncompleted
- GET /todos?due_date=today
- GET /todos/:id
- DELETE /todos/:id
- PUT /todos/:id
- PATCH /todos/:id
```

3. Projects

```
- POST /projects
- GET /projects
- GET /projects/:id
- DELETE /projects/:id
- PATCH /projects/:id
- PATCH /projects/:ProjectId/addUser

```

### Endpoints

USERS

1. Register

```
Create/Register new User
URL: /users/register
Method: POST
Required Auth: No
```

- Request Body:

```
{
 email: "<user email>",
 password: "<user password>",
}
```

- Success Response:

```
Status: 201 Created
Response Body:

{
  message: "success create new user",
}
```

2. Login

```
Login with account that already register in database system
URL: /users/login
Method: POST
Required Auth: No
```

- Request Body:

```
{
 email: "<user email>",
 password: "<user password>"
}
```

- Success Response:

```
Status: 200 OK
Response Body:

{
  access_token: "<user access_token>"
}
```

3. Google Login

```
Login with account google
URL: /users/googleLogin
Method: POST
Required Auth: No
```

- Success Response:

```
Status: 200 OK
Response Body:

{
  access_token: "<google access_token>"
}
```

TODOS

1. Create Todo

```
Create new todo
URL: /todos
Method: POST
Required Auth: Yes
```

- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Request Body:

```
{
  title: "<new todo title>",
  status: "<new todo status>",
  due_date: "<new todo due_date>",
}
```

- Success Response:

```
Status: 201 Created
Response Body:

{
  id: "<id todo from database system>"
  title: "<todo title>",
  status: "<todo status>",
  due_date: "<todo due_date>",
  UserId:  "<id from loggin user>",
}
```

2. Get Todos

```
Get all todos with status completed
URL: /todos?status=completed
Method: GET
Required Auth: Yes (todo belongs to current user loggin only)
```

- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Success Response:

```
Status: 200 OK
Response Body:

[
  {
  id: "<id todo from database system>"
  title: "<todo title>",
  status: "completed",
  due_date: "<todo due_date>",
  UserId:  "<id from loggin user>",
  }
]
```

3. Get Todos

```
Get all todos with status uncompleted
URL: /todos?status=uncompleted
Method: GET
Required Auth: Yes (todo belongs to current user loggin only)
```

- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Success Response:

```
Status: 200 OK
Response Body:

[
  {
  id: "<id todo from database system>"
  title: "<todo title>",
  status: "uncompleted",
  due_date: "<todo due_date>",
  UserId:  "<id from loggin user>",
  }
]
```

4. Get Todos

```
Get all todos with due_date is today
URL: /todos?due_date=today
Method: GET
Required Auth: Yes (todo belongs to current user loggin only)
```

- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Success Response:

```
Status: 200 OK
Response Body:

[
  {
  id: "<id todo from database system>"
  title: "<todo title>",
  status: "<todo status>",
  due_date: "today",
  UserId:  "<id from loggin user>",
  }
]
```

5. GET /todos/:id

```
Get todo by specific id
URL: /todos/:id
Method: GET
Required Auth: Yes (todo belongs to current user loggin only)
```

- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Success Response:

```
Status: 200 OK
Response Body:

{
  id: "<id todo from database system>"
  title: "<todo title>",
  status: "<todo status>",
  due_date: "<todo due_date>",
  UserId:  "<id from loggin user>",
}

```

6. DELETE Todo

```
Delete todo by specific id
URL: /todos/:id
Method: DELETE
Required Auth: Yes (todo belongs to current user loggin only)
```

- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Success Response:

```
Status: 200 OK
Response Body:

{
  message: "Delete Todo Success"
}

```

7. UPDATE Todo

```
Update todo by specific id
URL: /todos/:id
Method: PUT
Required Auth: Yes (todo belongs to current user loggin only)
```

- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Request Body:

```
{
  title: "<todo title>",
  status: "<todo status>",
  due_date: "<todo due_date>",
}
```

- Success Response:

```
Status: 200 OK
Response Body:

{
  id: "<id todo from database system>"
  title: "<todo title>",
  status: "<todo status>",
  due_date: "<todo due_date>",
  UserId:  "<id from loggin user>",
}

```

8. Update Status Todo

```
Update status todo by specific id
URL: /todos/:id
Method: PATCH
Required Auth: Yes (todo belongs to current user loggin only)
```

- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Request Body:

```
{
  status: "<new todo status>"
}
```

- Success Response:

```
Status: 200 OK
Response Body:

{
  id: "<id todo from database system>"
  title: "<todo title>",
  status: "<new todo status>",
  due_date: "<todo due_date>",
  UserId:  "<id from loggin user>",
}

```

PROJECTS

1. Create Project

```
Create new project
URL: /projects
Method: POST
Required Auth: Yes
```

- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Request Body:

```
{
  name: "<new project name>"
}
```

- Success Response:

```
Status: 201 Created
Response Body:

{
  id: "<id project from database system>"
  name: "<project name>",
  UserId:  "<id from loggin user>",
}
```

2. Get Projects

```
Get all project from database
URL: /projects
Method: GET
Required Auth: Yes (projects belongs to current user loggin only)
```

- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Success Response:

```
Status: 200 OK
Response Body:

[
  {
    id: "<id project from database system>"
    name: "<project name>",
    UserId:  "<id user from database system>",
 }
]
```

3. GET /projects/:id

```
Get project by specific id
URL: /projects/:id
Method: GET
Required Auth: Yes (projects belongs to current user loggin only)
```

- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Success Response:

```
Status: 200
Response Body:

{
  id: "<id project from database system>"
  name: "<project name>",
  UserId:  "<id user from database system>",
}
```

4. DELETE Project

```
Delete project by specific id
URL: /projects/:id
Method: DELETE
Required Auth: Yes (projects belongs to current user loggin only)
```

- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Success Response:

```
Status: 200 OK
Response Body:

{
  message: "Success delete project"
}
```

5. Update Project

```
Update project by specific id
URL: /projects/:id
Method: PATCH
Required Auth: Yes (projects belongs to current user loggin only)
```

- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Request Body:

```
{
  name: "<project name>",
}
```

- Success Response:

```
Status: 200
Response Body:

{
  id: "<id project from database system>"
  name: "<project name>",
  UserId:  "<id user from database system>",
}
```

6. PATCH /projects/:ProjectId/addUser

```
Add user to specific project
URL: /projects/:ProjectId/addUser
Method: PATCH
Required Auth: Yes (projects belongs to current user loggin only)
```

- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Request Body:

```
{
  email: "<user email>"
}
```

- Success Response:

```
Status: 200
Response Body:

{
  id: "<id project from database system>"
  name: "<project name>",
  User:  [
    {
      id: "<user id>",
      email: "<user email>"
    },
     {
      id: "<user id>",
      email: "<user email>"
    }
  ]
}
```

# RESTful Error Message

1. Response Error (400) Bad Request - SequelizeValidationError

- Response Body:

```
{
  status: "<code>",
  name: "<SequelizeValidationError>",
  details: "[array of error message]"
}
```

2. Response Error (400) Bad Request - invalid email or password

- Response Body:

```
{
  "message": "<Invalid email or password>"
}
```

3. Status 400 Bad Request - SequelizeDatabaseError

- Response Body:

```
{
  status: "<code>",
  name: "<SequelizeDatabaseError>",
  details: "[array of error message]"
}
```

4. Status 401 UnAuthorized

- Response Body:

```
{
  "message": "<Unauthorized User>"
}
```

5. Status 404 User Not Found

- Response Body:

```
{
  "message": "<User not found>"
}
```

6. Status 404 Data Not Found

- Response Body:

```
{
  "message": "<Data not found>"
}
```

7. Status 500 Internal server errors

- Response Body:

```
{
  "message": "<Internal server errors>"
}
```

// perlukah membuat endpoint untuk jika semua todo di dalam project completed
