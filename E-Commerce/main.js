const express = require('express');
const app = express()
const fs = require('fs');
const port = 3000;
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
app.post('/addProduct', upload.single('image'), middlewares.addproduct);
app.get('/admin', middlewares.admin);
app.post('/getProducts' ,middlewares.getProducts);
app.get("/logout",middlewares.logout);
app.get("/verifymail/:token",middlewares.verifymail);
app.use(express.static(__dirname + "/images"));
app.use(express.static(__dirname + "/css"));
app.use(express.static(__dirname + "/javascript"));
app.use(express.static(__dirname + "/Data_files/product_images"));


app.listen(port, () => { console.log(`You are running on port no:${port}`) })