function validationFactors(remote_address) {
  return {
    "validationFactors": [{
      "name": "remote_address",
      "value": remote_address || "127.0.0.1"
    }]
  };
}

module.exports.create = function (username, password, remote_address, callback) {
//  var libxmljs = require('libxmljs');
//  var payload = new libxmljs.Document();
//  payload.node("authentication-context")
//    .node("username", username).parent()
//    .node("password", password).parent()
//    .node("validation-factors")
//    .node("validation-factor")
//    .node("name", "remote_address").parent()
//    .node("value", "127.0.0.1");

  var payload = {
    "username": username,
    "password": password, 
    "validation-factors": validationFactors(remote_address)
  };

  var options = {
    "method": "POST",
    "data": JSON.stringify(payload),
    "path": "/crowd/rest/usermanagement/latest/session"
  };

  _doRequest(options, function (err, res) {
    if(err) {
      return callback(err);
    }
    else {
      return callback(null, res.token);
    }
  });
};

module.exports.find = function (token, callback) {
  var options = {
    method: "GET",
    path: "/crowd/rest/usermanagement/latest/session/" + token
  };

  _doRequest(options, function (err, res) {
    return callback(err, res);
  });
};

module.exports.authenticate = function (token, remote_address, callback) {
//  var libxmljs = require('libxmljs');
//  var payload = new libxmljs.Document();
//  payload.node('validation-factors')
//    .node('validation-factor')
//    .node('name', 'remote_address').parent()
//    .node('value', '127.0.0.1');

  var payload = validationFactors(remote_address);

  var options = {
    "method": "POST",
    "data": JSON.stringify(payload),
    "path": "/crowd/rest/usermanagement/latest/session/" + token
  };

  _doRequest(options, function (err, res) {
    return callback(err, res);
  });
};

module.exports.destroy = function (token, callback) {
  var options = {
    "method": "DELETE",
    "path": "/crowd/rest/usermanagement/latest/session/" + token
  };

  _doRequest(options, function (err, res) {
    return callback(err, res);
  });
};
