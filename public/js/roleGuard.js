// ===============================
// 🛡️ ROLE GUARD PROFESIONAL
// ===============================

(function(){

const user =
JSON.parse(localStorage.getItem("user"));

const token =
localStorage.getItem("token");

// sin sesión
if(!token || !user){
    window.location.href="login.html";
    return;
}

// ===============================
// ROLES POR PAGINA
// ===============================

const roleAccess = {

    "admin.html": ["admin"],

    "dashboard.html": ["user","admin"],

    "vender.html": ["user","admin"],

    "perfil.html": ["user","admin"]

};

// ===============================
// PAGINA ACTUAL
// ===============================

const currentPage =
window.location.pathname
.split("/")
.pop();

// ===============================
// VALIDAR ACCESO
// ===============================

if(roleAccess[currentPage]){

    const allowedRoles =
    roleAccess[currentPage];

    if(!allowedRoles.includes(user.role)){

        alert("🚫 No tienes permisos");

        window.location.href="dashboard.html";
    }

}

})();