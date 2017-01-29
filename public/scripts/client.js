var verbose = true; // lets messages be turned off for non-error console.logs


$(function () {
  if (verbose) console.log('ready!');

 getCurrentTasks();
 getCompletedTasks();

  $('#task-form').on('submit', addTask)

  $('#taskList').on('click','.updateButton', updateTask);


  $('#taskList').on('click','.completedButton', completeTask);

  $('#taskList').on('click', '.deleteButton', deleteTask);
  $('#completedTaskList').on('click', '.deleteButton', deleteTask);

  $('#completedTaskList').on('click', '.unCompleteButton', unCompleteTask)

});

function completeTask (event) {
  event.preventDefault();


  var $button = $(this); // this is the button that was clicked
  var $form = $button.closest('form');
  // get the info out of the form
  if (verbose) console.log($form,'form1');
  var data = $form.serialize();

  if (verbose) console.log($button.data('id'),'form2');
  // send data to server
  $.ajax({
    url: '/todos/complete/' + $button.data('id'),
    type: 'PUT',
    data: data,
    success: [getCurrentTasks,getCompletedTasks]
  });
};

function getCompletedTasks () {
  $.ajax({
    url: '/todos/complete',
    type: 'GET',
    success: displayCompletedTasks
  });
};

function displayCompletedTasks (todos) {
  if (verbose) console.log('got the tasks', todos);

$('#completedTaskList').empty();


  todos.forEach(function(task){

    var $newTaskDiv = $('<div class="row compTaskList"></div>');
    var $newTaskRow = $('<form></form>');

    $newTaskRow.append('<input class="task col-xs-7" type="text" name="title" value="' + task.task + '" disabled/>');

    var taskCompletedDate = new Date(task.task_completed).toISOString().slice(0,10);

    $newTaskRow.append('<input class="dueDate col-xs-2" type="date" name="task_due" value="' + taskCompletedDate + '" disabled/>');

    if (task.task_priority !== 'High') {
      task.task_priority = 'Low'; // sets all non-Highs to low incase something modifies the database somehow.  doesn't change the database here though...
    };

    $newTaskRow.append('<input class="priority col-xs-1" type="text" name="task_priority" value="' + task.task_priority + '" disabled/>');

    var $unCompleteButton = $('<button class="col-xs-1 btn btn-warning unCompleteButton" aria-label="task completed">UnComplete</button>');
    var $deleteButton = $('<button class="col-xs-1 deleteButton btn btn-danger">Delete</button>');


    $unCompleteButton.data('id',task.id);
    $deleteButton.data('id', task.id);


    $newTaskRow.append($unCompleteButton);
    $newTaskRow.append($deleteButton);

    $newTaskDiv.append($newTaskRow);

    $('#completedTaskList').append($newTaskDiv);

  }); // closes forEach




}

function unCompleteTask (event) {
  event.preventDefault();


  var $button = $(this); // this is the button that was clicked
  var $form = $button.closest('form');
  // get the info out of the form
  if (verbose) console.log($form,'form1');
  var data = $form.serialize();

  if (verbose) console.log($button.data('id'),'form2');
  // send data to server
  $.ajax({
    url: '/todos/uncomplete/' + $button.data('id'),
    type: 'PUT',
    data: data,
    success: [getCurrentTasks,getCompletedTasks]
  });


}

function updateTask (event) {
  event.preventDefault();


  var $button = $(this); // this is the button that was clicked
  var $form = $button.closest('form');
  // get the info out of the form
  if (verbose) console.log($form,'form1');
  var data = $form.serialize();

  if (verbose) console.log($button.data('id'),'form2');
  // send data to server
  $.ajax({
    url: '/todos/update/' + $button.data('id'),
    type: 'PUT',
    data: data,
    success: [getCurrentTasks,getCompletedTasks]
  });
}

function addTask (event) {
  // prevent browser from refreshing
  event.preventDefault();

  console.log($(this),'this');

  // get the info out of the form
  var formData = $(this).serialize();
  if (verbose) console.log(formData);

  $.ajax({
    url: '/todos',
    type: 'POST',
    data: formData,
    success: getCurrentTasks
  });
};

function getCurrentTasks () {
  $.ajax({
    url: '/todos/current',
    type: 'GET',
    success: displayCurrentTodos
  });
};

function displayCurrentTodos (todos) {
  if (verbose) console.log('got the tasks', todos);

$('#taskList').empty();


  todos.forEach(function(task){

    var $newTaskDiv = $('<div class="row"></div>');
    var $newTaskRow = $('<form></form>');

    $newTaskRow.append('<input class="task col-xs-6" type="text" name="title" value="' + task.task + '"/>');

    var taskDueDate = new Date(task.task_due).toISOString().slice(0,10);

    $newTaskRow.append('<input class="dueDate col-xs-2" type="date" name="task_due" value="' + taskDueDate + '"/>');


    if (task.task_priority !== 'High') {
      task.task_priority = 'Low'; // sets all non-Highs to low incase something modifies the database somehow.  doesn't change the database here though...
    };

    if (task.task_priority == 'Low') {
      $newTaskRow.append('<select class="priority col-xs-1" type="text" name="task_priority" value="' + task.task_priority + '"><option value="Low" selected>Low</option><option value="High">High</option></select>');
    } else {
      $newTaskRow.append('<select class="col-xs-1 priority" type="text" name="task_priority" value="' + task.task_priority + '"><option value="Low">Low</option><option value="High" selected>High</option></select>');
    };

    var $updateButton = $('<button class="col-xs-1 updateButton btn btn-info">Update</button>');
    var $completeButton = $('<button class="col-xs-1 completedButton  btn btn-success " aria-label="task completed">Complete</button>');
    var $deleteButton = $('<button class="col-xs-1 deleteButton btn btn-danger">Delete</button>');

    $updateButton.data('id',task.id);
    $completeButton.data('id',task.id);
    $deleteButton.data('id', task.id);

    $newTaskRow.append($updateButton);
    $newTaskRow.append($completeButton);
    $newTaskRow.append($deleteButton);

    $newTaskDiv.append($newTaskRow);

    $('#taskList').append($newTaskDiv);

  }); // closes forEach
}; // closes function


function deleteTask(event){ // works for both current and completed
  event.preventDefault();

//  $('#taskList').find('.toDelete').removeClass('toDelete'); // shouldnt be necessary.

  var $button = $(this);
  if (verbose) console.log($(this), 'deleteButotn');

  var $form = $button.closest('form');
  // get the info out of the form
  if (verbose) console.log($form,'form1');
  if (verbose) console.log($($form).children('.task').val());

  var taskName = $($form).children('.task').val(); // need to attach taskName to a value field on the delete button.

  if (taskName.length > 40) {
    taskName = taskName.substring(0,40) + '...';
  };

  $form.children().addClass('toDelete');

  setTimeout(confirmDelete, 50); // this gives the .addClass time to work.

  function confirmDelete () { // inside deleteTask() to keep local variables
    if (confirm("Are you sure you want to delete this task:\n -> " + taskName +
    " ?\nClick Cancel to keep, OK to Delete.")) {
      $.ajax({
        url: '/todos/' + $button.data('id'),
        type: 'DELETE',
        success: [getCurrentTasks,getCompletedTasks]
      });
    } else {
      $('#taskList').find('.toDelete').removeClass('toDelete');
      $('#completedTaskList').find('.toDelete').removeClass('toDelete');
    };
  }; // closes confirmDelete

}; // closes deleteTask
