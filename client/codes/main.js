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
  })
});

function checkLocalStorage() {
  if (!localStorage.access_token) {
    $("#home-page").hide()
    $("#login-register-page").show()

  } else {
    $("#home-page").show()
    $("#login-register-page").hide()
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
      localStorage.setItem('access_token', response.access_token)
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
      err.responseJSON.message.forEach(el => {
        $("#error-message").append(`
    <div class="alert alert-danger" role="alert">
    ${el}
  </div>
    `)
      })
      setTimeout(() => { $("#error-message").empty() }, 500)
    })
    .always(el => {
      $("#email").val("")
      $("#password").val("")
    })
}


