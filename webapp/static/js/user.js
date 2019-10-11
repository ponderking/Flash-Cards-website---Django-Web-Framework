$(document).ready(function() {
    var stackJSON = null;
    setRecentStacks();

    $('#searchStacks').on('keypress', (event)=> {
        if(event.which === 13){
            handleSearch();
        }
     });
})

function setRecentStacks() {
  // right now selects the most recently added stack, check for modified date later?
  var recentStacks = document.getElementById('recentStacks');
  var recentModal = document.getElementById('recentModal');

  $.getJSON("/stack", function(result) {
    // console.log(result);
    if(Object.keys(result).length === 0) {
     console.log("No stacks to display on 'Recent Stacks' section");
     handleEmpty();
     stackJSON = result;
     return false;
   }
    var newTemplate = document.getElementById('stackTemplate').cloneNode(true);
    // console.log(newTemplate.childNodes[5].childNodes[3]);
    // add image
    newTemplate.childNodes[1].firstElementChild.setAttribute('src', '/static/img/flashCardStack.png');
    newTemplate.childNodes[1].firstElementChild.setAttribute('alt', 'Thumbnail image');
    // add title and link to stack
    newTemplate.childNodes[3].firstElementChild.setAttribute('href', '/show_stack/' + result[result.length-1]['pk']);
    newTemplate.childNodes[3].firstElementChild.setAttribute('id', 'link' + result[result.length-1]['pk']);
    newTemplate.childNodes[3].firstElementChild.textContent = result[result.length-1]['fields']['title'];

    // add share link
    newTemplate.childNodes[5].childNodes[1].setAttribute('href', '#');
    // add comment link
    newTemplate.childNodes[5].childNodes[3].setAttribute('href', '#');
    // add rating link
    newTemplate.childNodes[5].childNodes[5].setAttribute('href', '#');
    // add edit link
    newTemplate.childNodes[5].childNodes[7].setAttribute('href', '/edit_stack/'+ result[result.length-1]['pk']);

    // add delete link
    newTemplate.childNodes[5].childNodes[9].setAttribute('data-toggle', 'modal');
    newTemplate.childNodes[5].childNodes[9].setAttribute('data-target', '#recentDeleteConfirmation' + result[result.length-1]['pk']);

    var newModal = document.getElementById('deleteConfirmation').cloneNode(true);
    newModal.setAttribute('id', "recentDeleteConfirmation" + result[result.length-1]['pk']);
    newModal.childNodes[1].childNodes[1].childNodes[5].childNodes[1].childNodes[1].setAttribute('onclick', 'deleteStack(' + result[result.length-1]['pk']+ ');');

    // put html elements together

    recentStacks.appendChild(newTemplate);
    recentModal.appendChild(newModal);
    stackJSON = result;
  });
}

function handleSearch() {
  // right now only checks if search is contained within title or description.
  search = document.getElementById('searchStacks').value;
  var re = new RegExp(search, "i");
  console.log('search was: ' + search);
  if(stackJSON === undefined || stackJSON === null) {
    console.log('search failure');
    return false;
  }
  var resultList = document.getElementById('stackListSearch');
  if(document.getElementById('searchHeadLine') === null) {
    var headline = document.createElement("h3");
    headline.setAttribute('id', 'searchHeadLine');
    headline.textContent = "Search Results:";
    resultList.parentNode.insertBefore(headline, resultList);
  }
  resultList.innerHTML = "";
  var matchNumber = 0;
  console.log(re);

  for (var i = 0; i < stackJSON.length; i++) {
    console.log(stackJSON[i]['fields']['title']);
        if((re.test(stackJSON[i]['fields']['title'])) || (re.test(stackJSON[i]['fields']['description']))) {

          console.log("Match at index: " + i);

          var newTemplate = document.getElementById('stackTemplate').cloneNode(true);
          // add image
          newTemplate.childNodes[1].firstElementChild.setAttribute('src', '/static/img/flashCardStack.png');
          newTemplate.childNodes[1].firstElementChild.setAttribute('alt', 'Thumbnail image');
          // add title and link to stack
          newTemplate.childNodes[3].firstElementChild.setAttribute('href', '/show_stack/' + stackJSON[i]['pk']);
          newTemplate.childNodes[3].firstElementChild.setAttribute('id', 'link' + stackJSON[i]['pk']);
          newTemplate.childNodes[3].firstElementChild.textContent = stackJSON[i]['fields']['title'];
          // add share link
          newTemplate.childNodes[5].childNodes[1].setAttribute('href', '#');
          // add comment link
          newTemplate.childNodes[5].childNodes[3].setAttribute('href', '#');
          // add rating link
          newTemplate.childNodes[5].childNodes[5].setAttribute('href', '#');
          // add edit link
          newTemplate.childNodes[5].childNodes[7].setAttribute('href', '/edit_stack/'+stackJSON[i]['pk']);
          // add delete link
          newTemplate.childNodes[5].childNodes[9].setAttribute('data-toggle', 'modal');
          newTemplate.childNodes[5].childNodes[9].setAttribute('data-target', '#searchDeleteConfirmation' + stackJSON[i]['pk']);

          var newModal = document.getElementById('deleteConfirmation').cloneNode(true);
          newModal.setAttribute('id', "searchDeleteConfirmation" + stackJSON[i]['pk']);
          newModal.childNodes[1].childNodes[1].childNodes[5].childNodes[1].childNodes[1].setAttribute('onclick', 'deleteStack(' + stackJSON[i]['pk'] + ');');

          if(resultList.nextSibling !== null) {
            resultList.parentNode.insertBefore(newModal, resultList.nextSibling);
          }
          else {
            resultList.parentNode.appendChild(newModal);
          }

          resultList.appendChild(newTemplate);

          matchNumber++;
        }
        else {
          console.log("Not a match at index: " + i);
        }
  }
}

function handleEmpty() {

  var newTemplate = document.createElement('stackTemplate').cloneNode(true);
  var title = document.createElement('div');
  title.setAttribute('class', 'col-xs-4');
  var message = document.createElement('h3');
  message.textContent = "No stacks to showcase!";
  title.appendChild(message);
  newTemplate.appendChild(title);

  recentStacks.appendChild(newTemplate);
}

function deleteStack(id) {
  $.ajax({
       type:"GET",
       url:"/remove_stack/" + id,
       success: function(result){
           console.log(result);
           location.reload();
       }
  });
}
