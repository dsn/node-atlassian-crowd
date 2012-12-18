# Atlassian Crowd Library for node.js #
A node.js module for interacting with the Atlassian Crowd asynchronously.

## Getting Started ##
In order to use this module you will first need to configure an application in Atlassian Crowd and Configure the Remote IP Address.

See the [Atlassian Crowd Documentation (Adding and Application)](https://confluence.atlassian.com/display/CROWD/Adding+an+Application#AddinganApplication-add) for assistance.

## Usage ##
```javascript
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
```

### Options ###
If you do not know these please ask your systems administrator.

`application.name` Application name as configured in Atlassian Crowd
`application.password` Application name as configured in Atlassian Crowd
`crowd.baseurl` Atlassian Crowd Base URL
`crowd.port` Atlassian Crowd Port

## API ##

### User Functions ###
Functions for interacting with a user account.

#### Find a User by Username ####
user.find(userrname, callback)
Callback contains two possible values. The first is an error object if the operation was not successful and the second is an Object containing details about the user.

```javascript
crowd.user.find('test', function(err, res) {
  if(err) { 
    throw err;
   }
  else {
    console.log(res);
  }
});
```

#### Create a User ####
user.create(firstname, lastname, displayname, email, username, password, callback)  
Callback contains one possible value which is an error object if the operation was not successful.

```javascript
crowd.user.create('test', 'user', 'Test User', 'test@foo.bar', 'testuser', 'password', function(err) {
  if(err) { 
    throw err;
  }
  else {
    console.log("Success")
  }
});
```

#### Delete a User ####
user.remove(username, callback)  
Callback contains one possible value which is an error object if the operation was not successful.

```javascript
crowd.user.remove('testuser', function(err) {
  if(err) { 
    throw err;
  }
  else {
    console.log("Success")
  }
});
```

#### Check if User is Active ####
user.active(username, callback)  
Callback contains two possible values. The first is an error obiect if the operation was not successful and the second is a Boolean

```javascript
crowd.user.active('user', function (err, res) {
  if(err) {
    throw err;
  }
  else {
    console.log(res.toString());
  }
});
```

#### User Group Membership ####
user.groups(username, callback)  
Callback contains two possible values. The first is an error obiect if the operation was not successful and the second is an Array of Group Names

```javascript
crowd.user.groups(username, function (err, res) {
  if(err) {
    throw err;
  }
  else {
    console.log(res);
  }
});
```

#### Authentication ####
user.authenticate(username, password, callback)  
Callback contains two possible values. The first is an error object if the operation was not successful and the second is an Object containing details about the user

```javascript
crowd.user.authenticate('user', 'password', function(err, res) {
  if(err) { 
    throw err;
   }
  else {
    console.log(res);
  }
});
```

### Group Functions ###

#### Find ####
group.find(groupname, callback)  

```
@param groupname String  
@param callback Function  
@callbackparam Error  
@callbackparam Response  
```

```javascript
crowd.groups.find('crowd-administrators', function (err, res) {
  if(err) {
    throw err;
  }
  else {
    console.log(res);
  }
});
```

#### Create ####
group.create(name, description, callback)
Callback contains one possible value which is an error object if the operation was not successful.

```javascript
crowd.groups.create("test-group", "Test Description", function(err) {
  if(err) {
    throw err;
  }
  else {
    console.log("Success");
  }
});
```

#### Remove ####
group.remove(name, callback)

## TODO ##
* Finish Docs
* Update User Profile
