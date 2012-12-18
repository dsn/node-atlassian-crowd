# Atlassian Crowd Library for node.js #
A node.js module for interacting with the Atlassian Crowd asynchronously.

## Getting Started ##
In order to use this module you will first need to configure an application in Atlassian Crowd and Configure the Remote IP Address.

See the [Atlassian Crowd Documentation (Adding and Application)](https://confluence.atlassian.com/display/CROWD/Adding+an+Application#AddinganApplication-add) for assistance.

## Usage ##
<pre>
var AtlassianCrowd = require('atlassian-crowd');
var options = {
  "crowd": {
    "base": "http://localhost", 
    "port": 8080
  },
  "application": {
    "name": "my application",
    "password": "pass123"
  }
}

var crowd = new AtlassianCrowd(options);
</pre>

### Options ###
If you do not know these please ask your systems administrator.

#### Required Settings ####
`application.name` Application name as configured in Atlassian Crowd
`application.password` Application name as configured in Atlassian Crowd
`crowd.baseurl` Atlassian Crowd Base URL (Example http://crowd.localhost.com or http://localhost/context/)

#### Optional Settings ####
`crowd.port` If you have Crowd running on a port other than 80 or 443 specify the port number here

## API ##

### User Functions ###
Functions for interacting with a user account.

#### Find a User by Username ####
user.find(userrname, callback)
Callback contains two possible values. The first is an error object if the operation was not successful and the second is an Object containing details about the user.

<pre>
crowd.user.find('test', function(err, res) {
  if(err) { 
    throw err;
   }
  else {
    console.log(res);
  }
});
</pre>

#### Create a User ####
user.create(firstname, lastname, displayname, email, username, password, callback)  
Callback contains one possible value which is an error object if the operation was not successful.

<pre>
crowd.user.create('test', 'user', 'Test User', 'test@foo.bar', 'testuser', 'password', function(err) {
  if(err) { 
    throw err;
  }
  else {
    console.log("Success")
  }
});
</pre>

#### Delete a User ####
user.remove(username, callback)  
Callback contains one possible value which is an error object if the operation was not successful.

<pre>
crowd.user.remove('testuser', function(err) {
  if(err) { 
    throw err;
  }
  else {
    console.log("Success")
  }
});
</pre>

### Check if User is Active ###
user.active(username, callback)  
Callback contains two possible values. The first is an error obiect if the operation was not successful and the second is a Boolean

<pre>
crowd.user.active('user', function (err, res) {
  if(err) {
    throw err;
  }
  else {
    console.log(res.toString());
  }
});
</pre>

### User Group Membership ###
user.groups(username, callback)  
Callback contains two possible values. The first is an error obiect if the operation was not successful and the second is an Array of Group Names

<pre>
crowd.user.groups(username, function (err, res) {
  if(err) {
    throw err;
  }
  else {
    console.log(res);
  }
});
</pre>

#### Authentication ####
user.authenticate(username, password, callback)  
Callback contains two possible values. The first is an error object if the operation was not successful and the second is an Object containing details about the user

<pre>
crowd.user.authenticate('user', 'password', function(err, res) {
  if(err) { 
    throw err;
   }
  else {
    console.log(res);
  }
});
</pre>

### Group Functions ###

### Find ###
group.find(groupname, callback)  
Callback contains two possible values. The first is an error object if the operation was not successful and the second is an Object containing details about the group

<pre>
crowd.groups.find('crowd-administrators', function (err, res) {
  if(err) {
    throw err;
  }
  else {
    console.log(res);
  }
});
</pre>

### Create ###
group.create(name, description)
Callback contains one possible value which is an error object if the operation was not successful.

<pre>
crowd.groups.create("test-group", "Test Description", function(err) {
  if(err) {
    throw err;
  }
  else {
    console.log("Success");
  }
});
</pre>

# TODO #
* Finish Docs
* Session Functions (SSO)
* Password Change
* Password Reset
* Update User Profile
