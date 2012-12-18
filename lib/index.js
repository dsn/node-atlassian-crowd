var url    = require("url");
var http = require('http');
var https = require('https');

function AtlassianCrowd(options) {
  settings = options || {};

  for (var i in options) {
    if(options.hasOwnProperty(i)) {
      settings[i] = options[i];
    }
  }

  if(settings.crowd.base === undefined) {
    throw Error("Missing Required Setting Crowd Base URL");
  }

  if(settings.application.name === undefined) {
    throw Error("Missing Required Setting Application Name");
  }

  if(settings.application.password === undefined) {
    throw Error("Missing Required Setting Application Password");
  }

  var uri = url.parse(settings.crowd.base);

  settings.protocol   = uri.protocol;
  settings.hostname   = uri.hostname;
  settings.pathname   = uri.pathname;

  settings.authstring = settings.application.name + ":" + settings.application.password;

  if(!settings.port) { 
    settings.port = (uri.protocol == "https:") ? 443 : 80; 
  }
}

AtlassianCrowd.prototype.search = function (type, query, callback) {
  if(type !== "user" && type !== "group" && typeof(query) !== "string") {
    var error = new Error("Invalid Search Type");
    error.type = "BAD_REQUEST";
    callback(error);
  }

  if(query.indexOf('=') !== -1) {
    query = require('querystring').escape(query);
  }

  var options = {
    "method": "GET",
    "path": "/crowd/rest/usermanagement/latest/search?entity-type=" + type + "&restriction=" + query
  };

  _doRequest(options, function (err, res) {
    return callback(err, res);
  });
};

AtlassianCrowd.prototype.ping = function (callback) {
  var options = {
    method: "GET",
    path: "/crowd/rest/usermanagement/latest/config/cookie"
  };

  _doRequest(options, function(err, res) {
    return callback(err, res);
  });
};

_doRequest = function (options, callback) {
  var data = "", error;

  var opts = {
    hostname: this.settings.hostname,
    port: this.settings.port,
    auth: this.settings.authstring,
    method: options.method,
    path: this.settings.pathname + options.path,
    headers: {
      "Accept": "application/json"
    }
  };

  if(options.method === "POST" || options.method === "PUT") {
    if(options.payload) {
      opts.headers['content-type'] = "application/xml";
      opts.headers['content-length'] = options.payload.length;
    }
    else {
      error = new Error("Missing POST Data");
      error.type = "BAD_REQUEST";
      return callback(error);
    } 
  }

  var protocol = (settings.protocol == "https:") ? https : http;

  var request = protocol.request(opts, function(response) {

    response.on('data', function(chunk) {
      data += chunk.toString();
    });
  
    if(response.statusCode === 401) {
      error = new Error("Application Authorization Error");
      error.type = "APPLICATION_ACCESS_DENIED";
      return callback(error);
    }

    if(response.statusCode === 403) {
      error = new Error("Application Permission Denied");
      error.type = "APPLICATION_PERMISSION_DENIED";
      return callback(error);
    }

    response.on('end', function () {
      if (response.headers['content-type'] !== "application/json") {
        error = new Error("Invalid Response from Atlassian Crowd");
        error.type = "INVALID_RESPONSE";
        return callback(error);
      }
      else {
        if(data) {
          data = JSON.parse(data);
          if(data.reason) {
            error = new Error(data.message);
            error.type = data.reason;
            return callback(error);
          }
          else {
            return callback(null, data);
          }
        }
        else {
          return callback(null, response.statusCode);
        }
      }
    });
  });

  if(options.payload) {
    request.end(options.payload);
  }
  else {
    request.end();
  }
};

AtlassianCrowd.prototype.user = require('./user');
AtlassianCrowd.prototype.groups = require('./groups');
AtlassianCrowd.prototype.session = require('./session');

module.exports = AtlassianCrowd;
