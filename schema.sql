CREATE DATABASE employeeTracker_DB;

USE employeeTracker_DB;

CREATE TABLE department (
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  dept_name VARCHAR(30)
);

CREATE TABLE role (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  manager_id INT,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (dept_name)
	VALUES 
	("Sales"),
	("Engineering"),
	("Finance"),
	("Legal");

INSERT INTO role (title, salary, department_id)
	VALUES
	("Lead Engineer", 150000, 2),
	("Legal Team Lead", 250000, 4),
	("Accountant", 125000, 3),
	("Sales Lead", 100000, 1),
	("Salesperson", 80000, 1),
	("Software Engineer", 120000, 2),
	("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
	VALUE 
	("John", "Doe", null, 1),
	("Kevin", "Tupik", null, 4),
	("Ashley", "Rodriguez", null, 3),
	("Mike", "Chan", null, 2),
	("Malia", "Brown", 2, 5),
	("Sarah", "Lourd", 1, 6),
	("Tom", "Allen", 4, 7);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;