module.exports.find = function (username, callback) {
  var options = {
    method: "GET",
    path: "/crowd/rest/usermanagement/latest/user?username=" + username
  };

  _doRequest(options, function(err, res) {
    if(err) {
      callback(err);
    }
    else {
      callback(null, res);
    }
  });
};

module.exports.create = function (firstname, lastname, displayname, email, username, password, callback) {
  var payload = {
    "name": username,
    "first-name": firstname,
    "last-name": lastname,
    "display-name": displayname,
    "email": email,
    "active": true,
    "password": {
      "value": password
    }
  };

  var options = {
    "method": "POST",
    "data": JSON.stringify(payload),
    "path": "/crowd/rest/usermanagement/latest/user"
  };

  _doRequest(options, function(err, res) {
    if(err) {
      return callback(err);
    }
    else {
     if(res === 201) {
       return callback(null);
     }
     else {
       var error = new Error("Invalid Response from Atlassian Crowd");
       error.type = "INVALID_RESPONSE";
       return callback(err);
     }
    }
  });
};

module.exports.remove = function (username, callback) {

  var options = {
    method: "DELETE",
    path: "/crowd/rest/usermanagement/latest/user?username=" + username
  };

  _doRequest(options, function(err, res) {
    if(err) {
      return callback(err);
    } 
    else {
      if(res === 204) {
        return callback(null);
      }
      else {
        var error = new Error("Invalid Response from Atlassian Crowd");
        error.type = "INVALID_RESPONSE";
        return callback(err);
      }
    }
  });
};

module.exports.changepassword = function (username, password, callback) {
  var payload = { "value": password };

  var options = {
    "method": "PUT",
    "data": JSON.stringify(payload),
    "path": "/crowd/rest/usermanagement/latest/user/password?username=" + username
  };

  _doRequest(options, function (err, res) {
    return callback(err, res);
  });
};

module.exports.active = function (username, callback) {
  this.find(username, function (err, res) {
    if(err) {
      return callback(err);  
    }
    else {
      if(res.active.toString() === "true") {
        return callback(null, true);
      }
      else {
        return callback(null, false);
      }
    }
  });
};

module.exports.groups = function (username, callback) {
  var groups = [];
  var options = {
    method: "GET",
    path: "/crowd/rest/usermanagement/latest/user/group/nested?username=" + username
  };

  _doRequest(options, function (err, res) {
    if(err) {
      return callback(err);
    }
    else {
      if(res.groups.length > 0) {
        res.groups.forEach(function(group) {
          groups.push(group.name);
        });
      }
      return callback(null, groups);
    }
  });
};

module.exports.authenticate = function (username, password, callback) {
  var payload = {
    "value": password
  }

  var options = {
    method: "POST",
    data: JSON.stringify(payload),
    path: "/crowd/rest/usermanagement/latest/authentication?username=" + username
  };

  _doRequest(options, function (err, res) {
    return callback(err, res);
  });
};
