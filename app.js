require('dotenv').config()

// custom helper function
const helperFunction = require('./function/helpers')

// require 
const tabletojson = require('tabletojson').Tabletojson;
const fs = require('fs')
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose')
const moment = require('moment');
const { AsyncResource } = require('async_hooks');

// express
const app = express();
app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));

// connect to Atlas DB
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.KEY}@cluster0.mb1wr.mongodb.net/trackerDb`)

// schema
const packageSchema = new mongoose.Schema({
  tracking_number:String,
  status:String,
  days_ago:Number,
  checkpoints:Object
})
// model
const Package = mongoose.model('Package',packageSchema)


// root route
app.route('/')
  .get(async(req,res) => { // GETrs

    const data = await Package.find({})
    
    res.render('index',{data:data})
  })
  .post(async(req,res) => { // POST
    const listOfTrackers = req.body.trackingNumber.split(' ')
    // console.log('list: ',trackingNum)
    const trackingNum = listOfTrackers.filter(num => helperFunction.validate(num))

    for(let i=0;i<trackingNum.length;i++){

      await helperFunction.getData(trackingNum[i]).then(value => {
        Package.replaceOne({tracking_number:trackingNum[i]},
          {tracking_number:value.number,
            status:value.status,
            days_ago:moment().diff(moment(value.checkpoints[0].time.split('T')[0]),'days'),
            checkpoints: value.checkpoints
          },
        {upsert:true},
        ()=> console.log(`${i+1}/${trackingNum.length} Saved: ${value.number}`)) // --> {#/# Saved: tracking_num}
        // console.log(value)
      }).catch(error => {
        Package.replaceOne({tracking_number:trackingNum[i]},
          {tracking_number:trackingNum[i],
            status:'Invalid',
            days_ago:0,
            checkpoints: [{
              courier:{code:'ups',name:'UPS'},
              location:'N/A',
              message:'Invalid tracking number -- Please check for typos',
              status:'Invalid',
              time:moment().format() //utc
            }],
          },
          {upsert:true},
          () => console.log(`Error: ${trackingNum[i]}`))
      })
    }
    res.redirect('/')
  })

// downloads route
app.route('/download/data')
  .get(async(req,res) => {

    const data = await helperFunction.getTable()

    // writes data into csv 
    fs.writeFile('./download/data.csv',data,(err) => {
      if(!err){
        // download file
        res.download('download/data.csv',(err) => {
          if(err) res.status(404).send("<h1>File not found: 404</h1>")
        })
      }
    })
  })

// delete specific
app.route('/delete/:id')
  .get(async (req,res) => {
    const link = req.params.id
    
    await Package.deleteOne({tracking_number:link})
    res.redirect('/')
  })
// deleteall
app.route('/deleteall')
  .get(async (req,res) => {
    
    await Package.deleteMany({})
    res.redirect('/')
  })
const port = 3000
app.listen((process.env.PORT || port),() =>{
  console.log(`Port: ${port}`)
})