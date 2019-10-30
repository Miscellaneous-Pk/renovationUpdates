require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const _ = require('lodash');
const moment = require('moment');
const readXlsxFile = require('read-excel-file/node');

const {sheet} = require('./server/sheets.js');

var app = express();
var port = process.env.PORT || 3000;
app.use(express.static(__dirname+'/static'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine','hbs');

hbs.registerHelper("fixText",function (text) {
  if (!text) return;
  console.log(typeof text);
  text = text.toString().trim().replace(/\r\n/g,'').split(';');
  text = text.reduce((total,val) => {
    return total + `<p>` + val + `<p>`;
  }, '')
  return text;
})

app.get('/',(req,res) => {

  console.log('home page opened');
  let dateToday = moment().format('YYYY-MM-DD');
  // THIS IS OFFICE DATA - NOW NOT IN USE
  // res.render('index.hbs',{
  //   dateToday,
  // });
  readXlsxFile(__dirname+'/server/life.xlsx').then((rows) => {
    let sorted = rows.map((val) =>
      val.reduce((total,inner,index) => {

        if (inner) Object.assign(total,{
          [rows[0][index]]: inner
        })
        return total;
      },{})
    )
    console.log(sorted);
    res.render('abasyn.hbs',{
      sorted,
    });
  });

});

app.get('/getSuggestions',(req,res) => {
  sheet('external','todayUpdates').then((msg)=> {
    res.status(200).send(msg);
  }).catch((e) => {
    console.log(e);
    res.status(400).send(e);
  });
});

app.get('/getOldData',(req,res) => {
  sheet('old','read').then((msg) => {
    res.status(200).send(msg);
  }).catch((e) => {
    console.log(e.response.status,e.response.statusText);
    res.status(400).send(e);
  });
})

app.post('/data',(req,res) => {
  // _.pick(req.body,['timestamp','date','loc','category','name','responsibility','work','quantity','unit','remarks']);
  let arr = req.body;
  if (arr.length != 10) return res.status(400).send('Please fill all the fields in the form.');
  sheet('external','update',[arr]).then((msg) => {
    return res.status(200).send(msg);
  }).catch((e) => {
    console.log(e);
    return res.status(400).send(e);
  })
});

app.post('/oldDataUpload',(req,res) => {
  // console.log(req.body);
  sheet('oldformatted','batchUpdate',req.body).then((msg) => {
    return res.status(200).send(msg);
  }).catch((e) => {
    console.log(e);
    res.status(400).send(e);
  })
});

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
