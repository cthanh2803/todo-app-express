const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Connect MongoDB Cloud
const uri = `mongodb+srv://dbUser:dbUserPass@cluster0.ohymx.mongodb.net/todo_app_express?retryWrites=true&w=majority`;
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
