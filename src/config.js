var connectionTimeout = process.env.CONNECTION_TIMEOUT;
var days_left_danger = process.env.DAYS_LEFT_DANGER;
var days_left_warning = process.env.DAYS_LEFT_WARNING;

var config = {
  connectionTimeout : connectionTimeout || 5000,
  days_left_danger : days_left_danger || 15,
  days_left_warning : days_left_warning || 30,
};

module.exports = config;
