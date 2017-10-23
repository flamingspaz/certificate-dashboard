function parseDate(dateString) {
  if(dateString == '' || dateString == null) { return null; }
  var date = new Date(Date.parse(dateString));
  return date;
};

function getDaysLeft(dateString) {
  var now = Date.now();
  var then = new Date(Date.parse(dateString));
  var daysLeft = Math.round((then - now)/86400000);
  return daysLeft;
};

function findWorstStatus(certList) {
      var dangers = certList.filter(function (element) {
        return element.info.background_class == 'danger';
      });
      var warnings = certList.filter(function (element) {
        return element.info.background_class == 'warning';
      });
      var infos = certList.filter(function (element) {
        return element.info.background_class == 'info';
      });

      if (dangers.length > 0) {
        return "danger";
      } else if (warnings.length > 0) {
        return "warning";
      } else if (infos.length > 0) {
        return "info";
      }
      return "success";
}
/**
 * Test function and used to write out
 */
function log(value, desc) {
  if (value) {
    console.log("\033[32m " + desc + "\033[0m");
  } else {
    console.log("\033[31m " + desc + "\033[0m");
  }
}

module.exports = {
  parseDate: parseDate,
  getDaysLeft: getDaysLeft,
  findWorstStatus: findWorstStatus,
  log: log
};
