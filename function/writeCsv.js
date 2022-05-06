const { table } = require('console');
const fs = require('fs');
const tabletojson = require('tabletojson').Tabletojson;

module.exports = {
  writeCsv: async function createCsv(){
    let htmlTable;

    const tableHeader = '#,Tracking_Num,Status,Date,Message'
    fs.writeFile('./download/data.csv',tableHeader,(err) => {
      if(err) return console.log(err);
    })

    await tabletojson.convertUrl(
      'https://parcel-tracker.up.railway.app/',
      (tabletojson) => {
        htmlTable = tabletojson[0]
      })

      for (let i in htmlTable) {
        if(htmlTable[i]['#'] >= 0){
          const _str = `\n${htmlTable[i]['#']},${htmlTable[i]['Tracking #']},${htmlTable[i].Status},${htmlTable[i].Date},${htmlTable[i].Message}`

          fs.appendFile('./download/data.csv',_str,(err) => {
            if(err) return console.log(err);
            console.log('done!')
          })
        }
      }
  }
}