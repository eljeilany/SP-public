//var data = require('./convertcsv2.json');
var fs = require('fs');
//var striptags = require('striptags');
var Converter = require("csvtojson").Converter;
var converter = new Converter({
  constructResult:false,
  delimiter:','
});
var converter2 = new Converter({
  delimiter:','
});
function parsecsv(name,callb){
  var contents = fs.readFileSync(name).toString();
  console.log(contents.length);
  contents = contents.split('\n')
  console.log(contents.length);
  data = []
  head  = contents[0].split(",")
  for (var i = 1; i < contents.length; i++) {

    var temp = contents[i].split(",")
    var doc = {}
    for (var j = 0; j < temp.length; j++) {
      if(isNaN(temp[j])) doc[head[j]] = temp[j]
      else doc[head[j]] = Number(temp[j])
    }
    data.push(doc)
    if(i == 10) console.log(data);
    if(i == 10) console.log("----");
  }
  callb(null,data)
}
/**
{
  "refproduit": 702301,
  "categorieenseigne": "",
  "nomproduit": "Timotei shampooing délice bio vitalité et éclat 180ml ",
  "pppackaging": "180ML"
}
**/

var start = process.hrtime();

var elapsed_time = function(note){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    return (process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time
    // start = process.hrtime(); // reset the timer
}

function daydiff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
}
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
// var contents = fs.readFileSync('F_SalesTransactions_01_02-R.csv').toString();
// console.log("content L:"+contents.length);
parsecsv('F_SalesTransactions_01_02-R.csv',function(err,data){
  var result = []
  var p =0
  var n = 0
  var it = 0
  var result = {}
  var ptoSub = {}
  dates = {}
  if(err) console.log(err);
  console.log("loaded one: " + data.length);
  converter2.fromFile("./F_Products_01_01-R.csv",function(err,dataP){
    for (var i = 0; i < dataP.length; i++) {
      ptoSub[dataP[i].UB_KEY] = dataP[i].HYP_SUB_CLASS_DESC
    }
    var mindate = new Date('2018-01-28');
    for (var i = 0; i < data.length; i++) {
      if ( !data[i]) {
        console.log('undef ',i);
        continue
      }
      if (typeof data[i].TRX_DATETIME === "undefined") {
        console.log('undef TRX_DATETIME ',i);
        continue
      }
      if (!(data[i].STORE_DESC in result)) result[data[i].STORE_DESC] = {}
      if (!(ptoSub[data[i].UB_KEY] in result[data[i].STORE_DESC])) result[data[i].STORE_DESC][ptoSub[data[i].UB_KEY]] = {}
      data[i].TRX_DATETIME = data[i].TRX_DATETIME.split(" ")[0]
      if (mindate > new Date(data[i].TRX_DATETIME)) {
        mindate = new Date(data[i].TRX_DATETIME)

      }
      if(!result[data[i].STORE_DESC][ptoSub[data[i].UB_KEY]][data[i].TRX_DATETIME]) result[data[i].STORE_DESC][ptoSub[data[i].UB_KEY]][data[i].TRX_DATETIME] = data[i].SAL_UNIT_QTY_WEIGHT
      else result[data[i].STORE_DESC][ptoSub[data[i].UB_KEY]][data[i].TRX_DATETIME] += data[i].SAL_UNIT_QTY_WEIGHT
    }
    console.log(mindate);
    for(store in result){
      for (sub_c in result[store]) {
        array = []

        for(date in result[store][sub_c]){
          array[daydiff(mindate,new Date(date) )] = result[store][sub_c][date]
        }
        datatxt = ""
        for (var i = 0; i < array.length; i++) {
          date = addDays(mindate,i)
          datatxt += i + ","+(array[i] || 0)+","+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" \n"
        }
        fs.writeFileSync((((store+"_"+sub_c).split("/").join("-")).split(".").join("")).split(" ").join("_") +'.csv',datatxt)
      }
    }


  })


});


//fs.writeFileSync('./data.json', result , 'utf-8');
