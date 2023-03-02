const express = require("express");

const app = express();

const port = 3000;

app.get("/", (req, res) => {
  res.json({ msg: "Success" });
});

var Connection = require("tedious").Connection;
var Request = require("tedious").Request;
var TYPES = require("tedious").TYPES;

// Create connection to database
var config = {
  server: 'localhost',
  authentication: {
    type: "default",
    options: {
      userName: "chirag", // update me
      password: "12345", // update me
    },
  },
  options: {
    trustServerCertificate: true,
    database: "ecommerce",
  },

};
var connection = new Connection(config);
connection.on("connect", function (err) {
  // If no error, then good to proceed.
  executeStatement();
});

connection.connect();

var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;  

async function executeStatement() {  
   let  request = new Request("SELECT * From users", function(err) {  
    if (err) {  
        console.log(err);}  
    });  
    var result = {};  
    var arr =[];
    // request.on()
    request.on('row', function(columns) {  
        columns.forEach(function(column) {  
          if (column.value === null) {  
            console.log('NULL');  
          } else {  
            result[column.metadata.colName] = column.value;  
          }  
        });  
        arr.push(result);
        console.log(result);  
    });  

    request.on('done', function(rowCount, more) {  
    console.log(rowCount + ' rows returned');  
    });  
    
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
      console.log(arr);
        connection.close();
    });
    connection.execSql(request);  
    
    // const pool = await connect();
    // try {
    //     const result = await pool.request()
    //     .query('SELECT * FROM users');
    //     console.log(result.recordset);
    // } catch (err) {
    //     console.log('Error executing query:', err);
    // } finally {
    //     pool.close();
    // }

    // await executeStatement()
}  

app.listen(port, () => {
  console.log("Server Is Started At http://localhost:" + port);
});

// const sql = require('mssql/msnodesqlv8');

// var config = {
//     database: 'ecommerce',
//     server: 'DESKTOP-I62B6V7\\SQLEXPRESS',
//     driver: 'msnodesqlv8',
//     options:{
//         trustedConnection:true
//     }
    
// };
// async function connect() {
//     try {
//         const pool = await sql.connect(config);
//         console.log('Connected to database!');
//         return pool;
//     } catch (err) {
//         console.log('Error connecting to database:', err);
//     }
// }

// async function getOrders() {
//     const pool = await connect();
//     try {
//         const result = await pool.request()
//         .query('SELECT * FROM users');
//         console.log(result.recordset);
//     } catch (err) {
//         console.log('Error executing query:', err);
//     } finally {
//         pool.close();
//     }
// }

// getOrders();