module.exports.find = function (group, callback) {
  var options = {
    method: "GET",
    path: "/crowd/rest/usermanagement/latest/group?groupname=" + group
  };  

  _doRequest(options, function (err, res) {
    return callback(err, res);
  });
};

module.exports.create = function (name, description, callback) {
  var libxmljs = require('libxmljs');
  var payload  = new libxmljs.Document();

  payload.node('group').attr({"name": name})
    .node("type", 'GROUP').parent()
    .node('description', description).parent()
    .node('active', 'true');

  var options = {
    method: "POST",
    payload: payload.toString(),
    path: "/crowd/rest/usermanagement/latest/group"
  };

  _doRequest(options, function(err, res) {
    return callback(err, res);
  });
};

module.exports.remove = function (group, callback) {
  var options = {
    method: "DELETE",
    path: "/crowd/rest/usermanagement/latest/group?groupname=" + group
  };

  _doRequest(options, function (err, res) {
    return callback (err, res);
  });
};

module.exports.addmember = function (username, group, callback) {
  var libxmljs = require('libxmljs');
  var payload  = new libxmljs.Document();

  payload.node('group').attr('name', group);

  var options = {
    method: "POST",
    payload: payload.toString(),
    path: "/crowd/rest/usermanagement/latest/user/group/direct?username=" + username
  };

  _doRequest(options, function (err, res) {
    return callback(err, res);
  });
};

module.exports.removemember = function (username, group, callback) {
  var options = {
    method: "DELETE",
    path: "/crowd/rest/usermanagement/latest/user/group/direct?username=" + username + "&groupname=" + group
  };

  _doRequest(options, function (err, res) {
    return callback(err, res);
  });
};

module.exports.directmembers = function (group, callback) {
  var users = [];
  var options = {
    method: "GET",
    path: "/crowd/rest/usermanagement/latest/group/user/direct?groupname=" + group
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
    path: "/crowd/rest/usermanagement/latest/group/user/nested?groupname=" + group
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
