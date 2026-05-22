console.log("✅ login.js cargado");

const API_URL = "https://dhomei-backend.onrender.com/api/v1/auth/login";

// 🔁 AUTO REDIRECT SI YA ESTÁ LOGUEADO
(function () {

  const token = localStorage.getItem("accessToken");

  if (token) {

    try {

      const payload =
        JSON.parse(atob(token.split('.')[1]));

      if (payload.exp * 1000 > Date.now()) {

        console.log("🔁 Ya logueado");

        window.location.href = "dashboard.html";

        return;

      } else {

        localStorage.clear();
      }

    } catch (error) {

      console.error(error);

      localStorage.clear();
    }
  }

})();

// ⏳ ESPERAR DOM
window.addEventListener("load", () => {

  const form =
    document.getElementById("loginForm");

  if (!form) {

    console.error("❌ No se encontró loginForm");

    return;
  }

  console.log("✅ Formulario encontrado");

  form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const messageDiv =
      document.getElementById("message");

    messageDiv.innerHTML = "";

    const email =
      document.getElementById("email")
      .value
      .trim();

    const password =
      document.getElementById("password")
      .value;

    try {

      const response = await fetch(API_URL, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email,
          password
        })

      });

      const data = await response.json();

      console.log("📦 RESPONSE:", data);

      if (!response.ok) {

        messageDiv.innerHTML = `
          <div class="error">
            ${data.error || data.message || "Error en login"}
          </div>
        `;

        return;
      }

      // 🔥 TOKENS
      const accessToken =
        data?.data?.accessToken ||
        data?.accessToken;

      const refreshToken =
        data?.data?.refreshToken ||
        data?.refreshToken;

      // 🔥 SESSION ID
      const sessionId =
        data?.data?.sessionId ||
        data?.sessionId ||
        data?.data?.currentSessionId ||
        data?.currentSessionId;

      if (!accessToken) {

        messageDiv.innerHTML = `
          <div class="error">
            ❌ No se recibió accessToken
          </div>
        `;

        return;
      }

      // 💾 GUARDAR TOKENS
      localStorage.setItem(
        "accessToken",
        accessToken
      );

      if (refreshToken) {

        localStorage.setItem(
          "refreshToken",
          refreshToken
        );
      }

      // 💾 GUARDAR SESSION ID
      if (sessionId) {

        localStorage.setItem(
          "sessionId",
          sessionId
        );

      } else {

        console.warn(
          "⚠️ No se recibió sessionId"
        );
      }

      messageDiv.innerHTML = `
        <div class="success">
          ✅ Login exitoso
        </div>
      `;

      console.log("🚀 REDIRIGIENDO...");

      setTimeout(() => {

        window.location.href =
          "dashboard.html";

      }, 500);

    } catch (error) {

      console.error(error);

      messageDiv.innerHTML = `
        <div class="error">
          🚨 Servidor no disponible
        </div>
      `;
    }

  });

});