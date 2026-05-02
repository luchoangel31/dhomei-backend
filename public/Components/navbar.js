function renderNavbar() {

  const token = localStorage.getItem("token");

  const navbar = document.getElementById("navbar");

  if (!navbar) return;

  let links = `
      <a href="index.html">Home</a>
      <a href="comprar.html">Comprar</a>
      <a href="alquilar.html">Alquilar</a>
      <a href="contacto.html">Contacto</a>
  `;

  // ======================
  // USUARIO LOGUEADO
  // ======================
  if (token) {

    links += `
      <a href="dashboard.html">Mi Panel</a>
      <a href="#" onclick="logout()">Cerrar sesión</a>
    `;

  } else {

    // ======================
    // VISITANTE
    // ======================
    links += `
      <a href="login.html">Login</a>
      <a href="registro.html">Registro</a>
    `;
  }

  navbar.innerHTML = `
    <header class="main-header">
        <h1>Dhomei</h1>
        <nav>${links}</nav>
    </header>
  `;
}

// ======================
// LOGOUT GLOBAL
// ======================
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

renderNavbar();