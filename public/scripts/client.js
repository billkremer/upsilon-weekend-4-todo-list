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

      var $saveButton = $('<button class="save">Save</button>');
      var $deleteButton = $('<button class="delete">Delete</button>');
      $saveButton.data('id',task.id);
      $deleteButton.data('id', task.id)
      $form.append($saveButton);
      $form.append($deleteButton);

      $li.append($form);
      $('#task-list').append($li);
  });
};
