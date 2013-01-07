# Atlassian Crowd Client for node.js #
A node.js module for interacting with the Atlassian Crowd.

Provides the ability to Add, Remove, and Manage Users and Groups as well as SSO functionality.

## Getting Started ##
In order to use this module you will first need to configure an application in Atlassian Crowd and Configure the Remote IP Address.

See the [Atlassian Crowd Documentation (Adding an Application)](https://confluence.atlassian.com/display/CROWD/Adding+an+Application#AddinganApplication-add) for assistance.

## Usage ##
```javascript
var AtlassianCrowd = require('atlassian-crowd');
var options = {
  "crowd": {
    "base": "http://localhost:8095/crowd"
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
`crowd.base` Atlassian Crowd Base URL

## API ##

#### Testing Configuration and Connectivity ####
A simple function to check connectivity to Atlassian Crowd.

ping(callback)

* callback Function (err, res)

```javascript
crowd.ping(function (err, res) {
  if(err) {
    throw err;
  }
  else {
    console.log(res)
  }
});
```

#### Search Users or Groups ####
Uses the Crowd Query Language  
See [Crowd Query Language Documenation](https://developer.atlassian.com/display/CROWDDEV/Crowd+Query+Language) for more details  
search(entityType, query, callback)

* entityType String 'user' or 'group'
* query String Crowd Query

#### Search Users #####
```javascript
crowd.search('user', 'firstName="test*"', function (err, res) {
  if(err) {
    throw err;
  }
  else {
    console.log(res);
  }
});
```

##### Search Groups #####
```javascript
crowd.search('group', 'name="*test*"', function (err, res) {
  if(err) {
    throw err;
  }
  else {
    console.log(res);
  }
});
```

### User Related Functions ###
Here you can find utilities for Managing, Creating, Removing, Users as well as Changing Passwords, and Basic Authentication (NON SSO).

#### Finding a User by Username ####
user.find(userrname, callback)

* username String
* callback Function (err, res)

```javascript
crowd.user.find('user', function(err, res) {
  if(err) { 
    throw err;
   }
  else {
    console.log(res);
  }
});
```

#### Checking if User is Active ####
user.active(username, callback)  

* username String
* callback Function (err, res)

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

#### Creating a User ####
user.create(firstname, lastname, displayname, email, username, password, callback)  

* firstname String
* lastname String
* displayname String
* email String
* username String
* password String
* callback Function (err)

```javascript
crowd.user.create('Test', 'User', 'Test User', 'test@foo.bar', 'testuser', 'abc123', function(err) {
  if(err) { 
    throw err;
  }
  else {
    console.log("Success")
  }
});
```

#### Removing a User ####
user.remove(username, callback)  

* username String
* callback Function (err)

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

#### List a Users Group Membership ####
user.groups(username, callback)  

* username String
* callback Function (err, res)

```javascript
crowd.user.groups('testuser', function (err, res) {
  if(err) {
    throw err;
  }
  else {
    console.log(res);
  }
});
```

#### User Authentication (NON SSO) ####
user.authenticate(username, password, callback)  

* username String
* password String
* callback Function (err, res)

```javascript
crowd.user.authenticate('testuser', 'abc123', function(err, res) {
  if(err) { 
    throw err;
   }
  else {
    console.log(res);
  }
});
```

#### Changing a Users Password ####
user.changepassword(username, newpassword)

* username String
* newpassword String
* callback Function (err)

```javascript
crowd.user.changepassword('testuser', 'newpass', function (err) {
  if(err) {
    throw err;
  }
  else {
    console.log("Success");
  }
});
```

### Group Functions ###
Here you can find utilities for Managing, Creating, and Removing Groups.  

#### Finding a Group ####
groups.find(groupname, callback)  

* groupname String
* callback Function (err, res)

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

#### Creating a Group ####
groups.create(name, description, callback)

* name String
* description String
* callback Function (err)

```javascript
crowd.groups.create('test-group', 'Test Description', function(err) {
  if(err) {
    throw err;
  }
  else {
    console.log("Success");
  }
});
```

#### Removing a Group ####
groups.remove(name, callback)

* name String
* callback Function (err)

```javascript
crowd.groups.remove('test-group', function (err) {
  if(err) {
    throw err;
  }
  else {
    console.log("Success");
  }
```

#### Adding a User to a Group ####
groups.addmember(username, group, callback)

* username String
* group String
* callback Function (err)

```javascript
crowd.groups.addmember('testuser', 'test-group', function (err) {
  if(err) {
    throw err;
  }
  else {
    console.log("Success");
  }
});
```

#### Removing a User from a Group ####
groups.removemember(username, group, callback)

* username String
* group String
* callback Function (err)

```javascript
crowd.groups.removemember('testuser', 'test-group', function (err) {
  if(err) {
    throw err;
  }
  else {
    console.log("Success");
  }
});
```

#### Find the Direct Members of a Group ####

#### Find the Nested Members of a Group ####

### Session Functions ###
Provides SSO Functionality

#### Create a new Session ####

#### Authenticate ####

#### Destroy ####



## TODO ##
* Finish Docs
* Update User Profile
