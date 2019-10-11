$(document).ready(function() {
       $("#createCardForm").submit(function(event){
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
                              content_front: $('#cardFrontText').val(),
                              content_back: $('#cardBackText').val()
                            },
                     success: function(result){
                         console.log(result);
                         window.location = "/edit_stack/" + result;
                     }
                });
            }
            return false;
       });
});


function validateForm() {
  if($('#front').val() === '' || $('#back').val() === '') {
    alert("Missing required fields")
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

function returnToStack(stack_id) {
  window.location ="/edit_stack/" + stack_id;
}
