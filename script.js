let profile = null;
let exd = document.querySelector('#exd');
let userDiv = document.querySelector('#user');
let logoutBtn = document.querySelector('.logout-btn');
let readBtn = document.querySelector('.read-btn');
let userDetailsDiv = document.querySelector('#user-details');
let addDataDiv = document.querySelector('#add-data');
let signinButton = document.querySelector('.g-signin2');

let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
let dataBase = null;
let db = null;
dataBase = indexedDB.open("loanTracker", 1);

dataBase.onupgradeneeded = function (e) {
	let active = dataBase.result;
	let objectDb = active.createObjectStore("loan", {keyPath: 'id', autoIncrement : true});
  objectDb.createIndex('index_recordid','id', {unique : true});
	objectDb.createIndex('index_userid','userid', {unique : false});
  objectDb.createIndex('index_title','title', {unique : false});
  objectDb.createIndex('index_amount','amount', {unique : false});
  objectDb.createIndex('index_maturity','maturity', {unique : false});
};

function onSignIn(googleUser) {
  profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  userDiv.innerHTML = profile.getName();
  logoutBtn.classList.add('visible');
  readBtn.classList.add('visible');
  userDetailsDiv.classList.add('visible');
  addDataDiv.classList.add('visible');
  signinButton.style.display ='none';
}

dataBase.onsuccess = function (e) {
console.log("success");
read();
};

dataBase.onerror = function (e) {
alert("error");
};



function signOut() {
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      signinButton.style.display ='block';
      userDetailsDiv.classList.remove('visible');
      logoutBtn.classList.remove('visible');
      addDataDiv.classList.remove('visible');
      readBtn.classList.remove('visible');
      exd.innerHTML='';
    });
}

function add() {
  let lname = document.querySelector("#lname").value;
  let lamount = document.querySelector("#lamount").value
  let ldate =  document.querySelector("#ldate").value;
  var active = dataBase.result;
  var data = active.transaction(["loan"], "readwrite");
  var objectDb = data.objectStore("loan");
  if (document.querySelector("#lname").value.length && document.querySelector("#lamount").value.length && document.querySelector("#ldate").value.length) {
    var request = objectDb.put({
      userid: profile.getId(),
      title: document.querySelector("#lname").value,
      amount: document.querySelector("#lamount").value,
      maturity: document.querySelector("#ldate").value
    });

    request.onerror = function (e) {
      alert(request.error.name + '\n\n' + request.error.message);
    };

    data.oncomplete = function (e) {
      document.querySelector("#lname").value = "";
      document.querySelector("#lamount").value = "";
      document.querySelector("#ldate").value = "";
      console.log("added");
      read();
    };
  } else {
    alert("details cannot be blank");
  }
}

function read() {
  let db = dataBase.result;
  let transaction = db.transaction(["loan"]);
  let objectDb = transaction.objectStore("loan");
  let index = objectDb.index('index_userid');
  let request = index.getAll(`${profile.getId()}`);

  request.onerror = function(event) {
    alert("Unable to retrieve data from database!");
  };

  request.onsuccess = function(event) {
    exd.innerHTML='';
    if(request.result) {
      let arr = request.result.reverse();
      arr.forEach(data => {
       exd.innerHTML += `<div class="exd-row"><span>${data.title}</span><span>${data.amount}</span><span>${data.maturity}</span></div>`
      });
    }
  };
}
