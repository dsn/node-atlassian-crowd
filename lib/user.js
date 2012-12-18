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
      if (res.link) delete res.link;
      if (res.expand) delete res.expand;
      if (res.attributes) delete res.attributes;
      if (res.password) delete res.password;
      callback(null, res);
    }
  });
};

module.exports.create = function (firstname, lastname, displayname, email, username, password, callback) {
  var libxmljs = require('libxmljs');
  var payload = libxmljs.Document();

  payload.node('user').attr('name', username)
    .node('first-name', firstname).parent()
    .node('last-name', lastname).parent()
    .node('display-name', displayname).parent()
    .node('email', email).parent()
    .node('active', "true").parent()
    .node('password').node('value', password).parent();

  var options = {
    method: "POST",
    payload: payload.toString(),
    path: "/crowd/rest/usermanagement/latest/user"
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
  var libxmljs = require('libxmljs');
  var payload = libxmljs.Document();
  payload.node('password').node('value', password);

  var options = {
    "method": "PUT",
    "payload": payload.toString(),
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
  var libxmljs = require('libxmljs');
  var payload = libxmljs.Document();
  payload.node("password").node("value", password);

  var options = {
    method: "POST",
    payload: payload.toString(),
    path: "/crowd/rest/usermanagement/latest/authentication?username=" + username
  };

  _doRequest(options, function (err, res) {
    return callback(err, res);
  });
};
