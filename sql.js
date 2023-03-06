
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

function ExecuteQuerywithstatus(query){
  return new Promise((resolve, reject) => {
    var connection = getConnection();
    connection.connect();
    connection.on("connect", function (err) {
      var result = { status: false };
      let request = new Request(query, function (err) {
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
}

function ExecuteQuerywithobject(query){
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
        resolve(result);
        connection.close();

      });
      connection.execSql(request);


    })

  })
}

function ExecuteQuerywithArrayOfObjects(query)
{
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
}


module.exports = {

  AddUser: async function (name, email, phone, password, token) {
      try{
        var result = await ExecuteQuerywithobject(`insert into users(name,email,phone,password,token) values('${name}','${email}',${phone},'${password}',${token});select @@identity as user_id;`)
        return result;
      }
      catch(error){return error;}
  },
  //comment added

  getUserWithMail_password: async function (email,password) {
      try{
        var result = await ExecuteQuerywithobject(`select * from users where email='${email}' and password='${password}'`)
        return result;
      }
      catch(error){return error;}
  },
  
  getUserWithToken: async function (token) {
      try{
        var result = await ExecuteQuerywithobject(`select * from users where token='${token}'`)
        return result;
      }
      catch(error){return error;}
  },

  insertSeller: async (id, seller_company, address, isAuthorized, gst) => {
      try {
        var result = await ExecuteQuerywithstatus(`insert into sellers(user_id,seller_company,address,isAuthorized,gst) values(${id},'${seller_company}','${address}','${isAuthorized}','${gst}');`)
        return result;
      }
      catch (error) {return error;} 
  },

  insertProducts: async (seller_id, product_name, product_description, product_stock, product_price, product_pic) => {
    try {
     var result = await ExecuteQuerywithstatus(`insert into products(seller_id,product_name,product_pic,product_description,stock,price) values(${seller_id},'${product_name}','${product_pic}','${product_description}',${product_stock},${product_price})`)
      return result;
    }
    catch (error) {return error;}
  },

  getProducts: async (start) => {
    try{
      var result = await ExecuteQuerywithArrayOfObjects(`select * from products where status=1 order by product_id  offset ${start} rows fetch next 5 rows only;`);
      return result;
    }
    catch(error){return error;}
  },

  inserttocart: async (user_id, product_id, quantity) => {
    try {
      var result = await ExecuteQuerywithstatus(`insert into cart(user_id,product_id,quantity) values(${user_id},${product_id},${quantity})`)
       return result;
     }
     catch (error) {return error;}
  },

  ifProductPresentInCart: async (user_id,product_id) => {
    try{
      var result = await ExecuteQuerywithobject(`select product_id,quantity from cart where user_id=${user_id} and product_id=${product_id}`)
      return result;
    }
    catch(error){return error;}
  },

  getCart: async (user_id) => {
    try{
      var result = await ExecuteQuerywithArrayOfObjects(`select p.stock,p.product_id,quantity,product_name,product_pic,product_description,price from cart as c,products as p where p.product_id=c.product_id and c.user_id=${user_id} and p.status=1`);
      return result;
    }
    catch(error){return error;}
  },

  getorders: async (user_id)=>{
    try{
      var result = await ExecuteQuerywithArrayOfObjects(`select o.order_id,o.order_time,o.status,o.quantity,p.product_name,p.product_pic,o.item_value,o.customer_address from orders o,products p where o.product_id=p.product_id and o.user_id=${user_id} order by order_time desc`);
      return result;
    }
    catch(error){return error;}
  },

  getSeller: async (user_id)=>{
    try{
      var result = await ExecuteQuerywithobject(`select * from sellers where user_id=${user_id}`)
      return result;
    }
    catch(error){return error;}
  },
  getSellerProducts: async (user_id)=>{
    try{
      var result = await ExecuteQuerywithArrayOfObjects(`select product_id,product_name,product_pic,product_description,stock,price from products p,sellers s where s.seller_id = p.seller_id and s.user_id=${user_id} and p.status=1;`)
      return result;
    }
    catch(error){return error;}
  },
  getSellerOrders: async (user_id)=>{
    try{
      var result = await ExecuteQuerywithArrayOfObjects(`select p.product_name,p.product_pic,o.* from orders o,products p,sellers s where p.product_id=o.product_id and s.seller_id=p.seller_id and s.user_id=${user_id}`)
      return result;
    }
    catch(error){return error;}
  },
  getProductDetails: async (product_id)=>{
    try{
      var result = await ExecuteQuerywithobject(`select * from products where product_id=${product_id}`)
      return result;
    }
    catch(error){return error;}
  },

  removeProduct: async function (product_pic) {
    try {
      var result = await ExecuteQuerywithstatus(`update products set status=0 where product_pic='${product_pic}'`)
      return result;
    }
    catch (error) {return error;}
},

UpdateQuery: async function (query) {
  try {
    var result = await ExecuteQuerywithstatus(query)
    return result;
  }
  catch (error) {return error;}
},

getUnauthorizedSellers: async (user_id)=>{
  try{
    var result = await ExecuteQuerywithArrayOfObjects(`select * from sellers where isAuthorized='false'`)
    return result;
  }
  catch(error){return error;}
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
              for(let i=0;i<products.length;i++)
              {
                await order(products[i],address)
              }

              connection.commitTransaction((err) => {
                if (err) {
                  reject();
                  return;
                }
                else{
                  resolve({status:true});
                }
                connection.close();
              });
            }
            catch(error){
              connection.rollbackTransaction((err) => {
                if (err) {console.log('transaction rollback error: ', err);}
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
              if(product.quantity==0)reject();
              if (result.stock >= product.quantity) {
                let request2 = new Request(`update products set stock=stock-${product.quantity},sale=sale+1*${product.quantity} where product_id=${product.product_id}`, function (err) {
                  if (err) {
                    console.log(err);
                    reject();
                  }
                });
                request2.on("requestCompleted", function (err) {
                  //resolve({ status: true });
                  let request3 = new Request(`insert into orders(product_id,quantity,item_value,customer_address,status,user_id) values(${product.product_id},${product.quantity},${product.quantity*result.price},'${address}','{"status":"Placed"}',${user_id});`, function (err) {
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
  }
}

