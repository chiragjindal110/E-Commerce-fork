const express = require('express')
const app = express()
const fs = require('fs');
const port = 3000;
const multer = require('multer');
const upload = multer({dest: 'uploads/'})

app.use(express.static(__dirname));
app.use(express.json());

app.post('/store',upload.single('picname'), (req, res, next) => {
	fs.readFile(__dirname + '/data.txt', 'utf-8', function (err, data) {
		let todos;
		if (data.length == 0) {
			todos = [];
		}
		else {
			todos = JSON.parse(data);
		}
        console.log("req.file: ",req.file.path);
        req.body.src = req.file.path;
        console.log(req.body);
		todos.push(req.body);

		fs.writeFile(__dirname + '/data.txt', JSON.stringify(todos), function (err) {
			res.send(JSON.stringify(req.body));
		})
	})
})


app.post('/home', (req, res) => {
	fs.readFile(__dirname + '/data.txt', 'utf-8', function (err, data) {
		if (data)
			res.json(data);
		else
			res.json([]);
	})
})
app.post('/delete', (req, res) => {
	fs.readFile(__dirname + '/data.txt', 'utf-8', function (err, data) {
		var id = req.body.id;
		var temp = JSON.parse(data);
		for (var i = 0; i < temp.length; i++) {
			if (temp[i].id === id) { temp.splice(i, 1); break; }
		}
		fs.writeFile(__dirname + '/data.txt', JSON.stringify(temp), function (err) {
			res.end();
		})
	})
})

app.post('/update', (req, res) => {
	fs.readFile(__dirname + '/data.txt', 'utf-8', function (err, temp) {
		var id = req.body.id;
		temp = JSON.parse(temp);
		for (var i = 0; i < temp.length; i++) {
			if (temp[i].id === id) {
				temp[i].todo = req.body.update;
				break;
			}
		}
		fs.writeFile(__dirname + '/data.txt', JSON.stringify(temp), function (err) {
			res.end();
		})
	})
})

app.post('/complete', (req, res) => {
	fs.readFile(__dirname + '/data.txt', 'utf-8', function (err, temp) {
		var id = req.body.id ;
		temp = JSON.parse(temp);
        console.log("hiii");
        console.log(temp);
		for (var i = 0; i < temp.length; i++) {
			if (temp[i].id === id) {
				temp[i].isComplete = req.body.isComplete;
				break;
			}
		}
		fs.writeFile(__dirname + '/data.txt', JSON.stringify(temp), function (err) {
			res.end();
		})
	})
})


app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
