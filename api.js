const express = require('express');

const app = express();
const port = 3000;

// Enable CORS for all domains (not recommended for production)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'asset_management'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

app.use(express.json()); // Parse JSON data

app.get('/test', async (req, res) => {
  try {

    console.log('test');

    res.json({test: 'test'});
  } catch (err) {
    console.error('Error connecting to MS SQL Server:', err);
    res.status(500).json({ error: 'Failed to retrieve product data' });
  }
});

app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error);
      res.status(500).send('Error executing query');
      return;
    }

    // Process and send the results
    res.json(results);
  });
});

app.get('/users/delete/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM users where id=?',[id], (error, results, fields) => {
    if (error) {
      console.error('Error executing query in /user/delete/:id: ' + error);
      res.status(500).send('Error executing delete user query');
      return;
    }

    // Process and send the results
    res.json(results);
  });
});

app.get('/users/access', (req, res) => {
  connection.query('SELECT * FROM user_role_access', (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error);
      res.status(500).send('Error executing query');
      return;
    }

    // Process and send the results
    res.json(results);
  });
});

app.post('/user/access/save', async (req, res) => {
  // id: 1, username: 'test', user_role: 'IT Support', first_name: 'test', last_name: 'test'
  const { id, roleName, moduleName, permission} = req.body;

if(id > 0 ){
  updateRolePermission(res,id, roleName, moduleName, permission);
  return; 
}  
connection.query(
  'INSERT INTO user_role_access (role_name, module_name, transaction) VALUES (?,?,?)',
  [roleName, moduleName, permission ],
  (error, results, fields) => {
    if (error) {
      console.error('Error inserting access: ' + error);
      res.status(500).json({ error: 'Error inserting access' });
      return;
    }

    res.status(201).json({ message: 'Data inserted successfully' });
  }
);
});

app.post('/user/save', async (req, res) => {
  // id: 1, username: 'test', user_role: 'IT Support', first_name: 'test', last_name: 'test'
  const { id,username, user_role, first_name,last_name,password,is_active} = req.body;

if(id > 0 ){
  updateUser(res,id ,username, user_role, first_name,last_name,password,is_active);
  return; 
}  
connection.query(
  'INSERT INTO users (username, user_role, first_name,last_name,password) VALUES (?,?,?,?,?)',
  [username, user_role, first_name,last_name,password ],
  (error, results, fields) => {
    if (error) {
      console.error('Error inserting user: ' + error);
      res.status(500).json({ error: 'Error inserting user' });
      return;
    }

    res.status(201).json({ message: 'Data inserted successfully' });
  }
);
});

app.get('/assets', (req, res) => {
  connection.query('SELECT * FROM asset_log', (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error);
      res.status(500).send('Error executing query');
      return;
    }

    // Process and send the results
    res.json(results);
  });
});

app.get('/assets/:tranId', (req, res) => {
  const tranId = req.params.tranId;
  connection.query('SELECT * FROM asset_log where transaction_id=?',[tranId], (error, results, fields) => {
    if (error) {
      console.error('Error executing query in /assets/:tranId: ' + error);
      res.status(500).send('Error executing query');
      return;
    }

    // Process and send the results
    res.json(results);
  });
});

app.get('/assets/delete/:tranId', (req, res) => {
  const tranId = req.params.tranId;
  connection.query('DELETE FROM asset_log where transaction_id=?',[tranId], (error, results, fields) => {
    if (error) {
      console.error('Error executing query in /assets/delete/:tranId: ' + error);
      res.status(500).send('Error executing delete query');
      return;
    }

    // Process and send the results
    res.json(results);
  });
});

app.post('/asset/save', async (req, res) => {
    const { operation,transactionNumber,assetName, serialNum, brandName,supplier,amount,assetLocation,employeeID, employeeName, status, specification } = req.body;

  if(operation == 'View Asset'){
    updateAsset(res,transactionNumber,assetName, serialNum, brandName,supplier,amount,assetLocation,employeeID, employeeName, status, specification);
    return; 
  }  
  connection.query(
    'INSERT INTO asset_log (transaction_id,asset_name, asset_model,asset_serial_no,asset_amount, supplier_id, asset_location, employee_id,employee_name,asset_status,specification) VALUES (?,?, ?, ?, ?, ?,?,?,?,?,?)',
    [transactionNumber,assetName, brandName,serialNum,amount,supplier,assetLocation,employeeID,employeeName,status,specification ],
    (error, results, fields) => {
      if (error) {
        console.error('Error inserting data: ' + error);
        res.status(500).json({ error: 'Error inserting data' });
        return;
      }

      // if(employeeID){		
	    //   if (saveEmployee(employeeID,employeeName) != 0){
      //   res.status(500).json({ error: 'Error inserting employee' });
      //   return;
      // 	}
      // }

      // Data successfully inserted
      res.status(201).json({ message: 'Data inserted successfully' });
    }
  );
});

app.get('/transaction/log', (req, res) => {
  const tranId = req.params.tranId;
  connection.query('SELECT * FROM transaction_log order by date_transact', (error, results, fields) => {
    if (error) {
      console.error('Error executing query in  get transaction log ' + error);
      res.status(500).send('Error get transaction log query');
      return;
    }

    // Process and send the results
    res.json(results);
  });
});

app.get('/list-of-values', (req, res) => {
  connection.query('SELECT * FROM list_of_values', (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error);
      res.status(500).send('Error executing query of list_of_values');
      return;
    }

    // Process and send the results
    res.json(results);
  });
});

app.post('/list-of-values/save', async (req, res) => {
  const { id, lov_value,lov_type,is_active } = req.body;
  console.log("id: " + id + ",is_active:" + is_active);

if(id > 0){
  updateLOV(res,id, lov_value,lov_type,is_active);
  return;
}
connection.query(
  'INSERT INTO list_of_values (lov_value,lov_type,is_active) VALUES (?,?,?)',
  [lov_value,lov_type,is_active],
  (error, results, fields) => {
    if (error) {
      console.error('Error inserting log: ' + error);
      res.status(500).json({ error: 'Error inserting value' });
      return;
    }
   
    res.status(201).json({ message: 'Value inserted successfully' });
  }
);
});


app.post('/transaction/log/save', async (req, res) => {
  const { user, module, action } = req.body;

connection.query(
  'INSERT INTO transaction_log (user,module,action) VALUES (?,?,?)',
  [user, module, action],
  (error, results, fields) => {
    if (error) {
      console.error('Error inserting log: ' + error);
      res.status(500).json({ error: 'Error inserting log' });
      return;
    }

   
    res.status(201).json({ message: 'Log inserted successfully' });
  }
);
});

app.post('/login', async (req, res) => {

  const { username, password} = req.body;


connection.query(
  'SELECT * from users WHERE username=? and password=?',
  [username, password],
  (error, results, fields) => {
    if (error) {
      console.error('Error inserting access: ' + error);
      res.status(500).json({ error: 'Error inserting access' });
      return;
    }
    console.log('response:' + JSON.stringify(results));
    if(results.length == 0){
      res.status(400).json({ message: 'Invalid Credential' })
      return;
    }

    res.status(200).json(results);
  }
);
});

function updateAsset(res,transactionNumber,assetName, serialNum, brandName,supplier,amount,assetLocation,employeeID, employeeName,status, specification){
  connection.query(
    'UPDATE asset_log set asset_name = ?, asset_model =?,asset_serial_no = ?,asset_amount=?, supplier_id =?, asset_location=?, employee_id=?, employee_name=?,asset_status=?,specification=? ' +
     ' WHERE transaction_id=?',
    [assetName, brandName,serialNum,amount,supplier,assetLocation,employeeID,employeeName,status,specification,transactionNumber],
    (error, results, fields) => {
      if (error) {
        console.error('Error updating asset: ' + error);
        res.status(500).json({ error: 'Error updating asset' });
        return;
      }

     



    }
  );

}

function updateLOV(res,id, lov_value,lov_type,is_active ){
  connection.query(
    'UPDATE list_of_values set lov_value = ?, lov_type =?,is_active = ? ' +
     ' WHERE id=?',
    [lov_value,lov_type,is_active,id],
    (error, results, fields) => {
      if (error) {
        console.error('Error updating lov: ' + error);
        res.status(500).json({ error: 'Error updating lov' });
        return;
      }
      res.status(200).json({ error: 'Success updating lov' });
    }
  );

}

function updateUser(res,id,username, user_role, first_name,last_name, password,is_active){
  connection.query(
    'UPDATE users set username = ?,user_role =?,first_name = ?,last_name=?,password=?, is_active=? ' +
     ' WHERE id=?',
    [username, user_role, first_name,last_name,password,is_active,id],
    (error, results, fields) => {
      if (error) {
        console.error('Error updating user: ' + error);
        res.status(500).json({ error: 'Error updating user' });
        return;
      }

      res.status(201).json({ message: 'User succesfully updated' });

    }
  );

}

function updateRolePermission(res,id, roleName, moduleName, permission){
  connection.query(
    'UPDATE user_role_access set transaction =? ' +
     ' WHERE role_name=? AND module_name=?',
    [permission,roleName, moduleName],
    (error, results, fields) => {
      if (error) {
        console.error('Error updating role permission: ' + error);
        res.status(500).json({ error: 'Error role permission' });
        return;
      }
      res.status(200).json({ message: 'Data updated successfully' });
    }
  );

}
function saveEmployee(employeeID,employeeName,callback) {
	
  try{
    console.log("employeeID:" + employeeID);
    console.log("employeeName:" + employeeName);
    employeeQueryResults =[];
    getEmployee(employeeID,(error, results) => {
      if (error) {
        console.error('Error get employee: ' + error);
        return;
      }
      // Use the query results
      employeeQueryResults=results;
      console.log("employeeQueryResults:" + JSON.stringify(employeeQueryResults));
      if(!employeeQueryResults && employeeQueryResults.lenght === 0){
      
          connection.query(
          'INSERT INTO employee (employee_id, employee_name) VALUES (?,?)',
          [employeeID,employeeName ],
          (error, results, fields) => {
            if (error) {
              console.error('Error inserting employee: ' + error);
              //return -1;
              callback(-1)
            }
  
            callback(0);
          }
          );
  
      } 
      
    });

  }	catch(error){
    console.log(error);
  }
}

function getEmployee(employeeID,callback) {
  console.log("get employeeID:" + employeeID);
  const query = 'SELECT * FROM employee WHERE employee_id = ?';
  console.log("getemployeeID query:" + query);

  connection.query(query, [employeeID], (error, results, fields) => {
    if (error) {
      console.error('Error executing get employeeID: ' + error);
      return null;
    }

    // Respond with the query results
    console.log("query" +results);
    callback(null,results);
  });
}
process.on('SIGINT', () => {
  connection.end((err) => {
    if (err) {
      console.error('Error closing the MySQL connection: ' + err);
    }
    console.log('MySQL connection closed.');
    process.exit(0);
  });
});


app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});
