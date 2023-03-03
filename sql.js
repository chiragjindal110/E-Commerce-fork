
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;


function getConnection() {
  var Connection = require("tedious").Connection;
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
    }
  };
  return new Connection(config);
}


module.exports = {

  getUsers: function () {
    var connection = getConnection();
    connection.connect();
    connection.on("connect", function (err) {
      let request = new Request("SELECT * From users", function (err) {
        if (err) {
          console.log(err);
        }
      });
      var result = {};
      request.on('row', function (columns) {
        columns.forEach(function (column) {
          if (column.value === null) {
            console.log('NULL');
          } else {
            result[column.metadata.colName] = column.value;
          }
        });
      });
      request.on("requestCompleted", function (rowCount, more) {
        connection.close();
        return result;
      });
      connection.execSql(request);

    })

  },



  AddUser: function (name, email, phone, password, token) {
    return new Promise((resolve, reject) => {
      var connection = getConnection();
      connection.connect();
      connection.on("connect", function (err) {
        var result = { status: false };
        let request = new Request(`insert into users(name,email,phone,password,token) values('${name}','${email}',${phone},'${password}',${token});`, function (err) {
          if (err) {
            console.log(err);
            reject(err);
          }
        });
        // Close the connection after the final event emitted by the request, after the callback passes

        request.on("requestCompleted", function (err) {
          result.status = true;
          resolve(result);
          connection.close();
        });
        connection.execSql(request);
      })

    })

  },


  getUserWithQuery: function (query) {
    return new Promise(function (resolve, reject) {
      var connection = getConnection();
      connection.connect();
      connection.on("connect", function (err) {
        let request = new Request(query, function (err) {
          if (err) {
            console.log(err);
          }
        });
        var result = {};
        request.on('row', function (columns) {
          columns.forEach(function (column) {
            if (column.value === null) {
            } else {
              result[column.metadata.colName] = column.value;
            }
          });
        });
        request.on("requestCompleted", function (rowCount, more) {
          console.log(result);
          resolve(result);
          connection.close();

        });
        connection.execSql(request);


      })

    })

  },



  UpdateQuery: function (query) {
    return new Promise((resolve, reject) => {
      try {
        var connection = getConnection();
        connection.connect();
        connection.on("connect", function (err) {
          var result = { status: false };
          let request = new Request(query, function (err) {
            if (err) {
              console.log(err);
              reject(result);
            }
          });
          // Close the connection after the final event emitted by the request, after the callback passes

          request.on("requestCompleted", function (err) {
            console.log("in update");
            result.status = true;
            resolve(result);
            connection.close();
          });
          connection.execSql(request);
        })
      }
      catch (error) {
        reject(error);
      }

    })

  },


  insertSeller: (id, seller_company, address, isAuthorized, gst) => {
    return new Promise((resolve, reject) => {
      var connection = getConnection();
      connection.connect();
      connection.on("connect", function (err) {
        var result = { status: false };
        let request = new Request(`insert into sellers(user_id,seller_company,address,isAuthorized,gst) values(${id},'${seller_company}','${address}','${isAuthorized}','${gst}');`, function (err) {
          if (err) {
            console.log(err);
            reject(err);
          }
        });
        // Close the connection after the final event emitted by the request, after the callback passes

        request.on("requestCompleted", function (err) {
          result.status = true;
          resolve(result);
          connection.close();
        });
        connection.execSql(request);
      })

    })
  },

  insertProducts: (seller_id, product_name, product_description, product_stock, product_price, product_pic) => {
    return new Promise((resolve, reject) => {
      var connection = getConnection();
      connection.connect();
      connection.on("connect", function (err) {
        var result = { status: false };
        let request = new Request(`insert into products(seller_id,product_name,product_pic,product_description,stock,price) values(${seller_id},'${product_name}','${product_pic}','${product_description}',${product_stock},${product_price})`, function (err) {
          if (err) {
            console.log(err);
            reject(err);
          }
        });
        // Close the connection after the final event emitted by the request, after the callback passes

        request.on("requestCompleted", function (err) {
          result.status = true;
          resolve(result);
          connection.close();
        });
        connection.execSql(request);
      })

    })
  },


  getProducts: (start) => {
    return new Promise(function (resolve, reject) {
      var connection = getConnection();
      connection.connect();
      connection.on("connect", function (err) {
        var result_array = [];
        console.log(start);
        let request = new Request(`select * from products where status=1 order by product_id  offset ${start} rows fetch next 5 rows only;`, function (err) {
          if (err) {
            console.log(err);
          }
        });

        request.on('row', function (columns) {
          let result = {};
          columns.forEach(function (column) {
            if (column.value === null) {
            } else {

              result[column.metadata.colName] = column.value;
            }
          });
          result_array.push(result);
        });

        request.on("requestCompleted", function (rowCount, more) {
          resolve(result_array);
          connection.close();

        });
        connection.execSql(request);


      })

    })
  },



  inserttocart: (user_id, product_id, quantity) => {
    return new Promise((resolve, reject) => {
      var connection = getConnection();
      connection.connect();
      connection.on("connect", function (err) {
        var result = { status: false };
        let request = new Request(`insert into cart(user_id,product_id,quantity) values(${user_id},${product_id},${quantity})`, function (err) {
          if (err) {
            console.log(err);
            reject(err);
          }
        });
        // Close the connection after the final event emitted by the request, after the callback passes

        request.on("requestCompleted", function (err) {
          result.status = true;
          resolve(result);
          connection.close();
        });
        connection.execSql(request);
      })

    })
  },



  ifProductPresent: (query) => {
    return new Promise(function (resolve, reject) {
      var connection = getConnection();
      connection.connect();
      connection.on("connect", function (err) {
        let request = new Request(query, function (err) {
          if (err) {
            console.log(err);
          }
        });
        var result = {};
        request.on('row', function (columns) {
          columns.forEach(function (column) {
            if (column.value === null) {
            } else {
              result[column.metadata.colName] = column.value;
            }
          });
        });
        request.on("requestCompleted", function (rowCount, more) {
          console.log(result);
          resolve(result);
          connection.close();

        });
        connection.execSql(request);


      })

    })

  },


  getcart: (query) => {
    return new Promise(function (resolve, reject) {
      var connection = getConnection();
      connection.connect();
      connection.on("connect", function (err) {
        var result_array = [];
        let request = new Request(query, function (err) {
          if (err) {
            console.log(err);
          }
        });

        request.on('row', function (columns) {
          let result = {};
          columns.forEach(function (column) {
            if (column.value === null) {
            } else {

              result[column.metadata.colName] = column.value;
            }
          });
          result_array.push(result);
        });

        request.on("requestCompleted", function (rowCount, more) {
          resolve(result_array);
          connection.close();

        });
        connection.execSql(request);


      })

    })
  },

  getsellerproducts: (query) => {
    return new Promise(function (resolve, reject) {
      var connection = getConnection();
      connection.connect();
      connection.on("connect", function (err) {
        var result_array = [];
        let request = new Request(query, function (err) {
          if (err) {
            console.log(err);
            reject();
          }
        });

        request.on('row', function (columns) {
          let result = {};
          columns.forEach(function (column) {
            if (column.value === null) {
            } else {

              result[column.metadata.colName] = column.value;
            }
          });
          result_array.push(result);
        });

        request.on("requestCompleted", function (rowCount, more) {
          resolve(result_array);
          connection.close();

        });
        connection.execSql(request);


      })

    })
  },

  placeorder: (products,address,user_id) => {
    return new Promise(function (resolve, reject) {
      console.log(products);
      var connection = getConnection();
      connection.on("connect", function (err) {
          connection.beginTransaction(async (err) => {
          if (err) 
          {
            reject();
            return;
          }
           else 
           {
            try{
              console.log('beginTransaction() done');
              let i=0;
              for( i=0;i<products.length;i++)
              {
                await order(products[i],address)
              }

              connection.commitTransaction((err) => {
                if (err) {
                  console.log('commit transaction err: ', err);
                  reject();
                  return;
                }
                else{
                  resolve({status:true});
                }
                console.log('commitTransaction() done!');
                console.log('DONE!');
                connection.close();
              });
                
              
              
            }
            catch(error){
              console.log('transaction err: ', err);
              connection.rollbackTransaction((err) => {
                if (err) {
                  console.log('transaction rollback error: ', err);
                }
                connection.close();
                reject(error);
              });
            }
           
          }
        })
      })

      connection.connect();

      function order(product,address) {
        return new Promise((resolve, reject) => {
          try {
            let result = {};
            
            let request = new Request(`select stock,price from products where product_id=${product.product_id}`, function (err) {
              if (err) {
                console.log(err);
                reject();
                return;
              }
            });

            request.on('row', function (columns) {              
              columns.forEach(function (column) {
                if (column.value === null) {
                } else {
                  result[column.metadata.colName] = column.value;
                }
              });

            });

            request.on("requestCompleted",()=>{
              if (result.stock >= product.quantity) {
                let request2 = new Request(`update products set stock=stock-${product.quantity},sale=sale+1*${product.quantity} where product_id=${product.product_id}`, function (err) {
                  if (err) {
                    console.log(err);
                    reject();
                  }
                });
                request2.on("requestCompleted", function (err) {
                  //resolve({ status: true });
                  let status = {"status": "placed"}
                  let request3 = new Request(`insert into orders(product_id,quantity,item_value,customer_address,status,user_id) values(${product.product_id},${product.quantity},${product.quantity*result.price},'${address}','{"status":"placed"}',${user_id});`, function (err) {
                    if (err) {
                      console.log(err);
                      reject();
                    }
                  });
                  request3.on("requestCompleted", function (err) {
                    resolve({ status: true });
                  });
                  connection.execSql(request3);
                });
                connection.execSql(request2);
              } else {
                reject();
              }
            })

            connection.execSql(request);
          }
          catch (error) {
            reject();
          }
        })
      }
    })
  },

  getorders: (user_id)=>{
    return new Promise((resolve,reject)=>{
      try{
        var connection = getConnection();
      connection.connect();
      connection.on("connect", function (err) {
        var result_array = [];
        let request = new Request(`select o.order_id,o.order_time,o.status,o.quantity,p.product_name,p.product_pic,o.item_value,o.customer_address from orders o,products p where o.product_id=p.product_id and o.user_id=${user_id} order by order_time desc`, function (err) {
          if (err) {
            console.log(err);
            reject();
          }
        });

        
        request.on('row', function (columns) {
          let result = {};
          columns.forEach(function (column) {
            if (column.value === null) {
            } else {

              result[column.metadata.colName] = column.value;
            }
          });
          result_array.push(result);
        });

        request.on("requestCompleted", function (rowCount, more) {
          resolve(result_array);
          connection.close();

        });
        connection.execSql(request);


      })

      }
      catch(error){
        reject();
      }
    })
  }
}

