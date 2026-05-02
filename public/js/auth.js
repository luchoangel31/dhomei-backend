// ==========================
// 🔐 AUTH FRONTEND (SAAS PRO)
// ==========================

const API_URL = "http://localhost:3001/api/v1";

/* =========================
   PARSE JWT
========================= */
function parseJwt(token){
  try{
    return JSON.parse(atob(token.split('.')[1]));
  }catch{
    return null;
  }
}

/* =========================
   VALIDAR EXPIRACIÓN
========================= */
function isExpired(token){
  const payload = parseJwt(token);
  if(!payload) return true;
  return payload.exp * 1000 < Date.now();
}

/* =========================
   🔁 REFRESH TOKEN
========================= */
async function refreshAccessToken(){

  const refreshToken = localStorage.getItem("refreshToken");

  if(!refreshToken){
    localStorage.clear();
    return null;
  }

  try{

    const res = await fetch(`${API_URL}/auth/refresh`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({ refreshToken })
    });

    const data = await res.json();

    if(!res.ok){
      throw new Error();
    }

    const newToken = data?.accessToken || data?.data?.accessToken;

    if(!newToken){
      throw new Error();
    }

    localStorage.setItem("accessToken", newToken);

    console.log("🔄 Token renovado");

    return newToken;

  }catch(err){

    console.log("❌ Refresh inválido → logout");

    localStorage.clear();
    return null;
  }
}

/* =========================
   🔐 GET TOKEN
========================= */
async function getAccessToken(){

  let token = localStorage.getItem("accessToken");

  if(!token) return null;

  if(isExpired(token)){
    console.log("⛔ Token expirado → refresh");
    return await refreshAccessToken();
  }

  return token;
}

/* =========================
   📡 FETCH PRO (AUTO AUTH)
========================= */
async function fetchWithAuth(url, options = {}){

  let token = await getAccessToken();

  if(!token){
    window.location.href = "login.html";
    return;
  }

  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`
  };

  let res = await fetch(url, options);

  // 🔥 AUTO-RECOVERY SI 401
  if(res.status === 401){

    console.log("⚠️ 401 → intentando refresh");

    const newToken = await refreshAccessToken();

    if(!newToken){
      window.location.href = "login.html";
      return;
    }

    options.headers.Authorization = `Bearer ${newToken}`;

    res = await fetch(url, options);
  }

  return res;
}

/* =========================
   🚪 LOGOUT (1 dispositivo)
========================= */
async function logout(){

  const refreshToken = localStorage.getItem("refreshToken");

  try{
    await fetch(`${API_URL}/auth/logout`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({ refreshToken })
    });
  }catch{}

  localStorage.clear();
  window.location.href = "login.html";
}

/* =========================
   🌍 LOGOUT GLOBAL
========================= */
async function logoutAll(){

  try{
    await fetchWithAuth(`${API_URL}/auth/logout-all`,{
      method:"POST"
    });
  }catch{}

  localStorage.clear();
  window.location.href = "login.html";
}

/* =========================
   📱 OBTENER SESIONES
========================= */
async function getSessions(){

  const res = await fetchWithAuth(`${API_URL}/auth/sessions`);

  if(!res) return [];

  const data = await res.json();

  return data.sessions || [];
}