/* =========================================================
   Santhosh S — Portfolio Interactions
   Vanilla JS only: typing effect, scroll reveal, particles,
   nav behavior, counters, certificate modal, back-to-top, form.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  emailjs.init({
    publicKey: "MpFSeuSLIlzg1ntHn"
  });

  /* ---------- Current year in footer ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Typing effect ---------- */
  const typedEl = document.getElementById("typed");
  const phrases = [
    "AI & Data Science Student",
    "Founder & Lead Developer of SASH AI",
    "Data Analytics & ML Developer",
    "Generative AI & Backend Builder",
  ];
  let pIndex = 0;
  let cIndex = 0;
  let deleting = false;

  function type() {
    const current = phrases[pIndex];
    typedEl.textContent = deleting
      ? current.substring(0, cIndex--)
      : current.substring(0, cIndex++);

    let delay = deleting ? 45 : 90;

    if (!deleting && cIndex === current.length + 1) {
      deleting = true;
      delay = 1600;
    } else if (deleting && cIndex < 0) {
      deleting = false;
      cIndex = 0;
      pIndex = (pIndex + 1) % phrases.length;
      delay = 300;
    }
    setTimeout(type, delay);
  }
  type();

  /* ---------- Sticky nav background on scroll ---------- */
  const navbar = document.getElementById("navbar");
  const toTop = document.getElementById("toTop");

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 40);
    toTop.classList.toggle("show", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  navLinks.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- Back to top ---------- */
  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ---------- Scroll reveal + trigger counters ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => observer.observe(el));

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll(".stat__num");
  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-count"), 10);
        const suffix = el.getAttribute("data-suffix") || "";
        let n = 0;
        const step = Math.max(1, Math.ceil(target / 30));
        const tick = () => {
          n = Math.min(n + step, target);
          el.textContent = n + suffix;
          if (n < target) requestAnimationFrame(tick);
        };
        tick();
        obs.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  /* ---------- Certificate Modal / Lightbox ---------- */
  const certModal         = document.getElementById("certModal");
  const certModalImg      = document.getElementById("certModalImg");
  const certModalTitle    = document.getElementById("certModalTitle");
  const certModalMeta     = document.getElementById("certModalMeta");
  const certModalClose    = document.getElementById("certModalClose");
  const certModalBackdrop = document.getElementById("certModalBackdrop");

  function openCertModal(img, title, meta) {
    certModalImg.src     = img;
    certModalImg.alt     = title;
    certModalTitle.textContent = title;
    certModalMeta.innerHTML   = meta;
    certModal.removeAttribute("hidden");
    certModalClose.focus();
    document.body.style.overflow = "hidden";
  }

  function closeCertModal() {
    certModal.setAttribute("hidden", "");
    certModalImg.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".cert--clickable").forEach((btn) => {
    btn.addEventListener("click", () => {
      openCertModal(
        btn.getAttribute("data-img"),
        btn.getAttribute("data-title"),
        btn.getAttribute("data-meta")
      );
    });
  });

  certModalClose.addEventListener("click", closeCertModal);
  certModalBackdrop.addEventListener("click", closeCertModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && certModal && !certModal.hasAttribute("hidden")) {
      closeCertModal();
    }
  });

  /* ---------- Contact Form (EmailJS) ---------- */
  const form   = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailOk || !message) {
      status.style.color = "#ff6b6b";
      status.textContent = "Please fill in all fields with a valid email.";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    status.style.color = "#7dd3fc";
    status.textContent = "Sending your message...";

    emailjs.send(
      "service_k16h2ns",
      "template_d4tar2e",
      {
        name:    name,
        email:   email,
        message: message,
        time:    new Date().toLocaleString()
      }
    ).then(() => {
      status.style.color = "#22c55e";
      status.textContent = "✅ Thank you! Your message has been sent successfully.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
      form.reset();
    }).catch((error) => {
      console.error(error);
      status.style.color = "#ff6b6b";
      status.textContent = "❌ Failed to send message. Please try again later.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    });
  });

  /* ---------- Floating particles background ---------- */
  initParticles();
});

/* =========================================================
   Particle field — lightweight canvas animation
   ========================================================= */
function initParticles() {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let particles = [];
  let width, height;

  function resize() {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const count = Math.min(90, Math.floor((width * height) / 18000));
    particles = Array.from({ length: count }, () => ({
      x:  Math.random() * width,
      y:  Math.random() * height,
      r:  Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0)      p.x = width;
      if (p.x > width)  p.x = 0;
      if (p.y < 0)      p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 200, 150, 0.6)";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dx   = p.x - q.x;
        const dy   = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 200, 150, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}
