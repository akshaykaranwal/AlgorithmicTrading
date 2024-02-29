CREATE TABLE Employee (
    Employee__id INT PRIMARY KEY,
    Emp_name VARCHAR(50),
    Department VARCHAR(100),
    Contact_number INT,
    Email_id VARCHAR(50),
    Emp_head_id INT,
    FOREIGN KEY (Emp_head_id) REFERENCES Employee(Employee__id)
);

CREATE TABLE EmpDepartment (
    Dep_id VARCHAR(5) PRIMARY KEY,
    Dep_name VARCHAR(50),
    Dep_off_day VARCHAR(100),
    Contact_number INT,
    dep_head_id INT,
    FOREIGN KEY (dep_head_id) REFERENCES Employee(Employee__id)
);

CREATE TABLE EmplsId (
    Emp_id INT PRIMARY KEY,
    Salary INT,
    Permanent BOOL,
    FOREIGN KEY (Emp_id) REFERENCES Employee(Employee__id)
);

CREATE TABLE ProjectKey (
    Proj_id INT PRIMARY KEY,
    Duration INT
);

CREATE TABLE Country (
    Country_id INT PRIMARY KEY,
    Country_name VARCHAR(50),
    Duration INT
);

CREATE TABLE Client (
    Client_id INT PRIMARY KEY,
    Client_name VARCHAR(50),
    C_id INT
);

CREATE TABLE EmpProject (
    Emp_id INT,
    Proj_id INT,
    Client_id INT,
    start_year INT,
    End_year INT,
    PRIMARY KEY (Emp_id, Proj_id, Client_id),
    FOREIGN KEY (Emp_id) REFERENCES Employee(Employee__id),
    FOREIGN KEY (Proj_id) REFERENCES ProjectKey(Proj_id),
    FOREIGN KEY (Client_id) REFERENCES Client(Client_id)
);

INSERT INTO Employee (Employee__id, Emp_name, Department, Contact_number, Email_id, Emp_head_id)
VALUES
    (1, 'Akshay Karanwal', 'Engineering', 1234567890, 'ak.kr@gmail.com', NULL),
    (2, 'Nikhil Kumar', 'Sales', 9876543210, 'nk.km@gmail.com', 1),
    (3, 'Sagar Singh', 'Marketing', 5555555555, 'ss.sg@gmail.com', 1);

-- Insert values into EmpDepartment table
INSERT INTO EmpDepartment (Dep_id, Dep_name, Dep_off_day, Contact_number, dep_head_id)
VALUES
    ('E101', 'Engineering', 'Saturday', 1234567890, 1),
    ('E102', 'Sales', 'Sunday', 9876543210, 2),
    ('E103', 'Marketing', 'Friday', 5555555555, 3);

-- Insert values into EmplsId table
INSERT INTO EmplsId (Emp_id, Salary, Permanent)
VALUES
    (1, 50000, TRUE),
    (2, 45000, TRUE),
    (3, 48000, FALSE);

-- Insert values into ProjectKey table
INSERT INTO ProjectKey (Proj_id, Duration)
VALUES
    (101, 6),
    (102, 4),
    (103, 8);

-- Insert values into Country table
INSERT INTO Country (Country_id, Country_name, Duration)
VALUES
    (1, 'INDIA', 6),
    (2, 'Canada', 4),
    (3, 'UK', 8);

-- Insert values into Client table
INSERT INTO Client (Client_id, Client_name, C_id)
VALUES
    (501, 'ABC Corporation', 1),
    (502, 'XYZ Enterprises', 2),
    (503, '123 Corp', 3);

-- Insert values into EmpProject table
INSERT INTO EmpProject (Emp_id, Proj_id, Client_id, start_year, End_year)
VALUES
    (1, 101, 501, 2023, 2024),
    (2, 102, 502, 2023, 2024),
    (3, 103, 503, 2023, 2024);
--SELECT Emp_name FROM Employee WHERE Emp_name LIKE 'A%';
--SELECT * FROM EmplsId WHERE Permanent = TRUE AND Salary > 45000;
--SELECT * FROM Employee WHERE Department = 'Engineering' OR Department = 'Sales';
--SELECT * FROM EmpDepartment WHERE Dep_id='E102';
--SELECT SUM(Salary) AS Total FROM Emplsid WHERE Permanent=TRUE;
--SELECT Emp_name FROM Employee WHERE Emp_name LIKE '%n';
--SELECT * FROM Employee WHERE Email_id LIKE '%gmail.com';
--SELECT * FROM EmpProject WHERE start_year=2023;
--SELECT * FROM EmpProject WHERE start_year!=End_year; 
--SELECT * FROM Employee WHERE SUBSTRING(Emp_name,4,1)='h';
--SELECT Dep_name FROM EmpDepartment WHERE dep_head_id > 1;
--SELECT Emp_name FROM Employee WHERE Employee__id IN (SELECT Emp_id FROM EmplsId WHERE Permanent = TRUE);
--SELECT Emp_name  FROM Employee  WHERE Employee__id IN (SELECT dep_head_id FROM EmpDepartment WHERE Dep_off_day = 'Saturday' );
--SELECT Client .* FROM Client JOIN Country ON Client.C_id = Country.Country_id WHERE Country.Country_name = 'INDIA';
--SELECT * FROM Employee WHERE Department='Marketing';

--SELECT pno, pname FROM proj WHERE budget > 10000;
--SELECT * FROM Workson WHERE hours < 10 AND resp = 'EE';
--SELECT eno,ename FROM Emp WHERE title IN ('EE','SA') AND salary>40000;
--SELECT ename FROM emp WHERE  dno=1 ORDER BY salary DESC;
--SELECT dname FROM Dept ORDER BY dname ASC;
--SELECT emp.ename AS employee_name, dept.dname AS department_name, emp.title AS employee_title FROM emp JOIN dept ON emp.dno = dept.dno;
--SELECT proj.pname AS project_name, workson.hours AS hours_worked, workson.pno AS project_number FROM workson JOIN proj ON workson.pno = proj.pno WHERE workson.hours > 10;