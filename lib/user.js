module.exports.find = function (username, callback) {
  var options = {
    method: "GET",
    path: "/user?username=" + username
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

module.exports.findWithAttributes = function (username, callback) {
  var options = {
    method: "GET",
    path: "/user?username=" + username + "&expand=attributes"
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

module.exports.getAttributes = function (username, callback) {
  var options = {
    method: "GET",
    path: "/user/attribute?username=" + username
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

module.exports.postAttributes = function (username, attributes, callback) {
  // attributes param should be an array of json objects with following format:
  //  {
  //    "name" : "attributeName",
  //    "values" : [ "arrayOfArbitraryValues" ]
  //  }
  var payload = {
    "attributes": attributes
  };

  var options = {
    "method": "POST",
    "data": JSON.stringify(payload),
    "path": "/user/attribute?username=" + username
  };

  _doRequest(options, function(err, res) {
    if (err) {
      return callback(err);
    } else {
      var error;
      if (res === 204) {
        return callback(null);
      } if (res === 404) {
        error = new Error("User could not be found in Crowd");
        error.type = "NOT_FOUND";
        return callback(error);
      } else {
        error = new Error("Invalid Response from Atlassian Crowd");
        error.type = "INVALID_RESPONSE";
        return callback(error);
      }
    }
  });
};

module.exports.deleteAttribute = function (username, attributeName, callback) {

  console.log(username, attributeName);
  var options = {
    method: "DELETE",
    path: "/user/attribute?username=" + username + "&attributename=" + attributeName
  };

  _doRequest(options, function(err, res) {
    if (err) {
      return callback(err);
    } else {
      var error;
      if (res === 204) {
        return callback(null);
      } if (res === 404) {
        error = new Error("User or Attribute could not be found in Crowd");
        error.type = "NOT_FOUND";
        return callback(error);
      } else {
        error = new Error("Invalid Response from Atlassian Crowd");
        error.type = "INVALID_RESPONSE";
        return callback(error);
      }
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
    "path": "/user"
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
       return callback(error);
     }
    }
  });
};

module.exports.remove = function (username, callback) {

  var options = {
    method: "DELETE",
    path: "/user?username=" + username
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
        return callback(error);
      }
    }
  });
};

module.exports.changepassword = function (username, password, callback) {
  var payload = { "value": password };

  var options = {
    "method": "PUT",
    "data": JSON.stringify(payload),
    "path": "/user/password?username=" + username
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
    path: "/user/group/nested?username=" + username
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
  };

  var options = {
    method: "POST",
    data: JSON.stringify(payload),
    path: "/authentication?username=" + username
  };

  _doRequest(options, function (err, res) {
    return callback(err, res);
  });
};
