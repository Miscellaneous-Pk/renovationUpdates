require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const _ = require('lodash');

const {sheet} = require('./server/sheets.js');

var app = express();
var port = process.env.PORT || 3000;
app.use(express.static(__dirname+'/static'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine','hbs');

// sheet('external','read');
// sheet('bunkers','read');
// sheet('construction','read');
// sheet('material','read');
// sheet('material','update',[
// [new Date().toString(),'MES','Sand','2000', 'cft','Brought it for const of Washroom']
// ]);


app.get('/',(req,res) => {
  console.log('home page opened');
  res.render('index.hbs');
});

app.get('/data',(req,res) => {
  console.log(req.body);
  res.status(200).send(req.body);
})

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
})
