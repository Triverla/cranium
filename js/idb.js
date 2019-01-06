(function() {
    "use strict";
function Connection() {
    if (navigator.onLine) {
        snack("Internet is available, Message Sent!");
    } else {
        snack("You are offline, Saved to indexDB");
    }
}
function snack(text) {
    let x = document.querySelector("#snackbar");
    x.className = "show";
    x.innerHTML = text;
    setTimeout(() => {
        x.className = x.className.replace("show", "");
    }, 3000);
}
document.querySelector("#csubmit").addEventListener("click", function() {
    //get api to convert currency
    Connection();
    saveContact();
    alert('Thanks for contacting us! We will get back to you soon!');
    location.reload();
});
document.querySelector("#ssubmit").addEventListener("click", function() {
    //get api to convert currency
    Connection();
   Subscribe();
  alert('Thanks for subscribing to our channel! Check your mail for more info');
  location.reload();
});
let db;

let openRequest = indexedDB.open('contact-us', 1);

openRequest.onupgradeneeded = e => {
  let db = e.target.result;
  console.log('running onupgradeneeded');
  let store = db.createObjectStore("contact", { keyPath: "email", autoIncrement : 'true'});
};
openRequest.onsuccess = e => {
  console.log('running onsuccess');
  db = e.target.result;
  //addCurrencies();
  saveContact();
};
openRequest.onerror = e => {
  console.log('Error Encountered');
  console.dir(e);
};

const saveContact = () => {  
    let name = document.getElementById('cname').value;
    let email = document.getElementById('cemail').value;
    let message = document.getElementById('cmessage').value;

                storeData({
                    name: name,
                    email: email,
                    message : message
                });
      };

function storeData(data) {
        // If the browser doesn't support service worker,
        let transactStore = db
            .transaction("contact", "readwrite")
            .objectStore("contact");
        transactStore.put(data);
        transactStore.onsuccess = () => {
            console.info("Data Saved Successfully");
        };
}

//Subscriptions
let db1;
let openRequest1 = indexedDB.open('subscription', 2);

openRequest1.onupgradeneeded = e => {
  let db1 = e.target.result;
  console.log('running onupgradeneeded');
  let store = db1.createObjectStore("users", { keyPath: "email", autoIncrement : 'true'});
};
openRequest1.onsuccess = e => {
  console.log('running onsuccess1');
  db1 = e.target.result;
  //addCurrencies();
  Subscribe();
};
openRequest1.onerror = e => {
  console.log('Error Encountered');
  console.dir(e);
};

function Subscribe(){
    let email = document.getElementById('semail').value;
    storeSub({
        email: email
    });
}
function storeSub(data) {
    // If the browser doesn't support service worker,
    let transactStore = db1
        .transaction("users", "readwrite")
        .objectStore("users");
    transactStore.put(data);
    transactStore.onsuccess = () => {
        console.info("Data Saved Successfully");
    };
}
})();