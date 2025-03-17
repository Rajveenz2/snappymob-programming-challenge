var fs = require('fs')
var _ = require('lodash')

var contentArr = []
var evaluatedArr = []

// evaluator object to chain the methods
var evaluator = {
  type: null,
  evaluatee: null,
  result: null,

  isAlphaNumeric: function(str) {
    var evaluatee = this.evaluatee = (!str) ? this.evaluatee.trim() : str.trim()
    var code, i, len;

    for (i = 0, len = evaluatee.length; i < len; i++) {
      code = evaluatee.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)

        return this
      }
    }
    this.type = 'alphanumeric'
    this.result = evaluatee + ' - ' + this.type
    return this
  },

  isInteger: function(str) {
    var evaluatee = this.evaluatee = (!str) ? this.evaluatee : str
    var isInt = evaluatee % 1 === 0;

    if (isInt) {
      this.type = 'integer'
      this.result = evaluatee + ' - ' + this.type
      return this
    } else {
      return this
    }
  },

  isRealNumber: function(str) {
    var evaluatee = this.evaluatee = (!str) ? this.evaluatee : str
    if (!isNaN(parseFloat(evaluatee)) && isFinite(evaluatee)) {
      this.type = 'real numbers'
      this.result = evaluatee + ' - ' + this.type
      return this
    } else {
      return this
    }
  },

  isAlphabeticString: function(str) {
    var evaluatee = this.evaluatee = (!str) ? this.evaluatee : str
    var alphabetical = /^[a-zA-Z()]+$/.test(evaluatee)
    if (alphabetical) {
      this.type = 'alphabetical strings'
      this.result = evaluatee + ' - ' + this.type
      return this
    } else {
      return this
    }
  }
}

fs.readFile('./output/output.txt', 'utf8', function(err, content) {
  if (err) throw console.error('Error reading output', err);

  contentArr = content.split(',')

  _.forEach(contentArr, function(item) {
    var result = evaluator.isAlphaNumeric(item.trim()).isAlphabeticString().isRealNumber().isInteger()
    if (result.result) {
      evaluatedArr.push(result.result)
      console.log(result.result)
    } else {
      console.log('Invalid result for item:', item);
    }
  })

  // Debugging log to inspect evaluatedArr before writing
  // console.log('Evaluated Array:', evaluatedArr);

  // Updated line to join the array into a string
  fs.writeFile('./output/result.txt', evaluatedArr.join('\n'), function(err) {
    if (err) throw console.error('Error writing evaluation', err);
    console.log('It\'s evaluated in /output/result.txt!')
  })
})
