const token = localStorage.getItem("token");

if(!token){
    alert("Debes iniciar sesión");
    window.location.href = "login.html";
}