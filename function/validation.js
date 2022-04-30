/* 
validates if the input String is a vaild UPS tracking number. requirments: 
  I. Begins with '1Z'
  II. 18 characters in length
  III. Contains only numbers[0-9] or letters[A-Z]
*/
module.exports = {
  validate: function validate(ups){
    const regex = /^1Z[0-9A-Z]{16}/
    const result = ups.match(regex) //return array of str that match
    if(result){
      return result
    }
  }
}