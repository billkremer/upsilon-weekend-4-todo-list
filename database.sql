CREATE TABLE todos (
	id SERIAL PRIMARY KEY,
	task TEXT,
	task_priority VARCHAR(6),
--	CHECK (task_priority = 'low' OR task_priority = 'high'),
-- use this command? or restrict in <select> <option>
	task_created TIMESTAMP,
	task_completed TIMESTAMP
	);


INSERT INTO todos (task, task_created)
VALUES 	('Vacuum the living room', '2016-12-28'),
				('Wash the dishes', '2017-01-10'),
				('Walk the dog', '2017-01-14');
