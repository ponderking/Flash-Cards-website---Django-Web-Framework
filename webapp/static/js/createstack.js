$(document).ready(function() {
       console.log("title" + $('#title').val());
       console.log($('input[name=isPublic]:checked').val());
       // console.log("hey");
       $("#stackForm").submit(function(event){
         saveData()
         return false;
       });
       $("#addCard").click(function(){
            saveDataAddCard();
       });
       $("#cancelButton").click(function(){
         window.location ="/"
       });
});

function saveData() {
  if(validateForm()) {
       $(function () {
            $.ajaxSetup({
                headers: { "X-CSRFToken": getCookie("csrftoken") }
            });
       });
       $.ajax({
            type:"POST",
            url: "",
            data: {
                     title: $('#title').val(),
                     description: $('#description').val(),
                     is_public: $('input[name=isPublic]:checked').val()
                   },
            success: function(result){
                console.log(result);
                window.location = "/edit_stack/" + result;
            }
       });
       return true;
   }
   return false;
}

function saveDataAddCard() {
       $(function () {
            $.ajaxSetup({
                headers: { "X-CSRFToken": getCookie("csrftoken") }
            });
       });
       $.ajax({
            type:"POST",
            url: "",
            data: {
                     title: $('#title').val(),
                     description: $('#description').val(),
                     is_public:    $('input[name=isPublic]:checked').val(),
                   },
            success: function(result){
                console.log("popp");

                console.log(result);
                window.location = "/create_card/" + result;
            }
       });
}

function validateForm() {
  if($('#title').val() === '') {
    alert("Please enter a title for the stack")
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


 function removeCard(id) {
   $.ajax({
        type:"GET",
        url:"/remove_card/" + id,
        success: function(result){
            console.log(result);
            location.reload();
        }
   });
 }
