const express = require('express');
const app = express()
const fs = require('fs');
const port = 5000;
const middlewares = require('./middleware');
const session = require('express-session');
const multer = require('multer');
const upload = multer({ dest: 'Data_files/product_images/' })

app.use(session({
	secret: 'Keyboard cat',
	resave: false,
	saveUninitialized: true
}))
app.use(express.json());
app.set("view engine", 'ejs');
app.use(express.urlencoded({ extended: true }));
app.get("/", middlewares.toIndex);
app.post('/authenticate', middlewares.authenticate)
app.post('/validate', middlewares.validate)
app.get('/home', middlewares.home);
app.get('/skip', middlewares.skip);
app.get('/seller', middlewares.seller);
app.get("/sellerrequestpage",middlewares.sellerrequestpage);
app.post('/getProducts' ,middlewares.getProducts);
app.get("/logout",middlewares.logout);
app.get("/verifymail/:token",middlewares.verifymail);
app.get("/verifyMessagePage",middlewares.verifyMessagePage);
app.post("/addseller",middlewares.addseller);
app.post("/addproduct",upload.single('picname'),middlewares.addproduct);
app.get("/selleradmin",middlewares.selleradmin);
app.get('/islogin',middlewares.islogin);
app.post("/addtocart",middlewares.addtocart);
app.get("/cart",middlewares.cart);
app.get('/getcart',middlewares.getcart);
app.post('/cartquantitychange',middlewares.cartquantitychange);
app.post("/removeproductfromcart",middlewares.removeproductfromcart);
app.get('/getsellerproducts',middlewares.getsellerproducts);
app.post("/removeproduct",middlewares.removeproduct);
app.post("/updateproduct",upload.single('picname'),middlewares.updateproduct);
app.get("/checkout",middlewares.checkout);
app.post("/storeaddress",middlewares.storeaddress);
app.post("/getproduct",middlewares.getproduct);
app.post("/placeorder",middlewares.placeorder);
app.get("/myorders",(req,res)=>{res.render("myorders")})
app.get("/getorders",middlewares.getorders);
app.get("/orderscompleted",middlewares.orderscompleted);
app.get("/getsellerorders",middlewares.getsellerorders);
app.get("/unauthorizedsellers",middlewares.unauthorizedsellers);
app.post("/authorizeseller",middlewares.authorizeseller);
app.get("/admin",middlewares.admin);
app.get("/verifyadmin",middlewares.verifyadmin);
app.use(express.static(__dirname + "/images"));
app.use(express.static(__dirname + "/css"));
app.use(express.static(__dirname + "/javascript"));
app.use(express.static(__dirname + "/Data_files/product_images"));
app.get("/*",middlewares.error);
app.listen(port, () => { console.log(`You are running on port no:${port}`) })