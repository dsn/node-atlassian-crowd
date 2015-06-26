var token;
module.exports = {
  setUp: function(callback) {
    self = this;
    var conf;

    var AtlassianCrowd = require('../lib/index');
    /* Try to load test.config file */
    try {
      conf = JSON.parse(require('fs').readFileSync('test/test.config').toString());
    }
    catch(err) {
      conf = JSON.parse(require('fs').readFileSync('./test.config').toString());
    }
    finally {
      if(conf === undefined) {
        throw new Error("Unable to Find Test Configuration");
      }
    }

    this.firstname   = conf.test.firstname;
    this.lastname    = conf.test.lastname;
    this.displayname = conf.test.displayname;
    this.email       = conf.test.email;
    this.username    = conf.test.username;
    this.password    = conf.test.password;
    this.group       = conf.test.group;
    this.groupNested = conf.test.groupNested;
    this.groupdesc   = conf.test.groupdesc;

    this.token = token;

    if(!this.firstname) {
      throw new Error("Missing Required Test Configuration Firstname");
    }
    if(!this.lastname) {
      throw new Error("Missing Required Test Configuration Lastname");
    }
    if(!this.displayname) {
      throw new Error("Missing Required Test Configuration Displayname");
    }
    if(!this.email) {
      throw new Error("Missing Required Test Configuration Email");
    }

    if(!this.username) {
      throw new Error("Missing Required Test Configuration Username");
    }

    if(!this.password) {
      throw new Error("Missing Required Test Configuration Password");
    }

    if(!this.group) {
      throw new Error("Missing Required Test Configuration Group");
    }

    if(!this.group) {
      throw new Error("Missing Required Test Configuration Group Description");
    }

    crowd = new AtlassianCrowd(conf);
    callback();
  },
  tests: {
    "Ping": function (test) {
      test.expect(1);
      crowd.ping(function (err, res) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          if(res.secure.toString() === "true" || res.secure.toString() === "false") {
            test.ok(true);
          }
          else {
            test.ok(false);
          }
          test.done();
        }
      });
    },
    "User Create": function (test) {
      test.expect(1);
      crowd.user.create(this.firstname, this.lastname, this.displayname, this.email, this.username, this.password, function(err) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          test.ok(true);
          test.done();
        }
      });
    },
    "Group Create": function(test) {
      test.expect(1);
      crowd.groups.create(this.group, this.groupdesc, function(err) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          test.ok(true);
          test.done();
        }
      });
    },
    "Create Group For Nesting": function(test) {
      test.expect(1);
      crowd.groups.create(this.groupNested, this.groupdesc, function(err) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          test.ok(true);
          test.done();
        }
      });
    },
    "Create Group Nest": function(test) {
      test.expect(1);
      crowd.groups.createNested(this.group, this.groupNested, this.groupdesc, function(err) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          test.ok(true);
          test.done();
        }
      });
    },
    "Group Find": function (test) {
      test.expect(3);
      crowd.groups.find(this.group, function(err, res) {
        if(err) {
          test.ok(false);
          test.done();
       }
       else {
         test.equals(res.type, "GROUP");
         test.equals(res.description, self.groupdesc);
         test.ok(res.active);
         test.done();
       }
      });
    },
    "Group Active": function (test) {
      test.expect(1);
      crowd.groups.active(this.group, function(err, res) {
        if(err) {
          test.ok(false);
          test.done();
       }
       else {
         test.ok(res);
         test.done();
       }
      });
    },
    "Group Add Member": function (test) {
      test.expect(1);
      crowd.groups.addmember(this.username, this.group, function(err) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          test.ok(true);
          test.done();
        }
      });
    },
    "Group Direct Members": function (test) {
      test.expect(1);
      crowd.groups.directmembers(this.group, function (err, res) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          if(res.length > 0) {
            res.forEach(function (record) {
              if(record === self.username) {
                test.ok(true);
                test.done();
              }
            });
          }
        }
      });
    },
    "Group Nested Members": function (test) {
      test.expect(1);
      crowd.groups.nestedmembers(this.group, function (err, res) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          if(res.length > 0) {
            res.forEach(function (record) {
              if(record === self.username) {
                test.ok(true);
                test.done();
              }
            });
          }
        }
      });
    },
    "User Find": function (test) {
      test.expect(3);
      crowd.user.find(this.username, function(err, res) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          test.equals(res.name, self.username);
          test.equals(res.email, self.email);
          test.equals(res.active.toString(), "true");
          test.done();
        }
      });
    },
    "User Find (Not Found)": function (test) {
      test.expect(1);
      crowd.user.find('randomusernothere', function(err) {
        if(err) {
          if(err.type === "USER_NOT_FOUND") {
            test.ok(true);
            test.done();
          }
          else {
            test.ok(false);
            test.done();
          }
        }
        else {
          test.ok(false);
          test.done();
        }
      });
    },
    "User is Active": function (test) {
      test.expect(1);
      crowd.user.active(this.username, function(err, res) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          test.ok(res);
          test.done();
        }
      });
    },
    "User Group Membership": function (test) {
      test.expect(1);
      crowd.user.groups(this.username, function(err, res) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          if(res.length > 0) {
            res.forEach(function(record) {
              if(record === self.group) {
                test.equals(record, self.group);
                test.done();
              }
            });
          }
          else {
            test.ok(false);
            test.done();
          }
        }
      });
    },
    "User Authenticate": function (test) {
      test.expect(1);
      crowd.user.authenticate(this.username, this.password, function(err, res) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          test.equals(self.email, res.email);
          test.done();
        }
      });
    },
    "Session Create": function (test) {
      test.expect(1);
      crowd.session.create(this.username, this.password, function (err, res) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          token = res;
          test.ok(true);
          test.done();
        }
      });
    },
    "Session Find": function (test) {
      test.expect(6);
      crowd.session.find(this.token, function (err, res) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          test.equals(res.user.name, self.username);
          test.equals(res.user.email, self.email);
          test.equals(res.user['first-name'], self.firstname);
          test.equals(res.user['last-name'], self.lastname);
          test.equals(res.user['display-name'], self.displayname);
          test.ok(res.user.active);
          test.done();
        }
      });
    },
    "Session Destroy": function (test) {
      test.expect(1);
      crowd.session.destroy(this.token, function (err) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          test.ok(true);
          test.done();
        }
      });
    },
    "User Change Password": function (test) {
      test.expect(2);
      crowd.user.changepassword(this.username, "newpassword", function (err) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          test.ok(true);
          crowd.user.authenticate(self.username, "newpassword", function (err, res) {
            if(err) {
              test.ok(false);
              test.done();
            }
            else {
              test.equals(res.email, self.email);
              test.done();
            }
          });
        }
      });
    },
    "Search Users": function (test) {
      test.expect(1);
      var query = 'name = "' + this.username + '"';
      crowd.search('user', query, function (err, res) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          test.equals(res.users[0].name, self.username);
          test.done();
        }
      });
    },
    "Search Groups": function (test) {
      test.expect(1);
      var query = 'name = "' + this.group + '"';
      crowd.search('group', query, function (err, res) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          test.equals(res.groups[0].name, self.group);
          test.done();
        }
      });
    },
    "Group Remove Member": function (test) {
      test.expect(1);
      crowd.groups.removemember(this.username, this.group, function (err) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          test.ok(true);
          test.done();
        }
      });
    },
    "Group Delete": function (test) {
      test.expect(1);
      crowd.groups.remove(this.group, function(err) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          test.ok(true);
          test.done();
        }
      });
    },
    "Nested Group Delete": function (test) {
      test.expect(1);
      crowd.groups.remove(this.groupNested, function(err) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          test.ok(true);
          test.done();
        }
      });
    },
    "User Delete": function (test) {
      test.expect(1);
      crowd.user.remove(this.username, function(err) {
        if(err) {
          test.ok(false);
          test.done();
        }
        else {
          test.ok(true);
          test.done();
        }
      });
    }
  }
};
