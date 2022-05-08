const track = require('delivery-tracker');
const courier = track.courier(track.COURIER.UPS.CODE);

const { table, Console } = require('console');
const fs = require('fs');
const tabletojson = require('tabletojson').Tabletojson;


module.exports = {
  // takes UPS tracking# as an argument and return data as JSON
  getData: function(trackingNum){
    return new Promise((resolve,reject) => {
      courier.trace(trackingNum,(e,r) => {
        if(!e){
          resolve(r)
        }else {
          reject(`ERROR ${trackingNum}`)
        }
      })
    })
  },
  /* 
  validates if the input String is a vaild UPS tracking number. requirments: 
    I. Begins with '1Z'
    II. 18 characters in length
    III. Contains only numbers[0-9] or letters[A-Z]
  */
  validate: function(ups){
    const regex = /^1Z[0-9A-Z]{16}/
    const result = ups.match(regex) //return array of str that match
    if(result){
      return result
    }
  },
  // Collects HTML table data and return as String
  getTable: async function(){
    let htmlTable;
    let _str = '#,Tracking_num,Status,Date,Message';

    await tabletojson.convertUrl(
      'https://parcel-tracker.up.railway.app/',
      (tabletojson) => {
        htmlTable = tabletojson[0]
      })
    
      for (let i in htmlTable) {
        if(htmlTable[i]['#'] >= 0){
          _str += `\n${htmlTable[i]['#']},${htmlTable[i]['Tracking #']},${htmlTable[i].Status},${htmlTable[i].Date},${htmlTable[i].Message}`
        }
      }
    return _str
  }
}