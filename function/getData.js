const track = require('delivery-tracker');
const courier = track.courier(track.COURIER.UPS.CODE);

module.exports = {
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
  }
}