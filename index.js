require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const _ = require('lodash');

// const {mongoose} = require('./db/mongoose');
// const {Users} = require('./models/users');
// const {sendmail} = require('./js/sendmail');
// const {serverRunning} = require('./js/serverRunning');
// const {uploadCloudinary} = require('./js/cloudinary');

var app = express();
var port = process.env.PORT || 3000;
app.use(express.static(__dirname+'/static'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine','hbs');


app.get('/',(req,res) => {
  console.log('home page opened');
  res.render('index.hbs');
});

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
})
