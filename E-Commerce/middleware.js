const express = require('express');
const fs = require('fs');
const app = express()
const session = require('express-session');
const mailjet = require('node-mailjet').apiConnect(
    'ed4864c1bfaa9f4def636d4e34b6ef9d', 'd283715c82e7059aeaef312065bbd351'
)

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

    toIndex: function (req, res) {
        if (req.session.islogin) {
            res.render('home', { login: true });
        }
        else
            res.render('index');
    },

    home: (req, res) => {
        if (req.session.islogin && req.session.isVerified) {
            res.render('home', { login: true });
        } else if (req.session.islogin)
            res.render('verify');
        else {
            res.render('home', { login: false });
        }
    },

    skip: (req, res) => {
        res.redirect('/home')
    },

    authenticate: function (req, res) {
        fs.readFile(__dirname + '/Data_files/userdata.json', (err, data) => {
            data = JSON.parse(data);
            if (data.length == 0) { res.end(JSON.stringify({ flag: false })) }
            for (var i = 0; i < data.length; i++) {
                if (data[i].email === req.body.email && data[i].password === req.body.password) {
                    req.session.name = data[i].name;
                    req.session.islogin = true;
                    res.send({ flag: true });
                    return;
                }
            }
            res.end(JSON.stringify({ flag: false }));
        })
    },

    validate: (req, res) => {
        fs.readFile(__dirname + '/Data_files/userdata.json', (err, data) => {
            if (data.length == 0) {
                data = []
            } else {
                data = JSON.parse(data);
            }

            for (var i = 0; i < data.length; i++) {
                if (data[i].email === req.body.email) {
                    res.send({ flag: false });
                    return;
                }
            }
            var name = req.body.name;
            var email = req.body.email;
            var password = req.body.password;
            var email_token = Date.now();
            var isVerified = false;
            req.session.islogin = true;
            SendMail(email, email_token, name, (err, data) => {
                if (data) {
                    fs.readFile(__dirname + '/Data_files/userdata.json', (err, data) => {
                        if (data.length == 0) {
                            data = [];
                        }
                        else
                            data = JSON.parse(data);
                        data.push({ name: name, email: email, password: password, isVerified: false, email_token: email_token });
                        req.session.name = req.body.name;
                        fs.writeFile(__dirname + '/Data_files/userdata.json', JSON.stringify(data), (err) => {
                            res.end(JSON.stringify({ flag: true }));
                        })

                    })

                }
                else if (err) {
                    res.render("index");
                }
            })

        })
    },

    addproduct: (req, res) => {
        fs.readFile(__dirname + '/Data_files/products.json', (err, data) => {
            let products;
            if (data.length == 0) {
                products = []
            }
            else {
                products = JSON.parse(data);
            }
            console.log(req.body, req.file);

            var name = req.body.name;
            var description = req.body.description;
            var id = req.body.id;
            var src = req.file.filename;

            products.push({ name: name, description: description, src: src, id: id });
            fs.writeFile(__dirname + '/Data_files/products.json', JSON.stringify(products),
                (err) => {
                    res.end(JSON.stringify({ flag: true }));
                })
        })
    },

    admin: (req, res) => {
        res.render('admin.ejs');
    },

    getProducts: (req, res) => {
        fs.readFile(__dirname + "/Data_files/products.json", (err, data) => {
            if (data.length != 0)
                res.send(JSON.stringify(JSON.parse(data)));
            else
                res.send();
        })
    }
    ,
    logout: (req, res) => {
        req.session.destroy();
        res.redirect("/");
    },

    verifymail: (req, res) => {
        const { token } = req.params;
        fs.readFile(__direname + "userdata.json", (err, data) => {
            if (data.length > 0) {
                data = JSON.parse(data);
            }
            for (var i = 0; i < data.length; i++) {
                let user = data[i];
                if (user.email_token === token) {
                    if (req.session) {
                        req.session.isVerified = true;
                    }

                    else {
                        req.session.islogin = true;
                        req.session.name = user.name;
                        req.session.isVerified = true;
                    }

                    user.isVerified = true;
                    data[i] = user;
                    break;
                }
            }
            fs.writeFile(__dirname + "userdata.json", JSON.stringify(data), (err) => {
                res.redirect('/home');
            })
        })
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
                    `<h3>Dear ${name} , welcome to Healthifyy!</h3><br />Verify Mail by clicking <a href="https://e-commerce-fork-3p34g81k5uyle2op5r5.codequotient.in/verifymail/${token}">Verify</a>`,
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