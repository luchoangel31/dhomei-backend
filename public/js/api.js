/* ===================================
   🌐 DHOMEI API CLIENT PRO
=================================== */

const API_URL = "http://localhost:3001/api";

/* ===============================
   GET TOKEN
=============================== */
function getToken(){
return localStorage.getItem("token");
}


/* ===============================
   LOGOUT GLOBAL
=============================== */
function forceLogout(){

localStorage.clear();

alert("Sesión expirada");

window.location.href="login.html";
}


/* ===============================
   REQUEST GLOBAL
=============================== */
async function apiFetch(endpoint, options = {}){

const token = getToken();

options.headers = {
"Content-Type":"application/json",
...(options.headers || {})
};

if(token){
options.headers.Authorization =
"Bearer " + token;
}

try{

const res = await fetch(
API_URL + endpoint,
options
);

/* 🔐 TOKEN EXPIRADO */
if(res.status === 401){
forceLogout();
return;
}

return res;

}catch(err){

console.error("API ERROR",err);
throw err;

}

}