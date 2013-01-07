module.exports.create = function (username, password, remote_addr, callback) {

  if(typeof(remote_addr) === "function") {
    callback = remote_addr;
    remote_addr = "127.0.0.1";
  }

  var payload = {
    "username": username,
    "password": password, 
    "validation-factors": {
      "validationFactors": [{
        "name": "remote_address",
        "value": remote_addr
      }]
    }
  };

  var options = {
    "method": "POST",
    "data": JSON.stringify(payload),
    "path": "/session"
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
    path: "/session/" + token
  };

  _doRequest(options, function (err, res) {
    return callback(err, res);
  });
};

module.exports.authenticate = function (token, remote_addr, callback) {
  if(typeof(remote_addr) === "function") {
    callback = remote_addr;
    remote_addr = "127.0.0.1";
  }

  var payload = {
    "validationFactors" : [{
      "name" : "remote_address",
      "value" : remote_addr
    }]
  }; 

  var options = {
    "method": "POST",
    "data": JSON.stringify(payload),
    "path": "/session/" + token
  };

  _doRequest(options, function (err, res) {
    return callback(err, res);
  });
};

module.exports.destroy = function (token, callback) {
  var options = {
    "method": "DELETE",
    "path": "/session/" + token
  };

  _doRequest(options, function (err, res) {
    return callback(err, res);
  });
};
