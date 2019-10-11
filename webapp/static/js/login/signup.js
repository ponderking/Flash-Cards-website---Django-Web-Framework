$(document).ready(function() {
  // When the user presses the submit button, we send a post request to our
  // back-end with the data that the user filled in in the registration fields.
       $("#registrationForm").submit(function(event){
           if(validateForm()) {
                $(function () {
                     $.ajaxSetup({
                         headers: { "X-CSRFToken": getCookie("csrftoken") }
                     });
                });
                $.ajax({
                     type:"POST",
                     url:"",
                     data: {
                              username: $('#username').val(),
                              password: $('#password').val(),
                              email:    $('#email').val(),
                            },
                     success: function(){
                         // $('#message').html("<h2>User Submitted!</h2>")
                         // console.log("success!")
                         // window.location = "/login";
                     }
                });
            }
            return false;
       });
       // redirecting to sign in page when signIgn button is pressed
       $("#signInButton").click(function() {
         $(function () {
              $.ajaxSetup({
                  headers: { "X-CSRFToken": getCookie("csrftoken") }
              });
         });
         $.ajax({
              type:"POST",
              url:"",
              success: function(){
                  // $('#message').html("<h2>User Submitted!</h2>")
                  // console.log("success!")
              }
         });
       });
});

function validateForm() {
  if($('#username').val() === '' || $('#password').val() === '' || $('#email').val() === '') {
    alert("Missing required fields");
    return false;
  }
  console.log($('#password').val());
  console.log($('#passwordRepeated').val());
  if($('#password').val() !== $('#passwordRepeated').val()) {
     alert('passwords do not match!');
     return false;
  }
  return true;
}


function getCookie(c_name)
{
    if (document.cookie.length > 0)
    {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1)
        {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
 }
