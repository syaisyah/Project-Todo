const baseUrl = `http://localhost:3001`


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

  $("#list-todo-today").on("click", (e) => {
    e.preventDefault()

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
    .then(todos => {
      $("#list-todo-today").empty();
      if (todos.length) {
        todos.forEach((el, i) => {
          if (el.status.toLowerCase() === 'uncompleted') {
            $("#list-todo-today").append(`
          <div class="col-6 border border-danger py-2 w-75 align-baseline">
          <p><button type="button" class="trans" id="btn-completed" onclick="updateStatusToCompleted(${el.id})"><i class="far fa-circle"></i> </button>${el.title}</p> 
          </div>
          <div class="w-25 col-6 text-end border border-success d-flex justify-content-end ps-2 ">
          <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" onclick="detailTodo(${el.id})"> <i class="fas fa-info-circle"></i></button><br />
          <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" onclick="updateTodo(${el.id})"> <i class="fas fa-edit"></i></button><br />
          <button type="button" class="trans" onclick="destroyByIdTodo(${el.id})"> <i class="fas fa-trash"></i></button><br />
          </div>
          `)
          } else {
            $("#list-todo-today").append(`
          <div class="col-6 border border-danger py-2 w-75 align-baseline">
          <p><button type="button" class="trans completed" id="btn-uncompleted" onclick="updateStatusToUncompleted(${el.id})"><i class="fas fa-check-circle"></i> </button>${el.title}</p> 
          </div>
          <div class="w-25 col-6 text-end border border-success d-flex justify-content-end ps-2 ">
          <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" onclick="detailTodo(${el.id})"> <i class="fas fa-info-circle"></i></button><br />
          <button type="button" class="trans" data-bs-toggle="modal" data-bs-target="#modal-todo" onclick="updateTodo(${el.id})"> <i class="fas fa-edit"></i></button><br />
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

function detailTodo(id) {
  getByIdTodo(id);
  $("#title-modal").text('Detail Todo')
  $("#fieldset-form").attr('disabled', true)
  $("#btn-save").hide()
}


function updateTodo(id) {
  getByIdTodo(id);
  $("#title-modal").text('Update Todo')
  $("#fieldset-form").attr('disabled', false)
  $("#user-id-todo").prop('disabled', true);
  $("#project-id-todo").prop('disabled', true);
  $("#btn-save").show()
  // $(".modal-footer").empty()
  // $(".modal-footer").append(
  //   `
  //     <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
  //     <button id="btn-save" type="button" class="btn btn-light">Save</button>
  // `)

  $("#btn-save").on("click", (e) => {
    e.preventDefault();
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
      .then(response => {
        findAllTodo()
      })
      .fail(err => {
        err.responseJSON.message.forEach(el => {
          $(".error-message").append(`<div class="alert alert-danger" role="alert">${el}</div>`)
        })
        setTimeout(() => { $(".error-message").empty() }, 3000)
      })
  })

}

function destroyByIdTodo(id) {
  $.ajax({
    url: baseUrl + '/todos/' + id,
    method: "DELETE",
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .then(response => {
      Swal.fire(
        'Delete Success!',
        'You clicked the button!',
        'success'
      )
    })
  findAllTodo()
    .fail(err => {
      let message = err.responseJSON.message.map(el => el)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message
      })
    })
}


//https://www.geeksforgeeks.org/jquery-ui-switchclass-method/