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
- POST /register
- POST /login
```

2. Todos

```
- POST /todos
- GET /todos
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
- PUT /projects/:id
- PATCH /projects/:id

```

### CRUD endpoints

> Users

1. POST /register

```
   | Create/Register new User
```

- Request Body:

```
{
 name: "<user name>",
 email: "<user email>",
 password: "<user password>",
 city: "<user city>",
}
```

- Success Response:

* Status: 201
* Response Body:

```
{
  message: "success create new user",
  name: "<user name>",
  email: "<user email>",
}
```

2. POST /login
```
   | Login to get access_token
```

- Request Body:

```
{
 email: "<user email>",
 password: "<user password>"
}
```

- Success Response:

* Status: 200
* Response Body:

```
{
  access_token: "<user access_token>"
}
```

> Todos

1. POST /todos
```
   | Create new todo
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
  description: "<new todo description>",
  status: "<new todo status>",
  due_date: "<new todo due_date>",
  UserId:  "<id from loggin user>",
}
```

- Success Response:

* Status: 201
* Response Body:

```
{
  id: "<id todo from database system>"
  title: "<todo title>",
  description: "<todo description>",
  status: "<todo status>",
  due_date: "<todo due_date>",
  UserId:  "<id from loggin user>",
}
```

2. GET /todos
```
   | Get/Show all todos from database
```
- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Success Response:

* Status: 200
* Response Body:

```
[
  {
  id: "<id todo from database system>"
  title: "<todo title>",
  description: "<todo description>",
  status: "<todo status>",
  due_date: "<todo due_date>",
  UserId:  "<id from loggin user>",
  }
]
```

3. GET /todos/:id
```
   | Get todo by specific id
```

- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Success Response:

* Status: 200
* Response Body:

```
{
  id: "<id todo from database system>"
  title: "<todo title>",
  description: "<todo description>",
  status: "<todo status>",
  due_date: "<todo due_date>",
  UserId:  "<id from loggin user>",
}

```

4. DELETE /todos/:id
```
   | Delete todo by specific id
```

- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Success Response:

* Status: 200
* Response Body:

```
{
  message: "Successfully delate a todo"
}

```

5. PUT /todos/:id
```
   | Update todo by specific id
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
  id: "<id todo from database system>"
  title: "<todo title>",
  description: "<todo description>",
  status: "<todo status>",
  due_date: "<todo due_date>",
}
```

- Success Response:

* Status: 200
* Response Body:

```
{
  id: "<id todo from database system>"
  title: "<todo title>",
  description: "<todo description>",
  status: "<todo status>",
  due_date: "<todo due_date>",
  UserId:  "<id from loggin user>",
}

```

6. PATCH /todos/:id
```
   | Update status todo by specific id
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

* Status: 200
* Response Body:

```
{
  id: "<id todo from database system>"
  title: "<todo title>",
  description: "<todo description>",
  status: "<new todo status>",
  due_date: "<todo due_date>",
  UserId:  "<id from loggin user>",
}

```

> Projects

1. POST /projects
```
   | Create new project
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
  name: "<new project name>",
  status: "<new project status>",
  due_date: "<new project due_date>",
  UserId:  "<id from loggin user>",
}

```

- Success Response:

* Status: 201
* Response Body:

```
{
  id: "<id project from database system>"
  name: "<project name>",
  status: "<project status>",
  due_date: "<project due_date>",
  UserId:  "<id from loggin user>",
}
```

2. GET /projects
```
   | Get all project from database
```
- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Success Response:

* Status: 200
* Response Body:

```
[
  {
    id: "<id project from database system>"
    name: "<project name>",
    status: "<project status>",
    due_date: "<project due_date>",
    UserId:  "<id user from database system>",
 }
]
```

3. GET /projects/:id
```
   | Get project by specific id
```
- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Success Response:

* Status: 200
* Response Body:

```
{
  id: "<id project from database system>"
  name: "<project name>",
  status: "<project status>",
  due_date: "<project due_date>",
  UserId:  "<id user from database system>",
}
```

4. DELETE /projects/:id
```
   | Delete project by specific id
```
- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Success Response:

* Status: 200
* Response Body:

```
{
  message: "successfully delete project"
}
```

5. PUT /projects/:id
```
   | Update project by specific id
```
- Request Headers:

```
{
  access_token: "<user access_token>"
}
```

- Success Response:

* Status: 200
* Response Body:

```
{
  id: "<id project from database system>"
  name: "<project name>",
  status: "<project status>",
  due_date: "<project due_date>",
  UserId:  "<id user from database system>",
}
```

6. PATCH /projects/:id
```
   | Update status project by specific id
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
  status: "<new project status>"
}
```

- Success Response:

* Status: 200
* Response Body:

```
{
  id: "<id project from database system>"
  name: "<project name>",
  status: "<new project status>",
  due_date: "<project due_date>",
  UserId:  "<id user from database system>",
}
```

# RESTful Error Response

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
  "message": "<invalid email or password>"
}
```

3. Status 400 Bad Request - SequelizeDatabaseError

- Response Body:

```
{
  status: "<code>",
  name: "<SequelizeValidationError>",
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
