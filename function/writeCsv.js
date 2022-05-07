const { table, Console } = require('console');
const fs = require('fs');
const tabletojson = require('tabletojson').Tabletojson;

module.exports = {
  getCsv: async function getCsv(){
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