$(function () {
  console.log('ready!');

  getTasks();

  // $('#book-submit').on('click', postBooks);

//$('#task-form').on('submit', addTask)





});



function getTasks () {
  $.ajax({
    url: '/todos',
    type: 'GET',
    success: displayCurrentTodos
  });
};

function displayCurrentTodos (todos) {
  console.log('got the tasks', todos);

  $('#task-list').empty();
  todos.forEach(function(task){
      var $li = $('<li></li>');

      var $form = $('<form></form>');

      $form.append('<input type = "text" name="title" value="' + task.task + '"/>');
      // $form.append('<input type = "text" name="author" value="' + task.priority + '"/>');

      var date = new Date(task.task_created).toISOString().slice(0,10);
      // yyyy-mm-ddTxxxxxxx

      $form.append('<input type = "date" name="task_created" value="' + date + '"/>');


      var $completeButton = $('<button class="completed">Completed Task!</button>')
      var $saveButton = $('<button class="save">Update</button>');
      var $deleteButton = $('<button class="delete">Delete</button>');

      // $row.append('<td><button class="update btn btn-default" data-id="' + pet.pets_id + '"> GO! </button></td>');
      //   $row.append('<td><button class="delete btn btn-danger" data-id="' + pet.pets_id + '" value ="' + pet.name + '"> Delete! </button></td>');

      $completeButton.data('id',task.id);
      $saveButton.data('id',task.id);
      $deleteButton.data('id', task.id)
      $form.append($saveButton);
      $form.append($deleteButton);

      $li.append($form);
      $('#task-list').append($li);
  });
};

function deleteTask(event){
  event.preventDefault();

  var $button = $(this);
    console.log($(this));
  var taskName = $(this).val(); // need to attach taskName to a value field on the delete button.
    if (confirm("Are you sure you want to delete this task: " + taskName + "?")) {
      $.ajax({
        url: '/tasks/' + $button.data('id'),
        type: 'DELETE',
        success: getTasks
      });
    };
}
