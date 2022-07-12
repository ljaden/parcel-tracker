const track = require("delivery-tracker");
const courier = track.courier(track.COURIER.UPS.CODE);
const moment = require("moment");
/*
  validates if the input String is a vaild UPS tracking number. requirments: 
    I. Begins with '1Z'
    II. 18 characters in length
    III. Contains only numbers[0-9] or letters[A-Z]
  */
function validate(ups) {
  const regex = /^1Z[0-9A-Z]{16}/;
  const result = ups.match(regex); //return array of str that match
  if (result) {
    return result;
  }
}
/* 
takes UPS tracking# as an argument and return data as JSON
*/
function fetchData(trackingNum) {
  return new Promise((resolve, reject) => {
    courier.trace(trackingNum, (e, r) => {
      if (!e) {
        resolve(r);
      } else {
        reject(`ERROR ${trackingNum}`);
      }
    });
  });
}
/*

*/
function getTimeDiff(time) {
  return moment().diff(moment(time.split("T")[0]), "days");
}

module.exports = {
  validate: validate,
  fetchData: fetchData,
  getTimeDiff: getTimeDiff,
};
