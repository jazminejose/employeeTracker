const inquirer = require('inquirer')
const table = require('console.table')
const mysql = require('mysql2')
const dbconnection = mysql.createConnection('mysql://root:rootroot@localhost:3306/employeeTracker_db')

// Check if database is connected //
// dbconnection.connect(() => console.log('connected!'))


dbconnection.query("SELECT * from role", function (error, res) {
  showRoles = res.map(role => ({ name: role.title, value: role.id }))
})
dbconnection.query("SELECT * from department", function (error, res) {
  showDepartments = res.map(dep => ({ name: dep.name, value: dep.id }))
})
dbconnection.query("SELECT * from employee", function (error, res) {
  // console.log(error, res);
  showEmployees = res.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
})

const main = () => {
  console.log(`
  --------------------------------
          Employee Tracker
  --------------------------------`)
  inquirer.prompt({
    type: 'list',
    name: 'option',
    message: `Select an option:`,
    choices: [
      `View all information of employees`,
      `View all employees`,
      `View all roles`,
      `View all departments`,
      `Add employee`,
      `Add role`,
      `Add department`,
      `Update employee role`,
      `Exit`
    ]
  })
    .then(function (val) {
      switch (val.option) {
        case `View all information of employees`:
          viewAllInformation();
          break;
        case `View all employees`:
          onlyEmployees();
          break;
        case `View all roles`:
          viewRoles();
          break;
        case `View all departments`:
          viewDepartments();
          break;
        case `Add employee`:
          addEmployee();
          break;
        case `Add role`:
          addRole();
          break;
        case `Add department`:
          addDepartment();
          break;
        case `Update employee role`:
          updateEmployeeRole();
          break;
        case `Exit`:
          end();
        break;
      }
    })
}

// CALL FUNCTION //
main()

// FUNCTION TO VIEW ALL INFORMATION OF EMPLOYEES //
function viewAllInformation() {
  dbconnection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.dept_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    function (err, res) {
      if (err) throw err
      console.table(res)
      main()
    })
}

// FUNCTION TO VIEW ALL EMPLOYEES //
function onlyEmployees() {
  dbconnection.query('SELECT employee.first_name, employee.last_name FROM employee', (err, employees) => {
    if (err) { console.log(err) }
    console.table(employees)
    main()
  })
}

// FUNCTION TO VIEW ALL ROLES //
function viewRoles() {
  dbconnection.query('SELECT role.title, role.salary FROM role',
    function (err, res) {
      if (err) throw err
      console.table(res)
      main()
    })
}

// FUNCTION TO VIEW ALL DEPARTMENTS //
function viewDepartments() {
  dbconnection.query('SELECT department.dept_name FROM department',
    function (err, res) {
      if (err) throw err
      console.table(res)
      main()
    })
}

// FUNCTION TO ADD EMPLOYEE //
function addEmployee() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',     
      message: "First name of employee:",
    },
    {
      type: 'input',
      name: 'last_name',      
      message: "Last name of employee",
    },
    {
      type: 'list',
      name: 'role',
      message: "Employee's title:",
      choices: showRoles
    },
    {
      type: 'list',
      name: 'manager',
      message: "Employee's Manager:",
      choices: showEmployees
    }
  ])
    .then(function (newEmployee) {
      dbconnection.query("INSERT INTO employee SET ?",
        {
          first_name: newEmployee.first_name,
          last_name: newEmployee.last_name,
          manager_id: newEmployee.manager,
          role_id: newEmployee.role
        }, function (err) {
          if (err) throw err
          console.table(newEmployee)
          console.log(`Success! Employee Added.`)
          main()
        })
    })
}

// FUNCTION TO ADD ROLE //
function addRole() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'roleName',
      message: "Title of role:",
    },
    {
      type: 'input',
      name: 'newSalary',
      message: "Salary of new role:",
    }
  ])
    .then(function (newRole) {
      dbconnection.query("INSERT INTO role SET ?",
        {
          title: newRole.roleName,
          salary: newRole.newSalary
        }, function (err) {
          if (err) throw err
          console.table(newRole)
          console.log(`Success! Role Added.`)
          main()
        })
    })
}

// FUNCTION TO ADD DEPARTMENT //
function addDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'New department name:'
    }
  ])
    .then(function (newDepartment) {
      dbconnection.query("INSERT INTO department SET ?",
        {
          dept_name: newDepartment.name
        }, function (err) {
          if (err) throw err
          console.table(newDepartment)
          console.log(`Success! Department Added.`)
          main()
        })
    })
}

// FUNCTION TO UPDATE EMPLOYEE //
function updateEmployeeRole() {
  dbconnection.query('SELECT employee.first_name, employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id', (err, employees) => {
    if (err) { console.log(err) }
    console.table(employees)
    inquirer.prompt([
      {
        type: 'list',
        name: 'first_name',       
        message: "Select employee:",
        choices: showEmployees
      },
      {
        type: 'list',
        name: 'role_id',    
        message: "Select new role:",
        choices: showRoles
      }
    ])
      .then(updateEmployee => {
        dbconnection.query('UPDATE employee.first_name, employee.last_name, role.title FROM employee SET ? WHERE ?', [{ role_id: updateEmployee.role_id }, { first_name: updateEmployee.first_name }], () => {
          if (err) { console.log(err) }
          console.table(employees)
          console.log('Success! Employee Role Updated.')
          main()
        })
      })
  })
}

function end() {
  console.log("Goodbye!");
  dbconnection.end();
  process.exit();
}


