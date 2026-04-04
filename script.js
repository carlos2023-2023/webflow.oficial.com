/* =============================================
   WEBFLOW CO. — Scripts
   ============================================= */

// CANVAS DE ESTRELLAS
const canvas = document.getElementById('stars');
const ctx    = canvas.getContext('2d');
let stars    = [];

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }

function initStars() {
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 1.4 + 0.2,
      o:  Math.random(),
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,' + s.o + ')';
    ctx.fill();
    s.o += Math.sin(Date.now() * 0.0008 + s.x) * 0.004;
    s.o  = Math.max(0.05, Math.min(0.85, s.o));
    s.x += s.dx; s.y += s.dy;
    if (s.x < 0)             s.x = canvas.width;
    if (s.x > canvas.width)  s.x = 0;
    if (s.y < 0)             s.y = canvas.height;
    if (s.y > canvas.height) s.y = 0;
  });
}

function animateStars() { drawStars(); requestAnimationFrame(animateStars); }
resizeCanvas(); initStars(); animateStars();
window.addEventListener('resize', () => { resizeCanvas(); initStars(); });

// MENÚ MÓVIL
function toggleMenu() { document.getElementById('mobileMenu').classList.toggle('open'); }

// MODAL
function openModal()  { document.getElementById('modalOverlay').classList.add('open'); }
function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }
function closeModalOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

function switchMTab(tab) {
  ['Login','Register','Recovery','Code'].forEach(name => {
    const f = document.getElementById('m' + name);
    if (f) f.classList.remove('active');
  });
  document.querySelectorAll('.modal-tab').forEach((el, i) => {
    el.classList.toggle('active', ['login','register','recovery'].indexOf(tab) === i);
  });
  const activeForm = document.getElementById('m' + tab.charAt(0).toUpperCase() + tab.slice(1));
  if (activeForm) activeForm.classList.add('active');
}

function showRecovery() {
  document.getElementById('recTab').style.display = 'flex';
  switchMTab('recovery');
}

function selRec(type) {
  document.getElementById('rEmail').classList.toggle('sel', type === 'email');
  document.getElementById('rSms').classList.toggle('sel', type === 'sms');
  document.getElementById('recEF').style.display = type === 'email' ? 'block' : 'none';
  document.getElementById('recSF').style.display = type === 'sms'   ? 'block' : 'none';
}

function sendRec() {
  const isSms = document.getElementById('rSms').classList.contains('sel');
  document.getElementById('codMsg').textContent = isSms ? 'Código enviado por SMS.' : 'Código enviado a tu correo.';
  ['Login','Register','Recovery'].forEach(name => {
    const f = document.getElementById('m' + name);
    if (f) f.classList.remove('active');
  });
  document.getElementById('mCode').classList.add('active');
}

// LOGIN CON ACCESO ADMIN
const ADMIN_EMAIL = 'admin@webflow.co';
const ADMIN_PASS  = 'admin2026';

function doLogin() {
  const email = document.getElementById('mEmail').value.trim();
  const pass  = document.getElementById('mPass').value;
  if (!email || !pass) { alert('Completa todos los campos.'); return; }

  if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
    sessionStorage.setItem('wf_admin', '1');
    sessionStorage.setItem('wf_user', 'Administrador');
    closeModal();
    window.location.href = 'admin.html';
    return;
  }
  sessionStorage.setItem('wf_user', email);
  alert('Bienvenido a Webflow CO. ✓');
  closeModal();
}

function doRegister() { alert('Cuenta creada exitosamente. ✓'); }

function chkStr(value) {
  const bar = document.getElementById('strBar');
  let score = 0;
  if (value.length > 6)           score++;
  if (value.length > 10)          score++;
  if (/[A-Z]/.test(value))        score++;
  if (/[0-9]/.test(value))        score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  const widths = ['0%','20%','40%','60%','80%','100%'];
  const colors = ['#1a1a1a','#e24b4a','#ef9f27','#ef9f27','#1d9e75','#1d9e75'];
  bar.style.width      = widths[score];
  bar.style.background = colors[score];
}

// =============================================
// FORMULARIO DE CONTACTO → guarda en localStorage
// =============================================
function sendContact() {
  // Leer campos del formulario de contacto
  const campos = document.querySelectorAll('#contacto input, #contacto textarea, #contacto select');
  let nombre   = '', telefono = '', correo = '', tipo = '', mensaje = '';

  campos.forEach(el => {
    const label = el.previousElementSibling;
    const lbl   = label ? label.textContent.toLowerCase() : '';
    if (el.type === 'text'  && lbl.includes('nombre'))   nombre   = el.value.trim();
    if (el.type === 'tel')                               telefono = el.value.trim();
    if (el.type === 'email')                             correo   = el.value.trim();
    if (el.tagName === 'SELECT')                         tipo     = el.value;
    if (el.tagName === 'TEXTAREA')                       mensaje  = el.value.trim();
  });

  if (!nombre && !correo && !mensaje) {
    alert('Por favor completa el formulario antes de enviar.');
    return;
  }

  // Construir mensaje
  const nuevo = {
    id:       Date.now(),
    ts:       Date.now(),
    nombre:   nombre   || 'Sin nombre',
    telefono: telefono || '',
    correo:   correo   || '',
    tipo:     tipo     || '',
    mensaje:  mensaje  || '',
    leido:    false
  };

  // Guardar en localStorage (admin.html lo leerá)
  const KEY   = 'wf_mensajes';
  let arr     = [];
  try { arr = JSON.parse(localStorage.getItem(KEY)) || []; } catch(e) { arr = []; }
  arr.unshift(nuevo);
  localStorage.setItem(KEY, JSON.stringify(arr));

  // Limpiar formulario
  campos.forEach(el => {
    if (el.tagName === 'SELECT') el.selectedIndex = 0;
    else el.value = '';
  });

  alert('¡Mensaje enviado! Te contactaremos pronto. ✓\n\nPuedes ver este mensaje en el Panel de Administración → Mensajes.');
}

// SCROLL SUAVE
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target && anchor.getAttribute('href') !== '#') {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});