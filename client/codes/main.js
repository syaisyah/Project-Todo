
const baseUrl = `http://localhost:3001`
let idTodo;

$(document).ready(function () {
  checkLocalStorage()
  $("#btn-login").on("click", (e) => {
    e.preventDefault()
    login()
  })
  $("#btn-register").on("click", (e) => {
    e.preventDefault()
    register()
    findAllTodo()
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
    $("#form-add-project").trigger('reset')
  })

  $("#btn-close-end").on('click', (e) => {
    e.preventDefault()
    $("#form-todo").trigger('reset')
    $("#completed").attr('checked', false)
    $("#uncompleted").attr('checked', false)
  })

  $("#btn-close-project").on('click', (e) => {
    e.preventDefault();
    $("#form-add-project").trigger('reset')

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

});

function checkLocalStorage() {
  if (!localStorage.access_token) {
    $("#home-page").hide()
    $("#login-register-page").show()

  } else {
    $("#email-user").text(localStorage.email)
    $("#home-page").show()
    $("#login-register-page").hide()
    findAllTodo()
    getFilterTodos()

  }
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
        'You clicked the button!',
        'success'
      )
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('email', response.email)
      $("#email-user").text(response.email)
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
    .always(_ => {
      $("#email").val("")
      $("#password").val("")
    })
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


function logout() {
  localStorage.clear()
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });

  checkLocalStorage()
}

function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token;
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

function findAllTodo() {
  $.ajax({
    url: baseUrl + `/todos?due_date=today`,
    method: "GET",
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
    .done(todos => {
      $("#list-todo-today").empty();
      if (todos.length) {
        todos.forEach((el, i) => {
          if (el.status.toLowerCase() === 'uncompleted') {
            $("#list-todo-today").append(`
            <div class="col-6  py-2 w-75 align-baseline">
              <p><button type="button" class="trans"><i class="far fa-circle"></i></button>${el.title}</p>
              
            </div>
            <div class="w-25 col-6 text-end d-flex justify-content-end ps-2 ">
              <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" onclick="showFormDetail(${el.id})"> <i class="fas fa-info-circle"></i></button><br />
              <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" onclick="showFormUpdate(${el.id})"> <i class="fas fa-edit"></i></button><br />
              <button type="button" class="trans" onclick="destroyByIdTodo(${el.id})"> <i class="fas fa-trash"></i></button><br />
            </div>
            `)
          } else {
            $("#list-todo-today").append(`
            <div class="col-6  py-2 w-75 align-baseline">
              <p class="completed"><button type="button" class="trans"><i class="fas fa-check-circle"></i> </button>${el.title}</p> 
            </div>
            <div class="w-25 col-6 text-end d-flex justify-content-end ps-2 ">
              <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" onclick="showFormDetail(${el.id})"> <i class="fas fa-info-circle"></i></button><br />
              <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" onclick="showFormUpdate(${el.id})"> <i class="fas fa-edit"></i></button><br />
              <button type="button" class="trans" onclick="destroyByIdTodo(${el.id})"> <i class="fas fa-trash"></i></button><br />
            </div>
            `)
          }
        });
      }
    })
    .catch(err => {
      console.log(err.responseJSON)
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
      console.log(response, 'response updateTodo >>>>>>>')
      findAllTodo()
      getFilterTodos()
    })
    .fail(err => {
      err.responseJSON.message.forEach(el => {
        $(".error-message").append(`<div class="alert alert-danger" role="alert">${el}</div>`)
      })
      setTimeout(() => { $(".error-message").empty() }, 3000)
    })

}



function destroyByIdTodo(id) {
  $.ajax({
    url: baseUrl + '/todos/' + id,
    method: "DELETE",
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .done(response => {
      findAllTodo()
      getFilterTodos()
      Swal.fire(
        'Delete Success!',
        'You clicked the button!',
        'success'
      )
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
      findAllTodo()
      getFilterTodos()
    })
    .fail(err => {
      err.responseJSON.message.forEach(el => {
        $(".error-message").append(`<div class="alert alert-danger" role="alert">${el}</div>`)
      })
      setTimeout(() => { $(".error-message").empty() }, 3000)
    })
}

function createProject() {
  console.log('masuk cretaeProject')
  $.ajax({
    url: baseUrl + '/projects',
    method: "POST",
    data: {
      name: $("#project-name").val()
    },
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .done(response => {
      console.log(response)
      findAllTodo()
      getFilterTodos()
    }).fail(err => {
      err.responseJSON.message.forEach(el => {
        $(".error-message").append(`<div class="alert alert-danger" role="alert">${el}</div>`)
      })
      setTimeout(() => { $(".error-message").empty() }, 3000)
    })
}

function fetchProjects() {
  // $("#div-projects").show()
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
      console.log(todos, '>>>>>>>>>>>>')
      if (todos.length && str.toLowerCase() !== 'filter todo') {
        todos.forEach(el => {
          if (el.status.toLowerCase() === 'uncompleted') {
            $("#list-filter-todo").append(`
          <div class="col-6  py-2 w-75 align-baseline">
            <p><button type="button" class="trans"><i class="far fa-circle"></i></button>${el.title}</p>
          </div>
          <div class="w-25 col-6 text-end d-flex justify-content-end ps-2 ">
            <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" onclick="showFormDetail(${el.id})"> <i class="fas fa-info-circle"></i></button><br />
            <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" onclick="showFormUpdate(${el.id})"> <i class="fas fa-edit"></i></button><br />
            <button type="button" class="trans" onclick="destroyByIdTodo(${el.id})"> <i class="fas fa-trash"></i></button><br />
          </div>
          `)
          } else {
            $("#list-filter-todo").append(`
          <div class="col-6  py-2 w-75 align-baseline">
            <p class="completed"><button type="button" class="trans"><i class="fas fa-check-circle"></i> </button>${el.title}</p> 
          </div>
          <div class="w-25 col-6 text-end d-flex justify-content-end ps-2 ">
            <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" onclick="showFormDetail(${el.id})"> <i class="fas fa-info-circle"></i></button><br />
            <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" onclick="showFormUpdate(${el.id})"> <i class="fas fa-edit"></i></button><br />
            <button type="button" class="trans" onclick="destroyByIdTodo(${el.id})"> <i class="fas fa-trash"></i></button><br />
          </div>
          `)
          }
        })
      } 

    })
    .fail(err => {
      console.log(err.responseJSON)
    })
  
}


//https://www.geeksforgeeks.org/jquery-ui-switchclass-method/