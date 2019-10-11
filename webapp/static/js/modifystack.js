$(document).ready(function() {
      var stackJson;
       $.getJSON("/stack", function(result) {
          for(var i = 0; i < result.length; i++) {
             titles = document.getElementById('stackDropDown');
             var title= document.createElement('button');
             title.textContent = result[i]['fields']['title'];
             id = result[i]['pk'];
             title.setAttribute('id', '' + id)
             title.onClick =  function() {
                displayCardsOfStack(id);
             };
             titles.appendChild(title);

          }
          stackJson = result;
          console.log(stackJson);
       });

       $("#editStackForm").submit(function(event){
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
                              title: $('#newStackName').val(),
                              description: $('#newStackDescription').val(),
                              is_public:    $('input[name=isPublic]:checked').val()
                            },
                     success: function(){
                         // $('#message').html("<h2>User Submitted!</h2>")
                         console.log("success!")
                     }
                });
            }
            return false;
       });
       $("#addCard").click(function(){
         window.location ="/create_card"
       });
});

// function displayCardsOfStack(id) {
//     var cardDisplay = document.getElementById("cardRow");
//     cardDisplay.innerHTML = " ";
//     $.getJSON("/stack/ " + id, function(cards) {
//         for(var i = 0; i < cards.length; i++) {
//               var cardTemplate = document.createElement('div');
//               cardTemplate.setAttribute('class', 'col-sm-6 cardItem template');
//               // var cardThumbnail = document.createElement('img');
//               // is text now, will be img later?
//               var cardThumbnail = document.createElement('h3');
//               cardThumbnail.textContent = cards['fields']['content_front'];
//               var id = cards['pk'];
//               link.appendChild(cardThumbnail);
//               // empty link for now
//               link.setAttribute('href', ("/card/" + pk));
//               cardTemplate.appendChild(link);
//               cardDisplay.appendChild(cardTemplate);
//             }
//     });
//     cardDisplay.appendChild(listOfCards);
// }

// function handleSearch() {
//   search = document.getElementById('findStack').value;
//   if(search = '') {
//     return false;
//   }
//
//   // bruke regex her for bedre søk
//   for(var i = 0; i < stackJson.length; i++) {
//      if(search = stackJson[i]['fields']['title']) {
//        displayCardsOfStack(stackJson[i]['pk']);
//      }
//   }
// }


function validateForm() {
  if($('#title').val() === '') {
    alert("Missing required field/s")
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

 // 
 // <div class="dropdown">
 //      <button class="dropbtn" id="dropDownButton">Dropdown</button>
 //       <div class="dropdown-content" id="stackDropDown">
 //           <!-- <a href="#">Link 1</a>
 //           <a href="#">Link 2</a>
 //           <a href="#">Link 3</a> -->
 //      </div>
 // </div>
 //
 //
 // <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
 // <script src="{% static 'js/modifystack.js' %}"></script>
