var Promise = require('promise');
var https = require('https');
var Utils = require('./utils.js');
var Cert = require('./certificate.js');
var url = require('url');
const config = require('./config');
const monitoredHosts = require('./monitored-hosts.js');

function getCertificationData() {
  var promises = [];

  for (var i = 0; i < monitoredHosts.length; ++i) {
    var host = monitoredHosts[i];
    promises.push(_getRequestPromise(host));
  }

  return new Promise(function (resolve, reject) {
    Promise.all(promises).then(function (values) {
      var data = {};
      for (var i = 0; i < values.length; i++) {
        var index = i + 1;
        data[index] = values[i];
      }

      var responseData = {
        certInfo: JSON.stringify(data),
        headerBackground: Utils.findWorstStatus(values),
        runDate: new Date().toDateString()
      };

      resolve(responseData);
    });
  });
}

function _getRequestPromise(host) {
  return new Promise(function (resolve, reject) {
    var hostname = host;
    var port = 443;
    var path = null;
    var query = null;

    if (host.indexOf(":") != -1 || host.indexOf("/") != -1) {
      hostname = url.parse(host).hostname;
      port = url.parse(host).port || port;
      path = url.parse(host).path || path;
      query = url.parse(host).query || query;
    }

    console.log("host: " + hostname + " port: " + port + " path: " + path + " query: " + query);

    var req = https.request({
        hostname: hostname,
        port: port,
        path: path,
        query: query,
        method: 'GET',
        agent: false
      },
      function (res) {
        var cert = res.connection.getPeerCertificate();
        Utils.log(true, host);
        var certificateInfo = Cert.getSuccess(hostname, cert);
        this.abort();
        resolve(certificateInfo);
      });
    req.end();
    req.setTimeout(config.connectionTimeout);

    req.on('timeout', function (err) {
      Utils.log(false, hostname + " request timed out");
      var res = Cert.getTimeout(hostname, err);
      this.abort();
      resolve(res);
    });

    req.on('error', function (e) {
      var res = Cert.getError(hostname, e);
      this.abort();
      resolve(res);
    });
  });
}

module.exports = {
  getCertificationData: getCertificationData
};