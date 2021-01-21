// Require Libraries
const express = require('express');
const http = require("http")
// Load environment variables into process.env
const dotenv = require("dotenv");
dotenv.config();
const apikey = process.env.TENORJS_API_KEY
const Tenor = require("tenorjs").client({
  "Key": process.env.TENORJS_API_KEY,
  "Filter": "high", 
  "Locale": "en_US", 
});

// App Setup
const app = express();

// Middleware
const exphbs  = require('express-handlebars');
// template engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));
// ROUTES
app.get('/', (req, res) => {
  // Handle the home page when we haven't queried yet
  term = ""

  if (req.query.term) {
      term = req.query.term
  }
  // Tenor.search.Query("SEARCH KEYWORD HERE", "LIMIT HERE")
  Tenor.Search.Query(term, "10")
      .then(response => {
          // store the gifs we get back from the search
          const gifs = response;
          // pass the gifs as an object into the home page
          res.render('home', { gifs })
      }).catch(console.error);
})
app.get('/greetings/:name', (req, res) => {
  // grab the name from the path provided
  const name = req.params.name;
  // render the greetings view, passing along the name
  res.render('greetings', { name });
})

// Start Server

app.listen(3000, () => {
  console.log('Gif Search listening on port localhost:3000!');
});