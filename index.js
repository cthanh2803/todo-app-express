const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const app_common = {
  db: null,
};


const PORT = process.env.PORT || 3000;

// PORT=5000 node index.js // -e PORT=5000
// mongodb+srv://dbUser:dbUserPass@cluster0.ohymx.mongodb.net/todo_app_express?retryWrites=true&w=majority


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// URL Convention Restful API
// GET /todos?page=1&limit=10 (list todo objects)
// GET /todos/:id (get a todo object by id)
// PUT /todos/:id (update a todo object by id)
// DELETE /todos/:id (delete a todo object by id)
// POST /todos (create a new todo)
// CRUD APIs

// Ex: POST /users/:id/like
// Ex: PUT /cart/payment
// Ex: // GET /todos/:id/comments (get comments of a todo object)

// Handlers/modules/todo/index.js
// Handlers/modules/todo/create.js
// Handlers/modules/todo/update.js


// Client Web (SEO) <--html--->  Web Server (Redering Side) <--- data json ---> API
// Client Mobile <--- data json ---> API
// Client Web (ReactJS / VueJS) PWA  <--- data json ---> API

// JSON Format
/*
res.status(400).json(err obj)
Error:
{
    "code": "ErrAccessTokenInactivated",
    "log": "Token is inactive because it is malformed, expired or otherwise invalid",
    "status_code": 401,
    "message": "access token is disabled"
}

Success:
{
    "code": 200,
    "data": Object | Array
    "paging": {
      "page": 1,
      "limit": 10,
      "total": 100,
    }
}
*/

// Next step:
// 1. Use mysql
// 2. Todo, Category, User (JWT, avatar)
// 3. Restful API
// 4. Files & Folders

// Connect MongoDB Cloud
const uri = process.env.DBURL;
const client = new MongoClient(uri, { useUnifiedTopology: true });
client.connect(err => {
  const db = client.db("todo_app_express").collection("todos");  
  app.listen(3001, function(){
    console.log("Connected MongoDB Cloud");
  });

  // GET
  app.get('/', (req, res) => {
    db.find().toArray((err, results) => {
      if (err) return console.log("Error: "+ err);
      res.render('index.ejs', { todos: results });
    });
  });

  // POST
  app.post('/show', (req, res) => {
    db.insertOne(req.body, (err, result) => {
      if (err) return console.log("Error: " + err);
      console.log("Successfully saved on the DB!");
      res.redirect('/');
      db.find().toArray((err, results) => {
        console.log(results);
      });
    });
  });

  //EDIT
  var ObjectId = require('mongodb').ObjectID;
  app.route('/edit/:id')
  .get((req,res) => {
    var id = req.params.id;
    db.find(ObjectId(id)).toArray((err, result) => {
      if (err) return console.log("Error: " + err);
      res.render('edit.ejs', { todos: result });
    });
  })
  .post((req,res) => {
    var id = req.params.id;
    var title = req.body.title;
    db.updateOne({_id: ObjectId(id)}, {
      $set: {
        title: title
      }
    }, (err, result) => {
      if (err) return res.send(err);
      res.redirect('/');
      console.log("Successfully Updated!");
    })
  });

  // DELETE
  app.route('/delete/:id')
  .get((req,res) => {
    var id = req.params.id;
    db.deleteOne({_id: ObjectId(id)}, (err, result) => {
      if (err) return res.send(500, err);
      console.log("Delete sucessfully!");
      res.redirect('back');
    });
  });
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});


// Learning process:
// Try it (tutorial)
// Learn it -> research it
// Looking for References
// Remake (Improve/Refactor it)
