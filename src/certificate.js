var Utils = require('./utils.js');
const config = require('./config');
const monitoredHosts = require('./monitored-hosts.js');


function getError(hostname, e) {
  var parsed = newCert(hostname);

  if (e.hasOwnProperty('code')) {
    switch (e.code) {
      case 'CERT_HAS_EXPIRED':
        Utils.log(false, hostname + ' certificate expired.');
        parsed.subject.common_name = 'The certificate has expired';
        parsed.issuer.common_name = e.code;
        parsed.info.days_left = '0';
        parsed.info.background_class = 'danger';
        break;
      case 'ECONNRESET':
        Utils.log(false, hostname + ' connection timed out or was reset.');
        parsed.subject.common_name = 'The connection was reset by the server or timed out';
        parsed.issuer.common_name = e.code;
        parsed.info.background_class = 'danger';
        break;
      case 'ECONNREFUSED':
        Utils.log(false, hostname + ' connection refused by server.');
        parsed.subject.common_name = 'The connection was refused by the remote server';
        parsed.issuer.common_name = e.code;
        parsed.info.background_class = 'danger';
        break;
      case 'UNABLE_TO_VERIFY_LEAF_SIGNATURE':
        Utils.log(false, hostname + ' self-signed or incomplete certificate chain.');
        parsed.subject.common_name = 'The server provided a self-signed certificate or the provided certificate chain was incomplete';
        parsed.issuer.common_name = e.code;
        parsed.info.background_class = 'danger';
        break;
      case 'ENOTFOUND':
        Utils.log(false, hostname + ' domain name not found.');
        parsed.subject.common_name = 'The domain name was not found.';
        parsed.issuer.common_name = e.code;
        parsed.info.background_class = 'danger';
        break;
      default:
        Utils.log(false, hostname + ' unspecified error.');
        parsed.subject.common_name = 'An unspecified error occurred';
        parsed.issuer.common_name = e.code;
        parsed.info.background_class = 'danger';
        break;
    };

  } else if (e.hasOwnProperty('reason')) {
    switch (e.reason) {
      default: Utils.log(false, hostname + ' hostname mismatch.');
      parsed.subject.common_name = 'There was mismatch between the requested hostname and the certificate presented by the server';
      parsed.issuer.common_name = 'HOSTNAME_MISMATCH';
      parsed.info.background_class = 'danger';
      break;
    }
  }
  return parsed;
}

function getTimeout(hostname, e) {
  var res = newCert(hostname);
  res.subject.common_name = 'Request timeout';
  res.issuer.common_name = "TIMEOUT";
  res.info.sort_order = 0;
  res.info.background_class = 'info';
  return res;
}

function getSuccess(host, certificate) {
  var parsed = newCert(host);
  parsed.subject = {
    'org': certificate.subject ? certificate.subject.O : '-',
    'common_name': certificate.subject ? certificate.subject.CN : '-',
    'sans': certificate.subjectaltname ? certificate.subjectaltname : '-'
  };

  parsed.issuer = {
    'org': certificate.issuer ? certificate.issuer.O : '-',
    'common_name': certificate.issuer ? certificate.issuer.CN : '-'
  };

  parsed.info = {
    'days_left': certificate.valid_to ? Utils.getDaysLeft(certificate.valid_to) : '-',
    'sort_order': certificate.valid_to ? Utils.getDaysLeft(certificate.valid_to) : 0,
  };

  if (parsed.info.days_left <= config.days_left_danger) {
    parsed.info.background_class = 'danger';
  } else if (parsed.info.days_left > config.days_left_danger && parsed.info.days_left <= config.days_left_warning) {
    parsed.info.background_class = 'warning';
  } else {
    parsed.info.background_class = 'success';
  };
  return parsed;
}

function newCert(hostname) {
  return {
    'server': hostname,
    'subject': {
      'org': 'Unknown',
      'common_name': '',
      'sans': 'Unknown'
    },
    'issuer': {
      'org': 'Unknown',
      'common_name': ''
    },
    'info': {
      'days_left': '--',
      'sort_order': 0,
      'background_class': ''
    }
  };
}

module.exports = {
  getSuccess: getSuccess,
  getError: getError,
  getTimeout: getTimeout
};