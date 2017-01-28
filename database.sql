CREATE TABLE todos (
	id SERIAL PRIMARY KEY,
	task TEXT,
	task_created TIMESTAMP,
	task_completed TIMESTAMP
	);


INSERT INTO todos (task, task_created)
VALUES 	('Vacuum the living room', '2016-12-28'),
				('Wash the dishes', '2017-01-10'),
				('Walk the dog', '2017-01-14');
