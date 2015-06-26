module.exports.find = function (group, callback) {
  var options = {
    method: "GET",
    path: "/group?groupname=" + group
  };

  _doRequest(options, function (err, res) {
    return callback(err, res);
  });
};

module.exports.active = function (group, callback) {
  this.find(group, function (err, res) {
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

module.exports.create = function (name, description, callback) {
  var payload = {
    "name": name,
    "type": "GROUP",
    "description": description,
    "active": true
  };

  var options = {
    "method": "POST",
    "data": JSON.stringify(payload),
    "path": "/group"
  };

  _doRequest(options, function(err, res) {
    return callback(err, res);
  });
};

module.exports.createNested = function (parentGroupName, name, description, callback) {
  var payload = {
    "name": name,
    "type": "GROUP",
    "description": description,
    "active": true
  };

  var options = {
    "method": "POST",
    "data": JSON.stringify(payload),
    "path": "/group/child-group/direct?groupname=" + parentGroupName
  };

  _doRequest(options, function(err, res) {
    return callback(err, res);
  });
};

module.exports.remove = function (group, callback) {
  var options = {
    method: "DELETE",
    path: "/group?groupname=" + group
  };

  _doRequest(options, function (err, res) {
    return callback (err, res);
  });
};

module.exports.addmember = function (username, group, callback) {
  var payload = {
    "name": group
  };

  var options = {
    "method": "POST",
    "data": JSON.stringify(payload),
    "path": "/user/group/direct?username=" + username
  };

  _doRequest(options, function (err, res) {
    return callback(err, res);
  });
};

module.exports.removemember = function (username, group, callback) {
  var options = {
    method: "DELETE",
    path: "/user/group/direct?username=" + username + "&groupname=" + group
  };

  _doRequest(options, function (err, res) {
    return callback(err, res);
  });
};

module.exports.directmembers = function (group, callback) {
  var users = [];
  var options = {
    method: "GET",
    path: "/group/user/direct?groupname=" + group
  };

  _doRequest(options, function (err, res) {
    if(res && res.users && res.users.length > 0) {
      res.users.forEach(function(user) {
        users.push(user.name);
      });
    }
    return callback(err, users);
  });
};

module.exports.nestedmembers = function (group, callback) {
  var users = [];
  var options = {
    method: "GET",
    path: "/group/user/nested?groupname=" + group
  };

  _doRequest(options, function (err, res) {
    if(res && res.users && res.users.length > 0) {
      res.users.forEach(function(user) {
        users.push(user.name);
      });
    }
    return callback(err, users);
  });
};
