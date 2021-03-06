let profile = null;
let exd = document.querySelector('#exd');
let userDiv = document.querySelector('#user');
let logoutBtn = document.querySelector('.logout-btn');
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
  objectDb.createIndex('index_paymentdate','paydate', {unique : false});
};

dataBase.onsuccess = function (e) {
console.log("success");
};

dataBase.onerror = function (e) {
alert("error");
};

function onSignIn(googleUser) {
  profile = googleUser.getBasicProfile();
 /* console.log('ID: ' + profile.getId()); 
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());*/
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
     // console.log('User signed out.');
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
      maturity: document.querySelector("#ldate").value,
      paydate: document.querySelector("#lpdate").value
    });

    request.onerror = function (e) {
      alert(request.error.name + '\n\n' + request.error.message);
    };

    data.oncomplete = function (e) {
      //console.log("added");
      addDataDiv.classList.remove('visible');
      read();
    };
  } else {
    alert("details cannot be blank");
  }
}

function read() {
 // console.log("in read method", dataBase);
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
    let monthnames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    if(request.result) {
      let arr = request.result.reverse();
      arr.forEach(data => {
	     let m = data.maturity.split('-');
	      let d = new Date();
	     console.log(m);
	      let dt1 = new Date(d.getFullYear(), d.getMonth() + 1);
	     let dt2 = new Date(m[0],m[1]);
             let mon = monthDiff(dt1, dt2);
       exd.innerHTML += `<div class="exd-row" data-item="${data.id}"><span>${data.title}</span><span>${data.amount}</span><div class="paymentdatediv"><span>Next payment on : </span><span>${data.paydate} ${monthnames[d.getMonth()]} ${d.getFullYear()}</span></div><span><div>Maturity Date</div> ${m[2]} ${monthnames[Number(m[1] - 1)]} ${m[0]} ( <small>${mon} months left</small> )</span></div>`
      });
    }
  };
}

function showAddView() {
  addDataDiv.classList.add('visible');
     document.querySelector("#lname").value = "";
      document.querySelector("#lamount").value = "";
      document.querySelector("#lcurrency").value = "";
      document.querySelector("#lpdate").value = "";
  let today = new Date().toISOString().substr(0, 10);
  document.querySelector("#ldate").value = today;
}

function closeAddView() {
  addDataDiv.classList.remove('visible');
  document.querySelector("#ldate").value = "";
}


function monthDiff(dateFrom, dateTo) {
 return dateTo.getMonth() - dateFrom.getMonth() + 
   (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
}



/* push */
document.querySelector('#notify-button').addEventListener('click', function() {
Push.create("Hello world!",{
            body: "This is example of Push.js Tutorial",
            icon: '/Logo_small.png',
            timeout: 10000,
            onClick: function () {
                window.focus();
                this.close();
            }
        });
 });
 document.querySelector('#check-button').addEventListener('click', function() {
 console.log(Push.Permission.has());
 });
