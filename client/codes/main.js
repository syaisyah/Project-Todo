// const baseUrl = 'http://localhost:3000'
const baseUrl = 'https://project-todo-application.herokuapp.com'
let idTodo;
let idProject;


$(document).ready(function () {
  checkLocalStorage()
  $("#btn-login").on("click", (e) => {
    e.preventDefault()
    login()
  })
  $("#btn-register").on("click", (e) => {
    e.preventDefault()
    register()
  })

  $("btn-google").on("click", (e) => {
    e.preventDefault()
    onSignIn()
  })

  $("#btn-logout").on("click", (e) => {
    e.preventDefault()
    logout()
  })

  $("#btn-save").on("click", (e) => {
    e.preventDefault()
    updateTodo(idTodo)
  })

  $("#btn-create-todo").on('click', (e) => {
    e.preventDefault()
    createTodo()
  })

  $(".btn-close").on('click', (e) => {
    e.preventDefault()
    $("#form-todo").trigger('reset')
    $("#completed").attr('checked', false)
    $("#uncompleted").attr('checked', false)
    $("#form-project").trigger('reset')
    $("#form-add-user").trigger('reset')
  })

  $("#btn-close-end").on('click', (e) => {
    e.preventDefault()
    $("#form-todo").trigger('reset')
    $("#completed").attr('checked', false)
    $("#uncompleted").attr('checked', false)
  })

  $("#btn-close-project").on('click', (e) => {
    e.preventDefault();
    $("#form-project").trigger('reset')

  })

  $("#btn-add-project").on('click', (e) => {
    e.preventDefault()
    createProject()
  })

  $("#get-all-projects").on('click', (e) => {
    e.preventDefault()
    fetchProjects()
  })

  $('select').on('change', (e) => {
    getFilterTodos()
  })

  $("#btn-close-add-user").on('click', (e) => {
    e.preventDefault()
    $("#form-add-user").trigger('reset')
  })

  $("#btn-add-user").on('click', (e) => {
    e.preventDefault()
    addUser(idProject)
  })

  $("#btn-edit-project").on('click', (e) => {
    e.preventDefault()
    updateProject(idProject)
  })

});


function checkLocalStorage() {
  if (!localStorage.access_token) {
    $("#home-page").hide()
    $("#login-register-page").show()
    $("#detail-project").hide()

  } else {
    $("#email-user").text(localStorage.email)
    $("#home-page").show()
    $("#login-register-page").hide()
    findAllTodo()
    getFilterTodos()
    findAllProjects()
  }
}

function register() {
  const email = $("#email").val()
  const password = $("#password").val()
  $.ajax({
    url: baseUrl + `/users/register`,
    method: "POST",
    data: { email, password }
  })
    .done(response => {
      Swal.fire(
        'Register Success, Login to continue!',
        'You clicked the button!',
        'success'
      )

    })
    .fail(err => {
      let message = err.responseJSON.message.map(el => el.toLowerCase())
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message
      })
    })
    .always(el => {
      $("#email").val("")
      $("#password").val("")
    })
}

function login() {
  const email = $("#email").val()
  const password = $("#password").val()
  $.ajax({
    url: baseUrl + `/users/login`,
    method: "POST",
    data: { email, password }
  })
    .done(response => {
      Swal.fire(
        'Login Success!',
        'Welcome to Todo App!',
        'success'
      )
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('email', response.email)
      $("#email-user").text(response.email)
      checkLocalStorage()

    })
    .fail(err => {
      console.log(err, 'err>>')
      let message = err.responseJSON.message.map(el => el)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message
      })
    })
    .always(_ => {
      $("#email").val("")
      $("#password").val("")
    })
}

function onSignIn(googleUser) {
  let id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
    url: baseUrl + '/users/googleLogin',
    method: "POST",
    data: {
      googleToken: id_token
    }
  })
    .done(response => {
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem('email', response.email)
      $("#email-user").text(response.email)
      checkLocalStorage();
    })
    .fail(err => {
      console.log(err.responseJSON)
    })
}

function logout() {
  localStorage.clear()
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });

  checkLocalStorage()
}

function findAllTodo() {
  $.ajax({
    url: baseUrl + `/todos?due_date=today`,
    method: "GET",
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
    .done(todos => {
      console.log(todos, '>>>')
      $("#list-todo-today").empty();
      if (todos.length) {
        todos.forEach((el, i) => {
          if (el.status.toLowerCase() === 'uncompleted') {
            $("#list-todo-today").append(`
            <div class="col-6  py-2 w-75 align-baseline">
              <p class="uncompleted-unstrike" ><button type="button" class="trans" onclick="updateStatusTodo(${el.id}, '${el.status}')"><i class="far fa-circle"></i></button>${el.title}</p>
              
            </div>
            <div class="w-25 col-6 text-end d-flex justify-content-end ps-2 ">
              <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" data-bs-toggle="tooltip" title="Detail Todo" onclick="showFormDetail(${el.id})"> <i class="fas fa-info-circle"></i></button><br />
              <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" data-bs-toggle="tooltip" title="Edit Todo" onclick="showFormUpdate(${el.id})"> <i class="fas fa-edit"></i></button><br />
              <button type="button" class="trans"  data-bs-toggle="tooltip" title="Delete Todo" onclick="destroyByIdTodo(${el.id})"> <i class="fas fa-trash"></i></button><br />
            </div>
            `)
          } else {
            $("#list-todo-today").append(`
            <div class="col-6  py-2 w-75 align-baseline">
              <p class="completed-strike"><button type="button" class="trans"><i class="fas fa-check-circle" onclick="updateStatusTodo(${el.id}, '${el.status}')"></i> </button>${el.title}</p> 
            </div>
            <div class="w-25 col-6 text-end d-flex justify-content-end ps-2 ">
              <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" data-bs-toggle="tooltip" title="Detail" onclick="showFormDetail(${el.id})"> <i class="fas fa-info-circle"></i></button><br />
              <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" data-bs-toggle="tooltip" title="Edit" onclick="showFormUpdate(${el.id})"> <i class="fas fa-edit"></i></button><br />
              <button type="button" class="trans"  data-bs-toggle="tooltip" title="Delete" onclick="destroyByIdTodo(${el.id})"> <i class="fas fa-trash"></i></button><br />
            </div>
            `)
          }
        });
      } else {
        $("#list-todo-today").append(`<p class="text-center">You dont have any task for today</p>`)
      }
    })
    .catch(err => {
      console.log(err.responseJSON)
    })
}

function updateStatusTodo(idTodo, statusTodo) {
  if (statusTodo.toLowerCase() === 'completed') {
    $(".completed-strike").removeClass('completed-strike').addClass('uncompleted-unstrike');
    statusTodo = 'Uncompleted'
  } else {
    $(".uncompleted-unstrike").removeClass('uncompleted-unstrike').addClass('completed-strike');
    statusTodo = 'Completed'
  }

  $.ajax({
    url: baseUrl + '/todos/' + idTodo,
    method: 'PATCH',
    data: { status: statusTodo },
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .done(response => {
      checkLocalStorage()
    })
    .fail(err => {
      let message = err.responseJSON.message.map(el => el)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message
      })
    })
}


function getByIdTodo(id) {
  $.ajax({
    url: baseUrl + '/todos/' + id,
    method: "GET",
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .done(todo => {
      $("#title-todo").val(todo.title)
      $("#due_date-todo").val(todo.due_date.split('T')[0])
      $("#user-id-todo").val(todo.UserId)
      $("#project-id-todo").val(todo.ProjectId)

      if (todo.status === $("#completed").val()) {
        $("#completed").attr('checked', true)
      } else {
        $("#uncompleted").attr('checked', true)
      }
    })
    .fail(err => console.log(err.responseJSON))
}

function showFormDetail(id) {
  getByIdTodo(id);
  $("#title-modal").text('Detail Todo')
  $("#fieldset-form").attr('disabled', true)
  $("#btn-save").hide()
  $("#btn-create-todo").hide()
  $("#user-id-div").show()
  $("#project-id-div").show()
}


function showFormUpdate(id) {
  getByIdTodo(id);
  $("#title-modal").text('Update Todo')
  $("#fieldset-form").attr('disabled', false)
  $("#btn-save").show()
  $("#btn-create-todo").hide()
  $("#user-id-div").hide()
  $("#project-id-div").hide()
  idTodo = id;
}

function updateTodo(id) {
  $.ajax({
    url: baseUrl + '/todos/' + id,
    method: "PUT",
    data: {
      title: $("#title-todo").val(),
      due_date: $("#due_date-todo").val(),
      status: $("input:checked").val()
    },
    headers: { access_token: localStorage.getItem('access_token') },
  })
    .done(response => {
      checkLocalStorage()
    })
    .fail(err => {
      err.responseJSON.message.forEach(el => {
        $(".error-message").append(`<div class="alert alert-danger" role="alert">${el}</div>`)
      })
      setTimeout(() => { $(".error-message").empty() }, 3000)
    })

}



function destroyByIdTodo(id) {
  Swal.fire({
    title: 'Are you sure to delete this todo?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes !!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: baseUrl + '/todos/' + id,
        method: "DELETE",
        headers: { access_token: localStorage.getItem('access_token') }
      })
        .done(response => {
          Swal.fire(
            'Success Deleted Todo!',
            'success'
          )
          checkLocalStorage()
        })
        .fail(err => {
          let message = err.responseJSON.message.map(el => el)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message
          })
        })
    }
  })
}


function showFormCreate() {
  $("#title-modal").text('Create Todo')
  $("#fieldset-form").attr('disabled', false)
  $("#user-id-todo").prop('disabled', true);
  $("#project-id-todo").prop('disabled', false);
  $("#btn-save").hide()
  $("#btn-create-todo").show()
  $("#user-id-div").hide()
  $("#project-id-div").show()
}

function createTodo() {
  const newTodo = {
    title: $("#title-todo").val(),
    due_date: $("#due_date-todo").val(),
    status: $("input:checked").val(),
    ProjectId: $("#project-id-todo").val()
  }
  $.ajax({
    url: baseUrl + '/todos',
    method: "POST",
    data: newTodo,
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .done(response => {
      checkLocalStorage()
    })
    .fail(err => {
      err.responseJSON.message.forEach(el => {
        $(".error-message").append(`<div class="alert alert-danger" role="alert">${el}</div>`)
      })
      setTimeout(() => { $(".error-message").empty() }, 3000)
    })
    .always(_ => {
      $("#form-todo").trigger('reset')
    })
}

function showFormCreateProject() {
  $("#btn-add-project").show()
  $("#btn-edit-project").hide()
  $("#modal-title-project").text('Create Project')
}

function createProject() {
  $.ajax({
    url: baseUrl + '/projects',
    method: "POST",
    data: {
      name: $("#project-name").val()
    },
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .done(response => {
      checkLocalStorage()
    }).fail(err => {
      err.responseJSON.message.forEach(el => {
        $(".error-message").append(`<div class="alert alert-danger" role="alert">${el}</div>`)
      })
      setTimeout(() => { $(".error-message").empty() }, 3000)
    })
    .always(_ => {
      $("#form-project").trigger('reset')
    })
}


function getFilterTodos() {
  $("#list-filter-todo").empty()
  let str = $("select option:selected").text();
  let url;
  if (str.toLowerCase() === 'completed' || str.toLowerCase() === 'uncompleted') {
    url = baseUrl + `/todos?status=${str}`
  } else if (str.toLowerCase() === 'today') {
    url = baseUrl + `/todos?due_date=today`
  } else if (str.toLowerCase() === 'all') {
    url = baseUrl + '/todos'
  }

  $.ajax({
    url: url,
    method: 'GET',
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .done(todos => {
      if (todos.length && str.toLowerCase() !== 'filter todo') {
        todos.forEach(el => {
          $("#list-filter-todo").addClass('shadow-lg border')
          if (el.status.toLowerCase() === 'uncompleted') {
            $("#list-filter-todo").append(`
          <div class="col-6  py-2 w-75 align-baseline">
          <p class="uncompleted-unstrike" ><button type="button" class="trans" onclick="updateStatusTodo(${el.id}, '${el.status}')"><i class="far fa-circle"></i></button>${el.title}</p>
          </div>
          <div class="w-25 col-6 text-end d-flex justify-content-end ps-2 ">
            <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" data-bs-toggle="tooltip" title="Detail" onclick="showFormDetail(${el.id})"> <i class="fas fa-info-circle"></i></button><br />
            <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" data-bs-toggle="tooltip" title="Edit" onclick="showFormUpdate(${el.id})"> <i class="fas fa-edit"></i></button><br />
            <button type="button" class="trans" data-bs-toggle="tooltip" title="Delete" onclick="destroyByIdTodo(${el.id})"> <i class="fas fa-trash"></i></button><br />
          </div>
          `)
          } else {
            $("#list-filter-todo").append(`
          <div class="col-6  py-2 w-75 align-baseline">
          <p class="completed-strike"><button type="button" class="trans"><i class="fas fa-check-circle" onclick="updateStatusTodo(${el.id}, '${el.status}')"></i></button>${el.title}</p> 
          </div>
          <div class="w-25 col-6 text-end d-flex justify-content-end ps-2 ">
            <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" data-bs-toggle="tooltip" title="Detail" onclick="showFormDetail(${el.id})"> <i class="fas fa-info-circle"></i></button><br />
            <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" data-bs-toggle="tooltip" title="Edit" onclick="showFormUpdate(${el.id})"> <i class="fas fa-edit"></i></button><br />
            <button type="button" class="trans"  data-bs-toggle="tooltip" title="Delete" onclick="destroyByIdTodo(${el.id})"> <i class="fas fa-trash"></i></button><br />
          </div>
          `)
          }
        })
      } else {
        $("#list-filter-todo").removeClass('shadow-lg border')
      }

    })
    .fail(err => {
      console.log(err.responseJSON)
    })

}

function findAllProjects() {
  $.ajax({
    url: baseUrl + '/projects',
    method: "GET",
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .done(projects => {

      $("#my-project").empty()
      if (projects.length) {
        projects.forEach(el => {
          $("#my-project").append(
            `
            <div class="col-4">
              <div class="card w-100 my-3" style="width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title">${el.Project.name}</h5>
                  <div class="d-flex justify-content-center w-100">
                    <button type="button" class=" btn btn-warning m-2" data-bs-toggle="tooltip" title="Detail Project" style="width: 30%" onclick="detailProject(${el.ProjectId})"> Detail </button>
                    <button type="button" class=" btn btn-warning m-2"  data-bs-toggle="modal" data-bs-target="#modal-project" data-bs-toggle="tooltip" title="Edit Project" style="width: 30%" onclick="showFormEditProject(${el.ProjectId}, '${el.Project.name}')"> Edit </button>
                    <button type="button" class=" btn btn-warning m-2" data-bs-toggle="tooltip" title="Delete Project"  style="width: 31%" onclick="destroyProject(${el.ProjectId})"> Delete </button>
                  </div>
                </div>
              </div>
            </div>
          `
          )
        })
      } else {
        $("#my-project").append(`<p class="text-center">You dont have any project yet</p>`)
      }
    })
    .fail(err => {
      console.log(err.responseJSON)
    })
}

function detailProject(idProject) {
  $("#detail-project").show()
  $.ajax({
    url: baseUrl + '/projects/' + idProject,
    method: "GET",
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .done(project => {
      let dataTodos = project.dataTodos;
      let dataProjects = project.dataProjects;;
      let projectName = dataProjects[0].Project.name;
      let ownerEmail = project.ownerProject.email;
      $("#detail-project").empty()
      $("#detail-project").append(
        `
        <div class="d-flex justify-content-center m-0 p-0">
        <div id="card-detail-project" class="card w-100 mx-5 p-4  mb-5 shadow">
         <h5 class="mt-0 pt-0">DETAIL PROJECT</h5>
         <div class="card-body text-start">
           <h5 class="card-title">${projectName}</h5>
           <h6 class="card-subtitle mb-2 text-muted">Id : ${idProject}</h6>
           <h6 class="card-subtitle mb-2 text-muted">Owner: ${ownerEmail}</h6>
          <div class="my-3">
           <h6 class="card-text text-center pb-2" >Todo List</h6>
           <table class="mb-3"  >
             <thead>
               <th>Title</th>
               <th>Deadline</th>
               <th>Status</th>
             </thead>
             <tbody id="detail-todo-project">
             </tbody>
           </table>
           <h6 class="card-text text-center pb-2" >Members</h6>
           <table >
             <thead>
               <th>Id</th>
               <th>Email</th>
               <th>Action</th>
             </thead>
             <tbody id="detail-members-project" >
             </tbody>
           </table>
          </div>
            <div class="d-flex justify-content-center">
             <button type="button" class=" btn btn-light w-25 m-3" data-bs-toggle="modal" data-bs-target="#add-user" onclick="showFormAddUser(${idProject})"> Add User </button>
             <button type="button" class=" btn btn-light w-25 m-3" onclick="closeDetailProject()"> Close </button>
           </div>
       </div>
        `
      )

      dataTodos.forEach(el => {
        let due_date = new Date(el.due_date)
        let date = due_date.getDate()
        let month = due_date.getMonth() + 1
        let year = due_date.getFullYear()
        if (month < 10) {
          month = `0${month}`
        }
        let deadline = `${year}-${month}-${date}`

        $("#detail-todo-project").append(
          `
          <tr>
            <td>${el.title}</td>
            <td>${deadline}</td>
            <td>${el.status}</td>
          </tr>
         `)
      })

      dataProjects.forEach(el => {
        $("#detail-members-project").append(
          `
           <tr>
             <td>${el.User.id}</td>
             <td>${el.User.email}</td>
             <td class="d-flex justify-content-end"> 
               <a href="#" data-bs-toggle="tooltip" title="Delete User" onclick="destroyUser(${idProject}, ${el.User.id})"><i class="fas fa-trash px-3"></i></a>
             </td> 
           </tr>
          `
        )
      })
    })

    .fail(err => {
      console.log(err.responseJSON)
    })
}


function showFormAddUser(id) {
  idProject = id
  $("#id-project").val(idProject)
}

function addUser(idProject) {
  $.ajax({
    url: baseUrl + '/projects/' + idProject + '/addUser',
    method: "PATCH",
    data: { email: $("#add-user-email").val() },
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .done(response => {
      Swal.fire(
        'Add User Success!',
        'You clicked the button!',
        'success'
      )
      detailProject(idProject)
    })
    .fail(err => {
      err.responseJSON.message.forEach(el => {
        $(".error-message").append(`<div class="alert alert-danger" role="alert">${el}</div>`)
      })
      setTimeout(() => { $(".error-message").empty() }, 3000)
    })
    .always(_ => {
      $("#add-user-email").val("");
    })
}


function destroyUser(idProject, idUser) {
  Swal.fire({
    title: 'Are you sure to delete this user?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes !!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: baseUrl + '/projects/' + idProject + '/deleteUser/' + idUser,
        method: "PATCH",
        headers: { access_token: localStorage.getItem('access_token') }
      })
        .done(response => {
          Swal.fire(
            'Deleted!',
            'User has been deleted.',
            'success'
          )
          detailProject(idProject)
        })
        .fail(err => {
          let message = err.responseJSON.message.map(el => el)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message
          })
        })
    }
  })
}


function showFormEditProject(id, name) {
  idProject = id
  $("#btn-add-project").hide()
  $("#btn-edit-project").show()
  $("#modal-title-project").text('Edit Project')
  $("#project-name").val(name)

}

function updateProject(idProject) {
  $.ajax({
    url: baseUrl + '/projects/' + idProject,
    method: "PATCH",
    data: { name: $("#project-name").val() },
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .done(response => {
      checkLocalStorage()
    })
    .fail(err => {
      err.responseJSON.message.forEach(el => {
        $(".error-message").append(`<div class="alert alert-danger" role="alert">${el}</div>`)
      })
      setTimeout(() => { $(".error-message").empty() }, 3000)
    })
}


function destroyProject(idProject) {
  Swal.fire({
    title: 'Are you sure to delete this project?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes !!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: baseUrl + '/projects/' + idProject,
        method: 'DELETE',
        headers: { access_token: localStorage.getItem('access_token') }
      })
        .done(response => {
          Swal.fire(
            'Delete Success!',
            'Your project has been delete',
            'success'
          )
          checkLocalStorage()
        })
        .fail(err => {
          let message = err.responseJSON.message.map(el => el)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message
          })
        })
    }
  })
}


function closeDetailProject() {
  $("#detail-project").hide()
}

