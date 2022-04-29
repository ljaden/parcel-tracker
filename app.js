const f = require('./function/getData')

require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose')
const moment = require('moment')

const app = express();
app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));

// connect to database
// mongoose.connect('mongodb://localhost:27017/trackerDB')
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
  .get(async(req,res) => { // GET
    const data = await Package.find({})
    
    res.render('index',{data:data})
  })
  .post(async(req,res) => { // POST
    const trackingNum = req.body.trackingNumber.split(' ')
    // console.log('list: ',trackingNum)
    
    for(let i=0;i<trackingNum.length;i++){

      await f.getData(trackingNum[i]).then(value => {
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
              time:moment().format() //ust
            }],
          },
          {upsert:true},
          () => console.log(`Error: ${trackingNum[i]}`))
      })
    }
    res.redirect('/')
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

app.listen((process.env.PORT || 3000),() =>{
  console.log(`Port: ${port}`)
})