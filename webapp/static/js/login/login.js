$(document).ready(function() {
    $("#loginForm").submit(function(event){
        if(validateForm()) {
            $(function () {
                   $.ajaxSetup({
                       headers: { "X-CSRFToken": getCookie("csrftoken") }
                   });
            });
            $.ajax({
                 type:"POST",
                 url:"/login/",
                 data: {
                          username: $('#username').val(),
                          password: $('#password').val(),
                        },
                 success: function(){
                 }
            });
          }
            return false;
       });
});


function validateForm() {
  // missing fields
  if($('#username').val() === '' || $('#password').val() === '') {
    alert("Missing required fields!");
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
