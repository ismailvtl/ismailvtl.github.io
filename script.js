let profile = null;
let exd = document.querySelector('#exd');
let userDiv = document.querySelector('#user');
let logoutBtn = document.querySelector('.logout-btn');
let userDetailsDiv = document.querySelector('#user-details');
let addDataDiv = document.querySelector('#add-data');
let signinButton = document.querySelector('.g-signin2');

let today = new Date().toISOString().substr(0, 10);
document.querySelector("#ldate").value = today;

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
  console.log("onupgradede", active);
};

dataBase.onsuccess = function (e) {
console.log("success");
};

dataBase.onerror = function (e) {
alert("error");
};

function onSignIn(googleUser) {
  profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); 
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());
  userDiv.innerHTML = profile.getName();
  logoutBtn.classList.add('visible');
  userDetailsDiv.classList.add('visible');
  //addDataDiv.classList.add('visible');
  signinButton.style.display ='none';
	document.body.classList.add('loggedin');
  read();
}

function signOut() {
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      signinButton.style.display ='block';
      userDetailsDiv.classList.remove('visible');
      logoutBtn.classList.remove('visible');
      addDataDiv.classList.remove('visible');
      exd.innerHTML='';
	    document.body.classList.remove('loggedin');
    });
}

function add() {
  let lname = document.querySelector("#lname").value;
  let lamount = document.querySelector("#lamount").value
  let ldate =  document.querySelector("#ldate").value;
   let lcurrency =  document.querySelector("#lcurrency").value;
   let lpdate =  document.querySelector("#lpdate").value;
  var active = dataBase.result;
  var data = active.transaction(["loan"], "readwrite");
  var objectDb = data.objectStore("loan");
  if (document.querySelector("#lname").value.length && document.querySelector("#lamount").value.length && document.querySelector("#ldate").value.length && document.querySelector("#lpdate").value.length) {
    var request = objectDb.put({
      userid: profile.getId(),
      title: document.querySelector("#lname").value,
      amount: `${document.querySelector("#lamount").value} ${document.querySelector("#lcurrency").value}`,
      maturity: document.querySelector("#ldate").value
    });

    request.onerror = function (e) {
      alert(request.error.name + '\n\n' + request.error.message);
    };

    data.oncomplete = function (e) {
      document.querySelector("#lname").value = "";
      document.querySelector("#lamount").value = "";
      document.querySelector("#ldate").value = "";
      document.querySelector("#lcurrency").value = "";
      document.querySelector("#lpdate").value = "";
      console.log("added");
      addDataDiv.classList.remove('visible');
      read();
    };
  } else {
    alert("details cannot be blank");
  }
}

function read() {
  console.log("in read method", dataBase);
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
    let monthnames = ["Jan","Feb","Mar","App","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    if(request.result) {
      let arr = request.result.reverse();
      arr.forEach(data => {
	     let m = data.maturity.split('-');
	      let d = new Date();
	     console.log(m);
	      let dt1 = new Date(d.getFullYear(), d.getMonth() + 1);
	     let dt2 = new Date(m[0],m[1]);
             let mon = monthDiff(dt1, dt2);
       exd.innerHTML += `<div class="exd-row"><span>${data.title}</span><span>${data.amount}</span><span><div>Maturity Date</div> ${m[2]} ${monthnames[Number(m[1] - 1)]} ${m[0]} ( <small>${mon} months left</small> )</span></div>`
      });
    }
  };
}

function showAddView() {
  addDataDiv.classList.add('visible');
}

function closeAddView() {
  addDataDiv.classList.remove('visible');
}


function monthDiff(dateFrom, dateTo) {
 return dateTo.getMonth() - dateFrom.getMonth() + 
   (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
}
