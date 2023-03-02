const express = require('express');
const fs = require('fs');
const app = express()
const session = require('express-session');
const mailjet = require('node-mailjet').apiConnect(
    'ed4864c1bfaa9f4def636d4e34b6ef9d', 'd283715c82e7059aeaef312065bbd351'
);
const multer = require("multer");
const upload = multer({ dest: 'Data_files/product_images/' })
const sql = require('./sql');
const { connect } = require('http2');
const { json } = require('express');
app.set("view engine", 'ejs');

app.use(session({
    secret: 'Keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(express.json());


module.exports = {
    // Hello: function(req, res, next){
    //     res.end("Hey there hello");
    // },
    // Hii: function(req,res,next){
    //     res.end("Yeahhhh");
    // },
    error: (req,res)=>{
        res.render("error_page");
    },

    islogin: (req, res) => {
        try{
            if (req.session.islogin)
            res.send(JSON.stringify({ status: true }));
            else
            res.send(JSON.stringify({ status: false }));
        }
        catch(error){
            res.send(JSON.stringify({ status: false }));
        }
        
    },

    toIndex: function (req, res) {
        try{
            if (req.session.islogin) {
                res.render('home', { login: true });
            }
            else
                res.render('index');
        }
        catch(error){
            console.log(error);
            res.render("error_page");
        }
    },

    home: (req, res) => {
        try{
            if (req.session.islogin) {
                res.render('home', { login: true });
            }
            else {
                res.render('home', { login: false });
            }
        }
        catch(error){
            console.log(error);
            res.render("error_page");
        }
        
    },

    skip: (req, res) => {
        res.redirect('/home')
    },

    validate: function (req, res) {
        try{
            sql.getUserWithQuery(`select name from users where email='${req.body.email}'`)
            .then(function (user) {
                if (!user.name) {
                    var token = Date.now();
                    SendMail(req.body.email, token, req.body.name, function (err, body) {
                        if (body) {
                            sql.AddUser(req.body.name, req.body.email, req.body.phone, req.body.password, token)
                                .then((result) => {
                                    console.log(result);
                                    if (result.status) {
                                        req.session.name = req.body.name;
                                        req.session.islogin = 'true ';
                                        req.session.email = req.body.email;
                                        req.session.token = token;
                                        req.session.isVerified = 'false';
                                        req.session.address = "";
                                        res.send(JSON.stringify({ flag: true }));
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                    res.send(JSON.stringify({ status: false }))
                                })
                        }
                        else {
                            res.send(JSON.stringify({ flag: false }));
                        }

                    })
                }
                else {
                    res.send(JSON.stringify({ flag: false }));
                }
            })
        }
        catch(error){
            console.log(error);
            res.render("error_page");
        }
    },

    authenticate: (req, res) => {
        try{
            sql.getUserWithQuery(`select * from users where email='${req.body.email}' and password ='${req.body.password}'`)
                .then((result) => {
                    if (result.name) {
                        console.log(result);
                        req.session.name = result.name;
                        req.session.email = result.email;
                        req.session.token = result.token;
                        req.session.islogin = true;
                        console.log(result.verified,typeof(result.verified));
                        req.session.isVerified = result.verified;
                        req.session.user_id = result.user_id;
                        req.session.address = result.address;
                        res.send(JSON.stringify({ flag: true }));
                    }
                    else {
                        res.send(JSON.stringify({ flag: false }));
                    }
    
                }).catch((err) => {
                    res.send(JSON.stringify({ flag: false }));
                })
        }
        catch(error){
            console.log(error);
            res.render("error_page");
        }
    },


    seller: (req, res) => {
        try{
            if (req.session.islogin && req.session.isVerified==='true ') {
                res.render('seller');
            }
            else if(!req.session.islogin)
            {
                res.render("home", { login: false })
            }
            else {
                res.render("verify");
            }
        }
        catch(error){
            console.log(error);
            res.render("error_page");
        }

    },

    getProducts: (req, res) => {
        try{
            sql.getProducts(req.body.start)
                .then((result) => {
                    res.json(result);
                })
        }
        catch(error){
            console.log(error);
            res.render("error_page");
        }
    }
    ,
    logout: (req, res) => {
        req.session.destroy();
        res.redirect("/");
    },

    verifymail: (req, res) => {
        try{
            const { token } = req.params;
            sql.UpdateQuery(`Update users set verified='true' where token='${token}'`)
                .then(function (result) {
                    if (result.status) {
                        sql.getUserWithQuery(`select name,email from users where token = '${token}'`)
                            .then((user) => {
                                req.session.isVerified = true;
                                req.session.islogin = true;
                                req.session.name = user.name;
                                req.session.email = user.email;
                                req.session.user_id = user.user_id;
                                req.session.address = "";
                                res.redirect('/home');
                            })}
                }).catch((err)=>{res.send(JSON.stringify({status:false}))})  
        }
        catch(error){
            console.log(error);
            res.render("error_page");
        }
    },



    verifyMessagePage: (req, res) => {
        if(req.session.isVerified==='false')
        res.render("verify");
        else
        res.render("error_page");
    },

    addseller: (req, res) => {
        if(req.session.isVerified==='true ' && req.session.islogin)
        {
            try{
                //While implementing the authorization, redirect to the selleradmin when seller is Authorized,get it from the seller table
                        sql.insertSeller(req.session.user_id, req.body.name, req.body.address, true, req.body.gst)
                            .then((result) => {
                                res.send(JSON.stringify({status:result.status}))
                            })    
                    .catch((err)=>{res.send(JSON.stringify({status:false}))})  
            }
            catch(error){
                console.log(error);
                res.render("error_page");
            }
        }
        else
        {
            res.render("error_page");
        }
    },


    selleradmin: (req, res) => {
        console.log(req.session);
        if(req.session.islogin && req.session.isVerified==='true ')
        {
            try{
                if(req.session.islogin &&req.session.isVerified==='true ')
                res.render("seller-admin");
                else
                res.render("error_page");
            }
            catch(error){
                console.log(error);
                res.render("error_page");
            }
        }
        else{
            res.render("error_page");
        }
    },


    addproduct: (req, res) => {
        try{
                if(req.session.isVerified==='true ' && req.session.islogin)
                {
                sql.getUserWithQuery(`select seller_id from users as u,sellers as s where u.user_id = s.user_id and u.email = '${req.session.email}';`)
                    .then((result) => {
                        sql.insertProducts(result.seller_id, req.body.product_name, req.body.product_description, req.body.product_stock, req.body.product_price, req.file.filename)
                            .then(function (result) {
                                if (result.status == true) {
                                    res.send(JSON.stringify({ status: true,product_pic: req.file.filename }));
                                }
                                else{
                                    res.send(JSON.stringify({status:false}));
                                }
                            })
                    })
                }
                else{
                    res.render("error_page");
                }

            }
            catch(error){
                console.log(error);
            }
    },




    addtocart: (req, res) => {
        console.log(req.session);
        if(req.session.islogin && req.session.isVerified==='true ')
        {
            try{
                    sql.ifProductPresent(`select product_id,quantity from cart where user_id=${req.session.user_id} and product_id=${req.body.product_id}`)
                    .then((product)=>{
                        if(product.product_id)
                        {
                            // Implement this => check if the stock is not less than the cart quantity
                            let stat=`update cart set quantity=${product.quantity}+1 where user_id=${req.session.user_id} and product_id=${product.product_id}`;
                            sql.UpdateQuery(stat)
                            .then((result)=>{
                                res.send(JSON.stringify({status:result.status}))
                            })
                        }
                        else{
                            sql.inserttocart(req.session.user_id,req.body.product_id, req.body.quantity)
                            .then((result)=>{
                                res.send(JSON.stringify({status:result.status}))
                            })
                        }
                    })  
                    .catch((err)=>{res.send(JSON.stringify({status:false}))})
            }
            catch(error){
                console.log(error);
            }
        }
        else{
            res.send(JSON.stringify({status:0}));
        }

    },


    cart: (req,res)=>{
        try{
            if(req.session.islogin &&req.session.isVerified==='true ')
            {
                res.render("cart");
            }
            else if(req.session.isVerified==='false')
            {
                res.render("verify");
            }
            else{
                res.render("error_page");
            }
        }
        catch(error){
            console.log(error);
            res.render("error_page");
        }
    },

    getcart: (req,res)=>{
        try{
            if(req.session.islogin &&req.session.isVerified==='true ')
            {
                sql.getcart(`select p.stock,p.product_id,quantity,product_name,product_pic,product_description,price from cart as c,products as p where p.product_id=c.product_id and c.user_id=${req.session.user_id} and p.status=1`)
                .then((result)=>{
                    res.json(result);
                })
                .catch((err)=>{console.log("error Occured while getting from cart")})
            }
            else{
                res.render("error_page");
            }
        }
        catch(error){
            console.log(error);
            res.render("error_page");
        }
    },

    cartquantitychange: (req,res)=>{
        try{
            if(req.session.islogin && req.session.isVerified==='true ')
            {
                sql.UpdateQuery(`update cart set quantity=quantity+${req.body.change} where product_id=${req.body.product_id} and user_id=${req.session.user_id}`)
                .then((result)=>{
                    res.send(JSON.stringify({status:result.status}));
                })
                .catch(err=>console.log(err))
            }
            else{
                res.render("error_page");
            }
        }
        catch(error){
            console.log(error);
            res.render("error_page");
        }
    },

    removeproductfromcart: (req,res)=>{
        try{
            if(req.session.islogin && req.session.isVerified==='true ')
            {
                sql.UpdateQuery(`delete from cart where user_id=${req.session.user_id} and product_id=${req.body.product_id}`)
                .then(result=>res.send(JSON.stringify({status:result.status})))
                .catch((err)=>{res.send(JSON.stringify({status:false}))})
            }
            else{
                res.render("error_page");
            }
        }
        catch(error){
            console.log(error);
            res.render("error_page");
        }
    },

    getsellerproducts: (req,res)=>{
        try{
            if(req.session.islogin && req.session.isVerified==='true ')
            {
                sql.getsellerproducts(`select product_id,product_name,product_pic,product_description,stock,price from products p,sellers s where s.seller_id = p.seller_id and s.user_id=${req.session.user_id} and p.status=1;`)
            .then((result)=>{
                res.json(result);
            })
            .catch((err)=>{console.log("error Occured while getting from cart")})
            }
            else{
                res.render("error_page");
            }
        }
        catch(error){
            console.log(error);
            res.render("error_page");
        }
    },

    removeproduct: (req,res)=>{
        try{
            if(req.session.islogin && req.session.isVerified==='true ')
            {
                sql.UpdateQuery(`update products set status=0 where product_pic='${req.body.product_pic}'`)
                .then(result=>res.json(result))
            }
            else{
                res.render("error_page");
            }
        }
        catch(error){
            console.log(error);
            res.render("error_page");
        }
    },

    updateproduct: (req,res)=>{
        try{
            if(req.session.islogin && req.session.isVerified==='true ')
            {
                var picname = "";
                if(!req.file)
                    picname = req.body.product_pic;
                else
                    picname = req.file.filename;
                
                sql.getUserWithQuery(`select seller_id from users as u,sellers as s where u.user_id = s.user_id and u.email = '${req.session.email}';`)
                    .then((result) => {
                        sql.UpdateQuery(`update products set product_name='${req.body.product_name}',product_description='${req.body.product_description}',stock=${req.body.product_stock},price=${req.body.product_price},product_pic='${picname}' where seller_id='${result.seller_id}' and product_pic='${req.body.old_product_pic}'`)
                            .then(function (result) {
                                if (result.status == true) {
                                    res.send(JSON.stringify({ status: true}));
                                }
                            })
                            .catch((err)=>{
                                console.log(err);
                            })
                    })
            }
            else{
                res.render("error_page");
            }
        }
        catch(error){
            console.log(error);
            res.render("error_page");
        }
    },

    checkout: (req,res)=>{
        if(req.session.islogin && req.session.isVerified==="true ")
        res.render("checkout_page",{address:req.session.address});
        else{
            res.render("error_page");
        }
    }
    ,
    storeaddress: (req,res)=>{
        if(req.body.address!="")
        {
            sql.UpdateQuery(`update users set address='${req.body.address}' where user_id=${req.session.user_id}`)
            .then((result)=>{
                if(result.status)
                {
                    req.session.address = req.body.address;
                    res.send(JSON.stringify({status:true}));
                }
            })
            .catch(error=>{res.stringify({status:false})})
        }
    },

    getproduct: (req,res)=>{
        if(req.body.product_id)
        {
            sql.getUserWithQuery(`select * from products where product_id=${req.body.product_id}`)
            .then(result=>{console.log(result);res.send(JSON.stringify(result))})
            .catch(err=>{res.send("not a product")})
        }
    },

    placeorder: (req,res)=>{
        if(req.session.islogin && req.session.isVerified==="true ")
            {
                sql.placeorder(req.body.products,req.session.addres,re.session.user_id)
                .then((response)=>{
                    if(response.status)
                    {
                        res.send(JSON.stringify({message:"Orderd Placed Successfully,Track Your Order from My Orders"}));
                    }
                    else{
                        res.send(JSON.stringify({message:"Sorry!! Due to Technical mistake,we were not able to place your order"}));
                    }
                })
                .catch((err)=>{
                    res.send()
                })
            }
        else{
            res.send(JSON.stringify({message:"Not Allowed to access this page"}));
        }
    },
    getorders: (req,res)=>{
        if(req.session.islogin && req.session.isVerified)
        {
            sql.getorders(req.session.user_id)
            .then((result)=>{
                res.json(result);
            })
            .catch((error)=>{
                res.send(JSON.stringify({status:false}))
            })
        }
    }

    ,admin: (req,res)=>{
        const {key} = req.params;
       
    }

}

function SendMail(email, token, name, callback) {
    console.log(mailjet);

    const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: "akshita1219209@jmit.ac.in",
                    Name: 'akshita',
                },
                To: [
                    {
                        Email: email,
                        Name: name,
                    },
                ],
                Subject: 'Verify Your Mail At Healthifyy',
                TextPart: '',
                HTMLPart:
                    `<h3>Dear ${name} , welcome to Healthifyy!</h3><br />Verify Mail by clicking <a href="http://localhost:5000/verifymail/${token}">Verify</a>`,
            },
        ],
    })
    request
        .then(result => {
            console.log(result.body);
            callback(null, result.body);
        })
        .catch(err => {
            console.log(err.statusCode)
            callback(err, null);
        })
}