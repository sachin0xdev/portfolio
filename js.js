/**
 * SACHINDEV PORTFOLIO — JAVASCRIPT LOGIC
 * Brand: SACHINDEV (Sachin Tyagi)
 * Features: Cyber Background Canvas, Interactive Terminal CLI, Scroll Observer, Navigation, Clipboard Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initCanvasBackground();
  initTerminal();
  initScrollAnimations();
});

/* --------------------------------------------------------------------------
   01. NAVBAR SCROLL & ACTIVE SPY
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy
    let current = '';
    const scrollPos = window.pageYOffset + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = '#' + section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   02. MOBILE MENU DRAWER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  function openMenu() {
    btn.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* --------------------------------------------------------------------------
   03. AMBIENT CYBER CANVAS BACKGROUND
   -------------------------------------------------------------------------- */
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  // Check prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 25), 45);

  let mouse = { x: null, y: null, maxDist: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79, 172, 254, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect to mouse if nearby
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = particles[i].x - mouse.x;
        const mdy = particles[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < mouse.maxDist) {
          const malpha = (1 - mdist / mouse.maxDist) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${malpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   04. INTERACTIVE DEVELOPER TERMINAL CLI
   -------------------------------------------------------------------------- */
function initTerminal() {
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');
  const log = document.getElementById('terminal-interactive-log');
  const body = document.getElementById('terminal-body');

  if (!form || !input || !log) return;

  const commands = {
    help: () => `
      <div class="text-slate-300">
        <span class="text-cyan-400 font-bold">Available Commands:</span><br>
        • <span class="text-emerald-400">whoami</span>   - Identity and stream overview<br>
        • <span class="text-emerald-400">status</span>   - Current focus and activities<br>
        • <span class="text-emerald-400">focus</span>    - Technologies &amp; learning areas<br>
        • <span class="text-emerald-400">skills</span>   - List core competencies<br>
        • <span class="text-emerald-400">motto</span>    - Core development philosophy<br>
        • <span class="text-emerald-400">pcm</span>      - Class 12 PCM background<br>
        • <span class="text-emerald-400">contact</span>  - Direct phone &amp; email details<br>
        • <span class="text-emerald-400">clear</span>    - Clear terminal output
      </div>
    `,
    whoami: () => `
      <div class="text-slate-200">
        <strong>Sachin Tyagi</strong> [SACHINDEV]<br>
        <span class="text-slate-400">Stage:</span> Class 12 PCM Student<br>
        <span class="text-slate-400">Role:</span> Young Developer, Cybersecurity Learner &amp; CLI Builder
      </div>
    `,
    status: () => `
      <div class="text-emerald-400">
        ● Learning • Building • Experimenting<br>
        <span class="text-slate-300 text-[11px]">Balancing Class 12 PCM studies with practical code and security labs.</span>
      </div>
    `,
    focus: () => `
      <div class="text-cyan-300">
        Python Development • Cybersecurity Fundamentals • CLI Tools • Modern Web UI
      </div>
    `,
    pcm: () => `
      <div class="text-slate-300">
        <span class="text-violet-400 font-bold">Class 12 Stream:</span> Physics, Chemistry, Mathematics (PCM)<br>
        <span class="text-slate-400">Application:</span> Applying mathematical logic and analytical thinking to programming.
      </div>
    `,
    skills: () => `
      <div class="text-slate-300">
        • <span class="text-emerald-400">Python</span> (Comfortable) | <span class="text-emerald-400">HTML5/CSS3</span> (Comfortable)<br>
        • <span class="text-cyan-400">JavaScript</span> (Building) | <span class="text-cyan-400">CLI Tools</span> (Building)<br>
        • <span class="text-violet-400">Cybersecurity</span> (Learning) | <span class="text-amber-400">Linux / Bash</span> (Exploring)
      </div>
    `,
    motto: () => `
      <div class="text-cyan-400 font-semibold">
        "Learn → Build → Break → Understand → Improve"
      </div>
    `,
    contact: () => `
      <div class="text-slate-300">
        • Phone: <span class="text-emerald-400">+91 6372750569</span><br>
        • Email: <span class="text-cyan-400">sachintyagi13933@gail.com</span>
      </div>
    `,
    date: () => `
      <div class="text-slate-400">${new Date().toLocaleString()}</div>
    `,
    clear: () => {
      log.innerHTML = '';
      return '';
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleCommand();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand();
    }
  });

  function handleCommand() {
    const rawVal = input.value.trim();
    if (!rawVal) return;

    const cmd = rawVal.toLowerCase();
    input.value = '';

    if (cmd === 'clear') {
      commands.clear();
      return;
    }

    // Append command line
    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-line mt-1';
    cmdLine.innerHTML = `<span class="prompt text-cyan-400 font-bold">$</span> <span class="command text-white">${escapeHtml(rawVal)}</span>`;
    log.appendChild(cmdLine);

    // Append output
    const outputDiv = document.createElement('div');
    outputDiv.className = 'term-output-block text-slate-300 pl-3 my-1';

    if (commands[cmd]) {
      outputDiv.innerHTML = commands[cmd]();
    } else {
      outputDiv.innerHTML = `<span class="text-rose-400">command not found: "${escapeHtml(cmd)}". Type <strong class="text-emerald-400">'help'</strong> for available commands.</span>`;
    }

    log.appendChild(outputDiv);

    // Scroll to bottom of terminal
    body.scrollTop = body.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

/* --------------------------------------------------------------------------
   05. CLIPBOARD COPY & TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
window.copyToClipboard = function(text, successMessage) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage || 'Copied to clipboard!');
    }).catch(() => {
      fallbackCopy(text, successMessage);
    });
  } else {
    fallbackCopy(text, successMessage);
  }
};

function fallbackCopy(text, successMessage) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMessage || 'Copied to clipboard!');
  } catch (err) {
    showToast('Failed to copy');
  }
  document.body.removeChild(textArea);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.innerHTML = `<span class="text-cyan-400 mr-1.5 font-bold">✓</span> ${message}`;
  toast.classList.add('show');

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* --------------------------------------------------------------------------
   06. SCROLL REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const animElements = document.querySelectorAll(
    '.feature-card, .skill-category-card, .build-card, .timeline-item, .project-card, .contact-card'
  );

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  animElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index % 3 * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index % 3 * 0.1}s`;
    observer.observe(el);
  });

  // Inject revealed class CSS rule dynamically if needed
  const style = document.createElement('style');
  style.textContent = `
    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}
