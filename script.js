let profile = null;

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;
dataBase = indexedDB.open("loanTracker", 1);

dataBase.onupgradeneeded = function (e) {
	var active = dataBase.result;
	var objectDb = active.createObjectStore("loan", {keyPath: 'id', autoIncrement : true});
  objectDb.createIndex('index_recordid','id', {unique : true});
	objectDb.createIndex('index_userid','userid', {unique : false});
  objectDb.createIndex('index_title','title', {unique : false});
  objectDb.createIndex('index_amount','amount', {unique : false});
  objectDb.createIndex('index_maturity','maturity', {unique : false});
};

dataBase.onsuccess = function (e) {
console.log("success");
};

dataBase.onerror = function (e) {
alert("error");
};

function onSignIn(googleUser) {
  profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  document.querySelector('#user').innerHTML = profile.getName();
  document.querySelector('.logout-btn').classList.add('visible');
  document.querySelector('.read-btn').classList.add('visible');
  document.querySelector('#user-details').classList.add('visible');
  document.querySelector('#add-data').classList.add('visible');
  document.querySelector('.g-signin2').style.display ='none';
}

function signOut() {
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      document.querySelector('.g-signin2').style.display ='block';
      document.querySelector('#user-details').classList.remove('visible');
      document.querySelector('.logout-btn').classList.remove('visible');
      document.querySelector('#add-data').classList.remove('visible');
      document.querySelector('.read-btn').classList.remove('visible');
      document.querySelector('#exd').innerHTML='';
    });
}

function add() {
  console.log("inside add");
  var active = dataBase.result;
  var data = active.transaction(["loan"], "readwrite");
  var objectDb = data.objectStore("loan");
  var lname = document.querySelector("#lname").value;
  var lamount = document.querySelector("#lamount").value;
  var ldate =  document.querySelector("#ldate").value;
  if (lname.length > 0 && lamount.length > 0 && ldate.length > 0) {
    var request = objectDb.put({
      userid: profile.getId(),
      title: lname,
      amount: lamount,
      maturity: ldate
    });

    request.onerror = function (e) {
      alert(request.error.name + '\n\n' + request.error.message);
    };

    data.oncomplete = function (e) {
      lname = "";
      lamount = "";
      ldate = "";
      console.log("added");
    };
    read();
  } else {
    alert("details cannot be blank");
  }
}

function read() {
  var db = dataBase.result;
  var transaction = db.transaction(["loan"]);
  var objectDb = transaction.objectStore("loan");
  var index = objectDb.index('index_userid');
  var request = index.getAll(`${profile.getId()}`);
  request.onerror = function(event) {
    alert("Unable to retrieve data from database!");
  };

  request.onsuccess = function(event) {
    document.querySelector('#exd').innerHTML='';
    if(request.result) {
      request.result.forEach(data => {
       document.querySelector('#exd').innerHTML += `<div class="exd-row"><span>${data.title}</span><span>${data.amount}</span><span>${data.maturity}</span></div>`
      });
    }
  };
}

read();