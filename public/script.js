/* ==========================================================================
   NAVIGATION & UI INTERACTIVITY
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Dom Elements
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scroll-progress');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // 1. Navbar Scroll Effect & Scroll Progress
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Progress Bar Update
        scrollProgress.style.width = scrollPercent + '%';
        
        // Header Shrink/Glassmorphism Class
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active Link Highlight on Scroll
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // 2. Mobile Menu Toggle
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ==========================================================================
    // DYNAMIC TYPING EFFECT (Hero Section)
    // ==========================================================================
    const typingTextElement = document.getElementById('typing-text');
    const words = ['Senior Full-Stack Developer.', 'Cybersecurity Specialist.', 'Systems Architect.'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 50;
        } else {
            typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 120;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            // Pause at full word
            typeDelay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            // Short pause before starting typing new word
            typeDelay = 500;
        }

        setTimeout(typeEffect, typeDelay);
    }

    // Start typing effect
    if (typingTextElement) {
        setTimeout(typeEffect, 1000);
    }

    // ==========================================================================
    // SKILLS PROGRESS BAR ANIMATION (Scroll-Triggered)
    // ==========================================================================
    const skillFills = document.querySelectorAll('.skill-fill');
    
    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const targetWidth = fill.style.width;
                fill.style.width = '0%';
                fill.offsetHeight; // force repaint
                fill.style.width = targetWidth;
                observer.unobserve(fill);
            }
        });
    }, {
        threshold: 0.15
    });

    skillFills.forEach(fill => skillsObserver.observe(fill));

    // Handle Skill Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabTarget = btn.getAttribute('data-tab');
            
            // Remove active states
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active state to clicked
            btn.classList.add('active');
            const targetContent = document.getElementById(tabTarget);
            targetContent.classList.add('active');
            
            // Re-trigger progress bar animations for newly shown tab
            const activeFills = targetContent.querySelectorAll('.skill-fill');
            activeFills.forEach(fill => {
                const width = fill.style.width;
                fill.style.width = '0%';
                fill.offsetHeight;
                fill.style.width = width;
            });
        });
    });

    // ==========================================================================
    // PORTFOLIO FILTERABLE GRID
    // ==========================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');
            
            // Highlight active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter Project Cards
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================================================
    // CONTACT FORM HANDLING & CUSTOM TOAST
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('toast');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            try {
                submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;

                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, subject, message })
                });

                const result = await response.json();

                if (result.success) {
                    showToast(`Thank you, ${name}! Your message has been sent to the database.`);
                    contactForm.reset();
                } else {
                    showToast(`Error: ${result.error}`);
                }
            } catch (err) {
                console.error(err);
                showToast(`Server error! Could not send message.`);
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });

    function showToast(messageText) {
        toast.textContent = messageText;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // ==========================================================================
    // CANVAS-BASED MATRIX DIGITAL RAIN
    // ==========================================================================
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        // Resize canvas to cover hero section properly
        function resizeCanvas() {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Characters to draw (matrix glyphs and binary)
        const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ10';
        const alphabet = katakana.split('');
        
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize) + 1;
        
        const rainDrops = [];
        for (let x = 0; x < columns; x++) {
            rainDrops[x] = Math.random() * -100; // staggered starts
        }
        
        function drawMatrix() {
            // Draw fade backdrop
            ctx.fillStyle = 'rgba(8, 9, 12, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw characters
            ctx.fillStyle = 'rgba(0, 255, 128, 0.35)'; // emerald matrix green
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet[Math.floor(Math.random() * alphabet.length)];
                const x = i * fontSize;
                const y = rainDrops[i] * fontSize;
                
                // Add subtle glow to first drop
                if (Math.random() > 0.98) {
                    ctx.fillStyle = '#ffffff';
                } else {
                    ctx.fillStyle = 'rgba(0, 191, 255, 0.3)'; // alternate cyan
                }
                
                ctx.fillText(text, x, y);
                ctx.fillStyle = 'rgba(0, 255, 128, 0.35)';
                
                // Reset drop to top when it hits the bottom
                if (y > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        }
        
        setInterval(drawMatrix, 33); // approx 30 fps
    }

    // ==========================================================================
    // INTERACTIVE TERMINAL WIDGET LOGIC
    // ==========================================================================
    const terminalBody = document.getElementById('terminal-body');
    const terminalInput = document.getElementById('terminal-input');

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const commandLine = terminalInput.value.trim();
                const command = commandLine.toLowerCase();
                
                // Print history line
                printTerminalLine(`guest@ikosh.dev:~/portfolio$ ${commandLine}`, 'term-prompt');
                
                // Process command
                if (command !== '') {
                    parseTerminalCommand(command);
                }
                
                // Clear input
                terminalInput.value = '';
                
                // Scroll to bottom
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        });
        
        // Auto focus input on terminal click
        const terminalWidget = document.querySelector('.terminal-widget');
        if (terminalWidget) {
            terminalWidget.addEventListener('click', () => {
                terminalInput.focus();
            });
        }
    }

    function printTerminalLine(text, className = '') {
        const line = document.createElement('div');
        line.className = 'terminal-line ' + className;
        line.innerHTML = text;
        
        // Insert before the input line
        const inputLine = document.querySelector('.terminal-line-input');
        terminalBody.insertBefore(line, inputLine);
    }

    function parseTerminalCommand(command) {
        switch (command) {
            case 'help':
                printTerminalLine('Available Commands:', 'term-system');
                printTerminalLine('  <span class="term-keyword">about</span>     - Brief biography about Ikrom');
                printTerminalLine('  <span class="term-keyword">skills</span>    - List core technologies and coding stacks');
                printTerminalLine('  <span class="term-keyword">projects</span>  - List major software engineering works');
                printTerminalLine('  <span class="term-keyword">scan</span>      - Trigger security scanner simulation audit');
                printTerminalLine('  <span class="term-keyword">contact</span>   - Show email, phone number, and location details');
                printTerminalLine('  <span class="term-keyword">socials</span>   - Get official GitHub, Telegram, and socials links');
                printTerminalLine('  <span class="term-keyword">clear</span>     - Clear terminal buffer logs');
                break;
                
            case 'about':
                printTerminalLine('Ism: Islomov Ikrom Burxon o‘g‘li (Age: 20)');
                printTerminalLine('Kasb: Senior Full-Stack Developer & Cybersecurity Specialist');
                printTerminalLine('Bio: Currently a second-year student at ITPU University. Designing full-stack web products, coding optimized backends (Python, C#), systems (C++), and running network pen-testing checks.');
                break;
                
            case 'skills':
                printTerminalLine('Frontend: HTML5, CSS3, JavaScript (ES6+), Bootstrap, Responsive UI/UX', 'term-accent');
                printTerminalLine('Backend & Systems: Python Scripting, C# (.NET Core), C/C++ Development', 'term-accent');
                printTerminalLine('Cybersecurity: Penetration Testing, OWASP Top 10 defenses, SSL audit, Git/GitHub', 'term-accent');
                break;
                
            case 'projects':
                printTerminalLine('1. <span class="term-keyword">ASR Plaza Hotel Website</span> - Booking & listings (HTML/CSS/JS/Python)');
                printTerminalLine('2. <span class="term-keyword">Electronica Store</span> - E-commerce platform (JS/HTML/CSS/C#)');
                printTerminalLine('3. <span class="term-keyword">Online Taxi Platform</span> - Booking simulation (HTML/CSS/JS/C#)');
                printTerminalLine('4. <span class="term-keyword">Car Marketplace</span> - Vehicle database listings (HTML/CSS/JS/Python)');
                printTerminalLine('5. <span class="term-keyword">Restaurant Ordering</span> - Table reservation cart (JS/Python/C#)');
                printTerminalLine('6. <span class="term-keyword">Freelance Service</span> - specialist connector (HTML/CSS/JS/Python)');
                printTerminalLine('7. <span class="term-keyword">Online Mega-Store</span> - Uzum style grid layout (HTML/CSS/JS/Python)');
                printTerminalLine('8. <span class="term-keyword">AI Security integrations</span> - Log analyzer parser (C++/C#/Python)');
                printTerminalLine('Click on any card in the "Projects" section below to see detailed specifications!');
                break;
                
            case 'scan':
                printTerminalLine('Triggering network audit daemon... Authorized.', 'term-accent');
                triggerSecurityScan();
                break;
                
            case 'contact':
                printTerminalLine('Email:    ikoshdev@gmail.com');
                printTerminalLine('Phone:    +998 91 590 39 49');
                printTerminalLine('Address:  Jizzax viloyati, Sharof Rashidov tumani, O\'zbekiston');
                break;
                
            case 'socials':
                printTerminalLine('GitHub:    <a href="https://github.com/ikoshdev-lab" target="_blank">github.com/ikoshdev-lab</a>');
                printTerminalLine('Telegram:  <a href="https://t.me/ikosh_dev" target="_blank">t.me/ikosh_dev</a>');
                printTerminalLine('Instagram: <a href="https://instagram.com/ikosh.dev" target="_blank">@ikosh.dev</a>');
                break;
                
            case 'clear':
                // Remove all line elements except the input line
                const lines = terminalBody.querySelectorAll('.terminal-line');
                lines.forEach(l => l.remove());
                break;
                
            default:
                printTerminalLine(`bash: command not found: ${command}. Type 'help' for valid options.`, 'text-danger');
        }
    }

    // ==========================================================================
    // CYBER SECURITY SCANNER SEQUENCER
    // ==========================================================================
    const scanBtn = document.getElementById('btn-run-scan');
    const scanBar = document.getElementById('scanner-bar');
    const scanLogs = document.getElementById('scanner-logs');
    let isScanning = false;

    if (scanBtn) {
        scanBtn.addEventListener('click', () => {
            triggerSecurityScan();
        });
    }

    function triggerSecurityScan() {
        if (isScanning) return;
        isScanning = true;
        
        // Reset logs and bar
        scanLogs.innerHTML = '';
        scanBar.style.width = '0%';
        scanBtn.disabled = true;
        scanBtn.textContent = 'Auditing...';
        
        const timestamp = () => `[${new Date().toLocaleTimeString()}]`;
        const logLines = [
            { text: `${timestamp()} SCAN: Initializing security core daemon v2.0...`, type: 'text-muted', delay: 0 },
            { text: `${timestamp()} SECURE: Parsing firewall routes & active connections...`, type: 'log-line', delay: 800 },
            { text: `${timestamp()} SECURE: Checking network ports 22, 80, 443, 8080...`, type: 'log-line', delay: 1600 },
            { text: `${timestamp()} SECURE: Port audit complete. 0 vulnerabilities found.`, type: 'log-success', delay: 2400 },
            { text: `${timestamp()} AUDIT: Inspecting web directory config files...`, type: 'log-line', delay: 3000 },
            { text: `${timestamp()} WARN: Detected backup server directory endpoint.`, type: 'log-warn', delay: 3800 },
            { text: `${timestamp()} SECURE: Sanitizing input fields against OWASP SQLi/XSS...`, type: 'log-line', delay: 4500 },
            { text: `${timestamp()} CRYPTO: Auditing cryptographic key hashes & JWT settings...`, type: 'log-line', delay: 5200 },
            { text: `${timestamp()} SUCCESS: Security audit finalized. Shield status: 100% SECURED.`, type: 'log-success', delay: 6000 }
        ];

        // Animate scanner bar width
        let progress = 0;
        const progressInterval = setInterval(() => {
            if (progress >= 100) {
                clearInterval(progressInterval);
            } else {
                progress += 1.67; // progress matching 6000ms total
                scanBar.style.width = progress + '%';
            }
        }, 100);

        // Sequence print logs
        logLines.forEach(log => {
            setTimeout(() => {
                const logEl = document.createElement('div');
                logEl.className = 'log-line ' + log.type;
                logEl.textContent = log.text;
                scanLogs.appendChild(logEl);
                scanLogs.scrollTop = scanLogs.scrollHeight;
                
                // Check if last log is printed to finalize scan state
                if (log.delay === 6000) {
                    isScanning = false;
                    scanBtn.disabled = false;
                    scanBtn.textContent = 'Restart Audit';
                    showToast('Xavfsizlik tekshiruvi muvaffaqiyatli yakunlandi!');
                }
            }, log.delay);
        });
    }
});

// ==========================================================================
// CERTIFICATE VISUALIZER MODAL
// ==========================================================================
const certModal = document.getElementById('cert-modal');
const certModalBody = document.getElementById('cert-modal-body');

const certificatesData = {
    'frontend-cert': {
        title: 'Front-End Development',
        issuer: 'Professional Certificate / Online Academy',
        statement: 'This credential verifies that Ikrom Islomov has successfully completed advanced training in HTML5, CSS3, JavaScript ES6+, Responsive Design Architectures, Bootstrap Layout frameworks, and modern Web Optimization strategies.',
        date: 'December 2024'
    },
    'python-cert': {
        title: 'Python Programming',
        issuer: 'Professional Certificate / Tech Center',
        statement: 'This credential verifies that Ikrom Islomov has demonstrated professional competency in core Python architectures, object-oriented concepts, algorithm design, file automation scripts, and database integrations.',
        date: 'October 2024'
    }
};

function openCertModal(certId) {
    const cert = certificatesData[certId];
    if (!cert) return;
    
    certModalBody.innerHTML = `
        <div class="cert-template">
            <div class="cert-template-border"></div>
            <div class="cert-logo">
                <i class="fa-solid fa-medal"></i>
            </div>
            <h3 class="cert-title-main">Certificate of Completion</h3>
            <p class="cert-subtitle-main">${cert.title}</p>
            
            <p class="cert-recipient-label">This is proudly presented to</p>
            <h4 class="cert-recipient-name">Ikrom Islomov</h4>
            
            <p class="cert-statement">${cert.statement}</p>
            
            <div class="cert-footer-info">
                <div class="cert-sig">
                    <h5>Official verification</h5>
                    <p>ikosh.dev</p>
                </div>
                <div class="cert-date">
                    <h5>Date of Issue</h5>
                    <p>${cert.date}</p>
                </div>
            </div>
        </div>
    `;
    
    certModal.style.display = 'flex';
}

function closeCertModal() {
    certModal.style.display = 'none';
}

// ==========================================================================
// PROJECT DETAILS MODAL DYNAMIC DATA MAPPING
// ==========================================================================
const projectModal = document.getElementById('project-modal');
const projectModalBody = document.getElementById('project-modal-body');

const projectsData = {
    'asr-hotel': {
        title: 'ASR Plaza Hotel Website',
        category: 'Web App Integration',
        desc: 'A premium hotel presentation and booking interface equipped with interactive room listings, visual galleries, and secure booking flows.',
        challenge: 'Resolving visual layout shifts when loading room booking state dynamically and maintaining a consistent responsive aspect ratio on high-resolution displays.',
        security: 'Protected booking queries via custom sanitizer scripts, mitigated SQL injection vulnerabilities on request forms, and implemented strict HTTPS redirects.',
        tech: ['HTML5', 'CSS3', 'JavaScript', 'Python Scripting', 'Bootstrap']
    },
    'electronica': {
        title: 'Electronica Store',
        category: 'Enterprise E-Commerce',
        desc: 'A modern e-commerce platform for tech devices. Features responsive layout grid, shopping cart functionality, filters, and dynamic calculations.',
        challenge: 'Synchronizing item inventory states in real-time across multiple client sessions without triggering redundant database operations.',
        security: 'Utilized secure session hashes to prevent cart tampering, implemented ASP.NET Anti-Forgery tokens on client checkout requests, and secured REST endpoints.',
        tech: ['C# (.NET Core)', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap']
    },
    'online-taxi': {
        title: 'Online Taxi Platform',
        category: 'Client Map Engine',
        desc: 'A taxi booking client interface simulating distance-based pricing, driver tracking visuals, and localized map integration templates.',
        challenge: 'Creating a mathematically accurate coordinate distance parser using client-side JavaScript calculations matching latency goals.',
        security: 'Implemented token-based API request parameters to shield geolocation coordinate endpoints, preventing unauthorized driver sniffing.',
        tech: ['HTML5', 'CSS3', 'JavaScript', 'C# Backend APIs', 'Bootstrap']
    },
    'car-marketplace': {
        title: 'Car Marketplace Website',
        category: 'Database Listings Directory',
        desc: 'A vehicle selling database interface enabling multi-criteria searches, price sliders, and comparison lists for auto listings.',
        challenge: 'Optimizing database index search queries matching multiple criteria (make, model, year, price range) under 100ms response time.',
        security: 'Implemented strict parameter validation queries to prevent malicious code injection via the multi-filter input forms.',
        tech: ['Python APIs', 'HTML5', 'CSS3', 'JavaScript', 'Bootstrap']
    },
    'restaurant-system': {
        title: 'Restaurant Ordering System',
        category: 'Table Reservation Suite',
        desc: 'A digital restaurant table booking and ordering menu. Equipped with cart persistence, meal customization details, and receipt printing templates.',
        challenge: 'Managing nested product states (custom pizza toppings, drinks, sizes) inside a local storage cart state while ensuring accurate checkout calculations.',
        security: 'Implemented dual-validation checkout calculations (client-side matching backend logs) to block user request manipulation attacks.',
        tech: ['JavaScript', 'Python APIs', 'C# Backend', 'HTML5', 'Bootstrap']
    },
    'freelance-platform': {
        title: 'Freelance Service Platform',
        category: 'Specialist Work Portal',
        desc: 'Connecting developers and clients. Visual job postings board, specialist profile cards, and proposal submission interface mockups.',
        challenge: 'Designing a flexible grid alignment that adjusts when freelancers dynamically update cards with varying description heights.',
        security: 'Implemented strict file upload filtering structures to block malicious scripts when freelancers upload resume files.',
        tech: ['HTML5', 'CSS3', 'JavaScript', 'Python Database Handler', 'Bootstrap']
    },
    'uzum-store': {
        title: 'Online Mega-Store (Uzum Style)',
        category: 'Complex E-Commerce Suite',
        desc: 'Complex product grid layout, categorizations, wishlist states, interactive reviews section, and cart slider drawer.',
        challenge: 'Optimizing initial render times for extensive product category grids containing hundreds of images using lazy-loading methods.',
        security: 'Utilized cross-site scripting (XSS) input escaping filters on review input boxes to stop automated comment scripts.',
        tech: ['HTML5', 'CSS3', 'JavaScript', 'Python Scripts', 'Bootstrap']
    },
    'ai-security': {
        title: 'AI Security Integrations',
        category: 'Security Auditing System',
        desc: 'Low-level C/C++ memory protection modules, Python scripting tools analyzing network signatures, and integrating AI API calls to evaluate log records.',
        challenge: 'Designing a high-performance C/C++ buffer inspection routine that filters network logs without causing CPU bottlenecks.',
        security: 'Secured log parser directories using cryptographic hashing (SHA-256) verifying config integrity, preventing rootkit log modifications.',
        tech: ['C / C++', 'Python Scripting', 'C# Core Parser', 'HTML/CSS/JS']
    }
};

function openProjectModal(projId) {
    const proj = projectsData[projId];
    if (!proj) return;
    
    // Join tech tags into HTML markup
    const techTagsHTML = proj.tech.map(t => `<span>${t}</span>`).join('');
    
    projectModalBody.innerHTML = `
        <div class="proj-modal-header">
            <span class="proj-modal-category">${proj.category}</span>
            <h3 class="proj-modal-title">${proj.title}</h3>
        </div>
        
        <div class="proj-modal-layout">
            <div class="proj-modal-main">
                <h4 class="proj-modal-section-title">Project Overview</h4>
                <p>${proj.desc}</p>
                
                <h4 class="proj-modal-section-title">Development Challenge</h4>
                <p>${proj.challenge}</p>
            </div>
            
            <div class="proj-modal-side">
                <div class="proj-side-box proj-tech-box">
                    <h4>Tech Stack</h4>
                    <div class="tech-tags">
                        ${techTagsHTML}
                    </div>
                </div>
                
                <div class="proj-side-box proj-security-box">
                    <h4><i class="fa-solid fa-shield-halved"></i> Security Architecture</h4>
                    <p>${proj.security}</p>
                </div>
            </div>
        </div>
        
        <div class="proj-modal-links">
            <a href="https://github.com/ikoshdev-lab" target="_blank" class="btn btn-primary"><i class="fa-brands fa-github"></i> Source Code</a>
            <button class="btn btn-outline" onclick="closeProjectModal()">Close Modal</button>
        </div>
    `;
    
    projectModal.style.display = 'flex';
}

function closeProjectModal() {
    projectModal.style.display = 'none';
}

// Close modals when user clicks outside the modal-content
window.addEventListener('click', (e) => {
    if (e.target === certModal) {
        closeCertModal();
    }
    if (e.target === projectModal) {
        closeProjectModal();
    }
});
