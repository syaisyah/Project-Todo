### Title:
```
Project Todo
```

### URL:

```
http://localhost:3000
heroku: https://project-todo-application.herokuapp.com
firebase: https://project-todo-client.web.app
```

### Methods:

1. Users

```
- POST /users/register
- POST /users/login
- POST /users/googleLogin
```

2. Todos

```
- POST /todos
- GET /todos
- GET /todos/:id
- PUT /todos/:id
- PATCH /todos/:id
- DELETE /todos/:id
```

3. Projects

```
- POST /projects
- GET /projects
- GET /projects/:id
- PATCH /projects/:id
- PATCH /projects/:id/addUser
- PATCH /projects/:id/deleteUser/:idUser
- DELETE /projects/:id
```

# Endpoints

### USERS

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
 city: "<user city>"
}
```

- Success Response:

```
Status: 201 Created
Response Body:

{
  message: "success create new user",
  id: "<user id>",
  email: "<user email>",
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
  "<user email>",
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
  email: "<user email>",
  access_token: "<google access_token>"
}
```

### TODOS

1. Create Todo

```
Create new todo for user
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
  ProjectId: null
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
  ProjectId: null
}
```

```
Create new todo for specific project
URL: /todos
Method: POST
Required Auth: Yes(for owner or member of project only)
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
  UserId:  "<id from loggin user>",
  ProjectId: "<id project from database system>"
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
  ProjectId: "<id project from database system>"
}
```

2. Get Todos

```
Get all todos from database
URL: /todos
Method: GET
Required Auth: Yes (todo belongs to current user loggin only)
```

- Query:

```
status: string
due_date: string of object date
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
  due_date: "<todo due_date>",
  UserId:  "<id from loggin user>",
  ProjectId: null
  }
]

OR

[
  {
  id: "<id todo from database system>"
  title: "<todo title>",
  status: "<todo status>",
  due_date: "<todo due_date>",
  UserId:  "<id from loggin user>",
  ProjectId: "<id project from  database system>",
  }
]
```

3. GET /todos/:id

```
Get todo by specific id
URL: /todos/:id
Method: GET
Required Auth: Yes (todo belongs to current user loggin only)
```

- Params:

```
id: integer
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
  ProjectId: null
}

OR

{
  id: "<id todo from database system>"
  title: "<todo title>",
  status: "<todo status>",
  due_date: "<todo due_date>",
  UserId:  "<id from loggin user>",
  ProjectId: "<id project from  database system>"
}

```

4. UPDATE Todo

```
Update todo by specific id
URL: /todos/:id
Method: PUT
Required Auth: Yes (todo belongs to current user loggin only)
```

- Params:

```
id: integer
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
  ProjectId: null
}

OR

{
  id: "<id todo from database system>"
  title: "<todo title>",
  status: "<todo status>",
  due_date: "<todo due_date>",
  UserId:  "<id from loggin user>",
  ProjectId: "<id project from  database system>"
}

```

5. Update Status Todo

```
Update status todo by specific id
URL: /todos/:id
Method: PATCH
Required Auth: Yes (todo belongs to current user loggin only)
```

- Params:

```
id: integer
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
  ProjectId: null
}

OR

{
  id: "<id todo from database system>"
  title: "<todo title>",
  status: "<todo status>",
  due_date: "<todo due_date>",
  UserId:  "<id from loggin user>",
  ProjectId: "<id project from  database system>"
}
```

6. DELETE Todo

```
Delete todo by specific id
URL: /todos/:id
Method: DELETE
Required Auth: Yes (todo belongs to current user loggin only)
```

- Params:

```
id: integer
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

### PROJECTS

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
  UserId:  "<id from loggin user>",
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
Required Auth: Yes (project belongs to current user loggin only)
```

- Params:

```
id: integer
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
  ownerProject: "<object of detail owner information>"
  dataTodos: "<array of todos in project>"
  dataProjects:  "<array of detail project including users that participated(owner and member)>",
}
```

4. Update Project

```
Update project by specific id
URL: /projects/:id
Method: PATCH
Required Auth: Yes (only if loggin user is the owner of the project)
```

- Params:

```
id: integer
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
Status: 200 OK
Response Body:

{
  id: "<id project from database system>"
  name: "<project name>",
  UserId:  "<id from loggin user id>",
}
```

5. PATCH /projects/:id/addUser

```
Add user to specific project
URL: /projects/:id/addUser
Method: PATCH
Required Auth: Yes (only if loggin user is the owner of the project)
```

- Params:

```
id: integer
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
Status: 200 OK
Response Body:

{
  message: "Success add user as member of project"
}
```

6. PATCH /projects/:id/deleteUser/:idUser

```
delete user to specific project
URL: /projects/:id/deleteUser/:idUser
Method: PATCH
Required Auth: Yes (only if loggin user is the owner of the project)
```

- Params:

```
idUser: integer
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
  message: "Success delete user in project"
}
```


7. DELETE Project

```
Delete project by specific id
URL: /projects/:id
Method: DELETE
Required Auth: Yes (only if loggin user is the owner of the project)
```

- Params:

```
id: integer
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


# RESTful Error Message

1. Response Error (400) Bad Request - SequelizeValidationError

- Response Body:

```
{
  status: 400,
  message: "<array of error message>"
}
```

2. Response Error (400) Bad Request - Invalid email or password

- Response Body:

```
{
  status: 400,
  message: ['Invalid email or password']
}
```

3. Status 400 Bad Request - SequelizeDatabaseError

- Response Body:

```
{
  status: 400,
  message: "<array of error message>"
}
```

4. Status 401 UnAuthenticated

- Response Body:

```
{
  status: 401,
  message: ['UnAuthenticated']
}
```

5. Status 404 User Not Found

- Response Body:

```
{
  status: 404,
  message: ['User not found']
}
```

6. Status 404 Data Not Found

- Response Body:

```
{
  status: 404,
  message: ['Data not found']
}
```

7. Status 500 Internal server errors

- Response Body:

```
{
  status: 500,
  message: ['Internal server errors']
}
```

8. Status 400 Bad Request - SequelizeUniqueConstraintError

- Response Body:

```
{
  status: 400,
  message: "<array of error message>"
}
```

9. Status 403 UnAuthorized

- Response Body:

```
{
  status: 401,
  message: ['UnAuthorized']
}
```

10. Status 400 Bad Request - User already registered in project

- Response Body:

```
{
  status: 400,
  message: ['User is already registered in project']
}
```

