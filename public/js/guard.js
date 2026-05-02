// ===============================
// 🔐 DHOMEI GLOBAL AUTH GUARD
// ===============================

// páginas que requieren login
const protectedPages = [
  "dashboard.html",
  "perfil.html",
  "vender.html",
  "mis-propiedades.html"
];

// página actual
const currentPage =
  window.location.pathname.split("/").pop();

// token
const token = localStorage.getItem("token");


// ===============================
// BLOQUEAR ACCESO
// ===============================
if(protectedPages.includes(currentPage)){

  if(!token){

    alert("Debes iniciar sesión");

    window.location.href = "login.html";
  }

}


// ===============================
// AUTO LOGOUT TOKEN CORRUPTO
// ===============================
if(token){

  try{

    const payload =
      JSON.parse(atob(token.split('.')[1]));

    const now = Date.now()/1000;

    // token expirado
    if(payload.exp && payload.exp < now){

      localStorage.clear();
      window.location.href="login.html";
    }

  }catch{

    localStorage.clear();
    window.location.href="login.html";
  }

}