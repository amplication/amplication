export function registrationHtmlBody(registrationUrl: string) {
  return `
<!doctype html>
<html lang="en">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

<style>
  html,
  body {
  height: 100%;
  font-family: Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }

  body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #15192c;
  }

  .form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
  }
  .form-signin .checkbox {
  font-weight: 400;
  }
  .form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
  margin-top:5px;
  }
  .form-signin .form-control:focus {
  z-index: 2;
  }
  .form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  }
  .form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  }
  .bd-placeholder-img {
    font-size: 1.125rem;
    text-anchor: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  @media (min-width: 768px) {
    .bd-placeholder-img-lg {
      font-size: 3.5rem;
    }
  }
  </style>

  <title>Registration page</title>


</head>

<body class="text-center">
  <div class="container">
    <div id="alert"></div>

    <form class="form-signin text-light" method="POST" enctype="multipart/form-data">
      <img class="mb-4" src="https://amplication.com/_next/static/media/logo_desktop.83f8e039.svg" alt="">
      <h1 class="h3 mb-3 font-weight-normal">Please enter your contact details</h1>

      <label for="contactEmail" class="sr-only">Email address</label>
      <input type="email" name="contactEmail" class="form-control" placeholder="Email address" required autofocus>

      <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
      <p class="mt-5 mb-3 text-muted">&copy; Amplication 2024</p>
    </form>
  </div>

  <!-- Optional JavaScript -->
  <!-- jQuery first, then Popper.js, then Bootstrap JS -->
  <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
    integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
    crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
    integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
    crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
    integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
    crossorigin="anonymous"></script>

  <script>
    const baseUrl = '${registrationUrl}';
    ${registrationScriptBody}
  </script>

</body>

</html>
`;
}

const registrationScriptBody =
  "\
const form = document.getElementsByClassName('form-signin')[0];\n\
const showAlert = (cssClass, message) => {\n\
    const html = `\n\
    <div class=\"alert alert-${cssClass} alert-dismissible\" role=\"alert\">\n\
        <strong>${message}</strong>\n\
        <button class=\"close\" type=\"button\" data-dismiss=\"alert\" aria-label=\"Close\">\n\
            <span aria-hidden=\"true\">×</span>\n\
        </button>\n\
    </div>`;\n\
\n\
    document.querySelector('#alert').innerHTML += html;\n\
};\n\
\n\
const formToJSON = (elements) => [].reduce.call(elements, (data, element) => {\n\
    data[element.name] = element.value;\n\
    return data;\n\
}, {});\n\
\n\
const handleFormSubmit = (event) => {\n\
    event.preventDefault();\n\
    const data = formToJSON(form.elements);\n\
\n\
    const xhr = new XMLHttpRequest();\n\
    xhr.open('POST', baseUrl, true);\n\
    xhr.setRequestHeader('Content-Type', 'application/json');\n\
    xhr.send(JSON.stringify(data));\n\
    xhr.onreadystatechange = () => {\n\
        if (xhr.readyState == XMLHttpRequest.DONE) {\n\
        showAlert('primary', xhr.responseText);\n\
        }\n\
    };\n\
};\n\
\n\
form.addEventListener('submit', handleFormSubmit);";
