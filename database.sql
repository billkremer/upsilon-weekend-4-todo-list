CREATE TABLE todos (
	id SERIAL PRIMARY KEY,
	task TEXT,
	task_priority VARCHAR(6),
--	consider CHECK (task_priority = 'Low' OR task_priority = 'High'),
-- use this command? or restrict in <select> <option>
	task_created TIMESTAMP,
	task_due TIMESTAMP,
	task_completed TIMESTAMP
	);



INSERT INTO todos (task, task_priority, task_created, task_due)
VALUES 	('Vacuum the living room', 'Low', '2016-12-28', ''),
				('Wash the dishes', 'High', '2017-01-10', '2017-01-20'),
				('Walk the dog', '', '2017-01-14', '');
