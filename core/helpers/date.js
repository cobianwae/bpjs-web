var moment = require('moment');
var date = {};

var getIndonesianMonth = function(month) {
  switch (month) {
    case '01' :
      return 'Januari';
      break;
    case '02' :
      return 'Februari';
      break;
    case '03' :
      return 'Maret';
      break;
    case '04' :
      return 'April';
      break;
    case '05' :
      return 'Mei';
      break;
    case '06' :
      return 'Juni';
      break;
    case '07' :
      return 'Juli';
      break;
    case '08' :
      return 'Agustus';
      break;
    case '09' :
      return 'September';
      break;
    case '10' :
      return 'Oktober';
      break;
    case '11' :
      return 'November';
      break;
    case '12' :
      return 'Desember';
      break;

  };
}

date.parseDate = function(dateString){
  var match = /^(\d\d)\/(\d\d)\/(\d{4})/.exec(dateString);
  return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
};

date.getMonth = function(date){
  var abbMonth = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JULY', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC']
  return abbMonth[date.getMonth()];
}

date.toUKStringDate = function(date){
  var year = date.getFullYear();
  var month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1) + '';
  var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return day + '/' + month + '/' + year;
}

date.toDBDate = function(date){
  var year = date.getFullYear();
  var month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1) + '';
  var day = date.getDate();
  return year+ '-' + month + '-' + day;
}

date.toIndonesianDate = function(date){
  if(typeof date == 'string'){
    date = moment(date, 'DD/MM/YYYY').toDate();
  }
  var year = date.getFullYear();
  var month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1) + '';
  var day = date.getDate();

  var idnMonth = getIndonesianMonth(month);
  return day + ' ' + idnMonth + ' ' + year;
}

date.getMonthAndYearOnIndonesianDate = function(date) {
  if(typeof date == 'string'){
    date = moment(date, 'DD/MM/YYYY').toDate();
  }
  var year = date.getFullYear();
  var month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1) + '';

  var idnMonth = getIndonesianMonth(month);
  return idnMonth + ' ' + year;
}

date.getMonthOnIndonesianDate = function(date) {
  if(typeof date == 'string'){
    date = moment(date, 'DD/MM/YYYY').toDate();
  }

  var month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1) + '';
  var idnMonth = getIndonesianMonth(month);
  return idnMonth;
}

date.getFullYear = function(date){
  return date.getFullYear();
}

date.fromStringToIndonesianDate = function(date) {
  if(date !== undefined && date !== '' && date !== null) {
    var arrDate = date.split('/');
    if(arrDate.length === 3) {
      var year = arrDate[2]
      var month = arrDate[1]
      var day = arrDate[0];
      var idnMonth = getIndonesianMonth(month);
      return day + ' ' + idnMonth + ' ' + year;
    }
    
  }

  return date;  
}

module.exports = date;

