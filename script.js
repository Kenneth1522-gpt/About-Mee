// ====== Konfigurasi Biodata Tri ======
const PROFILE = {
  name: "Tri Cahyo",
  school: "SMK Bhinus",
  age: 17,
  address: "Dusun Segrumung"
};

// ====== Init ======
document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initTheme();
  initAccent();
  initTilt();
  initBlobs();
  initCopyBio();
});

// Tahun footer
function setYear(){ document.getElementById("year")?.textContent = new Date().getFullYear(); }

// Theme toggle + persist
function initTheme(){
  const saved = localStorage.getItem("gen-theme");
  if(saved === "light") document.body.classList.add("light");
  updateThemeIcon();
  document.getElementById("themeToggle").addEventListener("click", ()=>{
    document.body.classList.toggle("light");
    localStorage.setItem("gen-theme", document.body.classList.contains("light") ? "light" : "dark");
    updateThemeIcon();
  });
}
function updateThemeIcon(){
  const btn = document.getElementById("themeToggle");
  const light = document.body.classList.contains("light");
  btn.textContent = light ? "🌞" : "🌙";
}

// Accent picker + persist
function initAccent(){
  const saved = localStorage.getItem("gen-accent");
  if(saved) document.documentElement.style.setProperty("--accent", saved);
  document.querySelectorAll(".accent").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const c = btn.dataset.color;
      document.documentElement.style.setProperty("--accent", c);
      localStorage.setItem("gen-accent", c);
    });
  });
}

// Tilt effect
function initTilt(){
  document.querySelectorAll(".tilt").forEach(el=>{
    el.addEventListener("mousemove", e=>{
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const rx = ((y - r.height/2) / r.height) * -6;
      const ry = ((x - r.width/2) / r.width) * 6;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    el.addEventListener("mouseleave", ()=> el.style.transform = "perspective(900px) rotateX(0) rotateY(0)");
  });
}

// Copy biodata ke clipboard
function initCopyBio(){
  const btn = document.getElementById("copyBio");
  if(!btn) return;
  btn.addEventListener("click", async ()=>{
    const text = `Nama: ${PROFILE.name}\nSekolah: ${PROFILE.school}\nUmur: ${PROFILE.age}\nAlamat: ${PROFILE.address}`;
    try{
      await navigator.clipboard.writeText(text);
      btn.textContent = "Tersalin ✅";
      setTimeout(()=> btn.textContent = "Copy Biodata", 1500);
    }catch{
      alert("Gagal menyalin. Copy manual ya:\n\n" + text);
    }
  });
}

// Form demo: copy ke clipboard
function handleSubmit(e){
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const text = `Halo, aku ${name} (${email}).\n\n${message}`;
  navigator.clipboard.writeText(text)
    .then(()=> alert("Pesan disalin ke clipboard. Tinggal paste ke email/DM 👍"))
    .catch(()=> alert("Gagal menyalin. Silakan copy manual ya."));
  e.target.reset();
  return false;
}

// ====== Animated neon blobs background (no library) ======
function initBlobs(){
  const c = document.getElementById("blobs");
  const ctx = c.getContext("2d");
  let W, H, blobs = [], raf;

  function resize(){
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
    const count = Math.min(14, Math.max(8, Math.floor(W/160)));
    blobs = Array.from({length: count}, ()=>({
      x: Math.random()*W,
      y: Math.random()*H,
      r: 60 + Math.random()*140,
      vx: (Math.random()-.5)*0.4,
      vy: (Math.random()-.5)*0.4,
      hue: Math.random()*360
    }));
  }

  function loop(){
    ctx.clearRect(0,0,W,H);
    // bloom layer
    blobs.forEach(b=>{
      b.x += b.vx; b.y += b.vy;
      if(b.x < -200 || b.x > W+200) b.vx *= -1;
      if(b.y < -200 || b.y > H+200) b.vy *= -1;
      const grad = ctx.createRadialGradient(b.x, b.y, b.r*0.2, b.x, b.y, b.r);
      // gunakan warna aksen + variasi hue
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      grad.addColorStop(0, accent + "cc");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill();
    });
    ctx.globalCompositeOperation = "source-over";
    raf = requestAnimationFrame(loop);
  }

  resize(); loop();
  window.addEventListener("resize", ()=>{
    cancelAnimationFrame(raf); resize(); loop();
  });
}
