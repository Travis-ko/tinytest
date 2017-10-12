var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('sbdkjbasjkbdjkasdhvhwd'));
//sets view engine to ejs
app.set('view engine', 'ejs');
var urlDatabase = {};

app.use((req, res, next) => {
    res.locals.username = req.cookies.username;
    console.log(req.cookies);
    return next();
});

function generateRandomString() {
    temp = Math.random().toString(36).replace(/[^a-z]+/g, '');
    return temp;
}

app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});

app.post("/login", (req, res) => {
    res.cookie('username', req.body.username);
    res.redirect("/urls");
});

app.post("/logout", (req, res) => {
   res.clearCookie(req.body.username);
   res.redirect("/urls");
 });

app.post("/urls", (req, res) => {
    var temp = generateRandomString();
    urlDatabase[temp] = req.body.longURL;
    //console.log(urlDatabase); // debug statement to see POST parameters
    res.redirect("http://localhost:8080/urls/" + temp); // Respond with 'Ok' (we will replace this)
});

app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
});

app.post("/urls/:url/delete", (req, res) => {
    delete urlDatabase[req.params.url];
    res.redirect("/urls");
});

app.get("/urls/:id", (req, res) => {
    let templateVars = {
        shortURL: req.params.id,
        longURL: urlDatabase[req.params.id]
    };
    res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
    urlDatabase[req.params.id] = req.body.longURL;
    //console.log(req.params.id);
    res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
    let longURL = urlDatabase[req.params.shortURL];
    //console.log(longURL);
    res.redirect(302, longURL);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});