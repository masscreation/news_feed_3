var express = require('express');
var bodyParser = require('body-parser');
var pg = require("pg");
var methodOverride = require("method-override");

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//Tell app to use methodOverride
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/assets'));


// Refactor connection and query code
var db = require("./models");

// Show index of articles
app.get('/articles', function(req, res) {

  	db.Article.findAll().then(function(articles) {
  		res.render('articles/index', { articlesList: articles });
	}); 
});

// Render a form for creating an article
app.get('/articles/new', function(req, res) {
  res.render('articles/new');
});

// Create an article
app.post('/articles', function(req, res) {
  var title = req.body.title;
  var author = req.body.author; 
  var content = req.body.content;
  console.log(req.body);
  db.Article.create({title: title, author: author, content: content})
  	.then(function(article) {
  		res.redirect('articles', {articlesList: article}); 
  }); 

});

// Show an article
app.get('/articles/:id', function(req, res) {
  var id = req.params.id;

  db.Article.find(id).then(function(articleToDisplay) {
  	console.log(req.body);
  	res.render('articles/article', {articleToDisplay: articleToDisplay})
  	
  }); 
  
}); 

// Render page to edit an article
app.get('/articles/:id/edit', function(req, res) {
	var id = req.params.id; 

	db.Article.find(id).then(function(article) {
  	res.render('articles/edit', {article: article})
  }); 

}); 

// Update an article
// app.patch('/articles/:id', function(req, res) {
// 	console.log(req.body);
//   var id = req.params.id; 
//   var article = req.body.article; 

//   db.Article.find(id)
//   .then(function(dbArticle) {
//   	dbArticle.updateAttributes({
//   		title: req.body.article.title,
//   		author: req.body.article.author,
//   		content: req.body.article.content
//   	})
//   	.then(function(newArticle) {
//   		res.redirect('articles/' + newArticle.id); 
//   }) 
//   })

// });
app.put("/articles/:id", function(req, res) {
    db.Article.find(req.params.id)
        .then(function (article) {
            console.log(article);
            article.updateAttributes({
                title: req.body.title,
                content: req.body.content,
                author: req.body.author
            })
            .then(function (article) {
                res.redirect("/articles/" + article.id);
            })
        })
});

// Delete an article
app.delete('/articles/:id', function(req, res) {
	var articleId = req.params.id;
  	db.Article.find(articleId).then(function(article){
    	article.destroy().then(function() {
          res.redirect('/articles');
    	});
  	});
}); 


//Set root to site/index.ejs
app.get('/', function(req,res) {
  res.render('site/index.ejs');
});

// About page
app.get('/about', function(req,res) {
  res.render('site/about');
});

// Contact page
app.get('/contact', function(req,res) {
  res.render('site/contact');
});

app.listen(8000, function() {
  console.log('Listening on port 8000');
});
