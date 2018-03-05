var express = require("express");
var bodyParser = require("body-parser");
var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;
 
var app = express();
var jsonParser = bodyParser.json();
var url = "mongodb://localhost:27017/books";
 
app.use(express.static(__dirname + "/public"));
app.get("/api/books", function(req, res){
      
    mongoClient.connect(url, function(err, db){
        db.collection("books").find({}).toArray(function(err, books){
            res.send(books)
            db.close();
        });
    });
});
app.get("/api/books/:id", function(req, res){
      
    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("books").findOne({_id: id}, function(err,book){
             
            if(err) return res.status(400).send();
             
            res.send(book);
            db.close();
        });
    });
});
 
app.post("/api/books", jsonParser, function (req, res) {
     
    if(!req.body) return res.sendStatus(400);
     
	var bookISBN = req.body.isbn;
	var bookAuthor = req.body.auth;
	var bookInit = req.body.init;
	var bookEdcode = req.body.edcode;
	var bookEditor = req.body.editor;
	var bookName = req.body.name;
	var bookNum = req.body.num; 
		
    var book = {isbn : bookISBN, auth : bookAuthor, init : bookInit, edcode: bookEdcode, editor: bookEditor, name : bookName, num : bookNum};
     
    mongoClient.connect(url, function(err, db){
        db.collection("books").insertOne(book, function(err, result){
             
            if(err) return res.status(400).send();
             
            res.send(book);
            db.close();
        });
    });
});
  
app.delete("/api/books/:id", function(req, res){
      
    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("books").findOneAndDelete({_id: id}, function(err, result){
             
            if(err) return res.status(400).send();
             
            var book = result.value;
            res.send(book);
            db.close();
        });
    });
});
 
app.put("/api/books", jsonParser, function(req, res){
      
    if(!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
	var bookISBN = req.body.isbn;
	var bookAuthor = req.body.auth;
	var bookInit = req.body.init;
	var bookEdcode = req.body.edcode;
	var bookEditor = req.body.editor;
	var bookName = req.body.name;
	var bookNum = req.body.num;
	 
    mongoClient.connect(url, function(err, db){
        db.collection("books").findOneAndUpdate({_id: id}, { $set: {isbn : bookISBN, auth : bookAuthor, init : bookInit, edcode : bookEdcode, editor : bookEditor, name : bookName, num : bookNum}},
             {returnOriginal: false },function(err, result){
             
            if(err) return res.status(400).send();
             
            var book = result.value;
            res.send(book);
            db.close();
        });
    });
});
  
app.listen(3000, function(){
    console.log("waiting for connection...");
});