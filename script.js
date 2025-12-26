// Modern Background Animation with Gradient Orbs
class InteractiveBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'animated-bg';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.trails = [];
        this.gradientOrbs = [];
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.time = 0;
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    init() {
        this.resize();
        this.createTrail();
        this.createGradientOrbs();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Recreate orbs on resize
        this.gradientOrbs = [];
        this.createGradientOrbs();
    }
    
    createTrail() {
        const segments = 20;
        for (let i = 0; i < segments; i++) {
            this.trails.push({
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
                size: 8 - (i * 0.3),
                opacity: 1 - (i * 0.05)
            });
        }
    }
    
    createGradientOrbs() {
        const orbCount = 8;
        for (let i = 0; i < orbCount; i++) {
            this.gradientOrbs.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                baseSize: Math.random() * 350 + 250,
                size: 0,
                targetSize: Math.random() * 350 + 250,
                speedX: (Math.random() - 0.5) * 0.8,
                speedY: (Math.random() - 0.5) * 0.8,
                opacity: Math.random() * 0.15 + 0.08,
                pulseSpeed: Math.random() * 0.003 + 0.002,
                pulsePhase: Math.random() * Math.PI * 2,
                colorIndex: Math.floor(Math.random() * 3),
                angle: Math.random() * Math.PI * 2,
                radius: Math.random() * 200 + 100,
                centerX: Math.random() * this.canvas.width,
                centerY: Math.random() * this.canvas.height,
                orbitSpeed: (Math.random() - 0.5) * 0.01
            });
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            this.targetMouse.x = e.clientX;
            this.targetMouse.y = e.clientY;
        });
    }
    
    updateTrail() {
        // Update mouse position with smooth interpolation
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.15;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.15;
        
        // Update trail segments
        for (let i = this.trails.length - 1; i > 0; i--) {
            this.trails[i].x += (this.trails[i - 1].x - this.trails[i].x) * 0.25;
            this.trails[i].y += (this.trails[i - 1].y - this.trails[i].y) * 0.25;
        }
        
        this.trails[0].x = this.mouse.x;
        this.trails[0].y = this.mouse.y;
    }
    
    updateGradientOrbs() {
        this.gradientOrbs.forEach(orb => {
            // Orbital motion around a center point
            orb.angle += orb.orbitSpeed;
            orb.x = orb.centerX + Math.cos(orb.angle) * orb.radius;
            orb.y = orb.centerY + Math.sin(orb.angle) * orb.radius;
            
            // Also add linear movement
            orb.x += orb.speedX;
            orb.y += orb.speedY;
            
            // Update center point slowly
            orb.centerX += orb.speedX * 0.3;
            orb.centerY += orb.speedY * 0.3;
            
            // Pulsing effect - more noticeable
            orb.pulsePhase += orb.pulseSpeed;
            orb.size = orb.baseSize + Math.sin(orb.pulsePhase) * 80;
            
            // Wrap around edges and reset center
            if (orb.x < -orb.size) {
                orb.x = this.canvas.width + orb.size;
                orb.centerX = orb.x;
            }
            if (orb.x > this.canvas.width + orb.size) {
                orb.x = -orb.size;
                orb.centerX = orb.x;
            }
            if (orb.y < -orb.size) {
                orb.y = this.canvas.height + orb.size;
                orb.centerY = orb.y;
            }
            if (orb.y > this.canvas.height + orb.size) {
                orb.y = -orb.size;
                orb.centerY = orb.y;
            }
        });
    }
    
    drawTrail() {
        // Draw trail segments
        for (let i = 0; i < this.trails.length - 1; i++) {
            const current = this.trails[i];
            const next = this.trails[i + 1];
            
            const gradient = this.ctx.createLinearGradient(
                current.x, current.y, next.x, next.y
            );
            gradient.addColorStop(0, `rgba(99, 102, 241, ${current.opacity * 0.7})`);
            gradient.addColorStop(1, `rgba(139, 92, 246, ${next.opacity * 0.7})`);
            
            this.ctx.beginPath();
            this.ctx.moveTo(current.x, current.y);
            this.ctx.lineTo(next.x, next.y);
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = current.size;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
        }
        
        // Draw head with glow
        const head = this.trails[0];
        const headGradient = this.ctx.createRadialGradient(
            head.x, head.y, 0, head.x, head.y, head.size * 2.5
        );
        headGradient.addColorStop(0, 'rgba(6, 182, 212, 0.7)');
        headGradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.4)');
        headGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
        
        this.ctx.beginPath();
        this.ctx.arc(head.x, head.y, head.size * 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = headGradient;
        this.ctx.fill();
    }
    
    drawGradientOrbs() {
        const colorSets = [
            {
                inner: 'rgba(99, 102, 241, ',
                middle: 'rgba(139, 92, 246, ',
                outer: 'rgba(6, 182, 212, '
            },
            {
                inner: 'rgba(139, 92, 246, ',
                middle: 'rgba(6, 182, 212, ',
                outer: 'rgba(99, 102, 241, '
            },
            {
                inner: 'rgba(6, 182, 212, ',
                middle: 'rgba(99, 102, 241, ',
                outer: 'rgba(139, 92, 246, '
            }
        ];
        
        this.gradientOrbs.forEach(orb => {
            const colors = colorSets[orb.colorIndex];
            const gradient = this.ctx.createRadialGradient(
                orb.x, orb.y, 0,
                orb.x, orb.y, orb.size
            );
            gradient.addColorStop(0, colors.inner + orb.opacity + ')');
            gradient.addColorStop(0.4, colors.middle + orb.opacity * 0.6 + ')');
            gradient.addColorStop(0.7, colors.outer + orb.opacity * 0.3 + ')');
            gradient.addColorStop(1, colors.outer + '0)');
            
            this.ctx.beginPath();
            this.ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });
    }
    
    animate() {
        this.time++;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateTrail();
        this.updateGradientOrbs();
        
        // Draw in order (back to front)
        this.drawGradientOrbs();
        this.drawTrail();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize background animation
let bgAnimation;
window.addEventListener('DOMContentLoaded', () => {
    bgAnimation = new InteractiveBackground();
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .project-card, .education-item, .skill-category').forEach(el => {
    observer.observe(el);
});

// Form Submission with Email/WhatsApp Options
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('senderName').value;
        const message = document.getElementById('message').value;
        const contactMethod = document.querySelector('input[name="contactMethod"]:checked').value;
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Disable button and show loading
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        if (contactMethod === 'email') {
            // Use Gmail compose link - works for anyone with Gmail (most reliable)
            const subject = encodeURIComponent(`Portfolio Contact: Message from ${name}`);
            const body = encodeURIComponent(`Hello Azeem,\n\nMy name is ${name}.\n\nMessage:\n${message}\n\n---\nSent from your portfolio website`);
            
            // Gmail compose URL - works even if user doesn't have Gmail as default
            const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=azeemkhattak60@gmail.com&su=${subject}&body=${body}`;
            
            // Open Gmail compose in new tab
            window.open(gmailLink, '_blank');
            
            // Show success message
            setTimeout(() => {
                alert('Gmail compose window is opening. If you don\'t use Gmail, you can copy the email address (azeemkhattak60@gmail.com) and send the message from your preferred email client.');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                contactForm.reset();
            }, 500);
            
        } else if (contactMethod === 'whatsapp') {
            // Send via WhatsApp
            const whatsappMessage = encodeURIComponent(`Hello Azeem,\n\nMy name is ${name}.\n\nMessage:\n${message}`);
            const whatsappLink = `https://wa.me/923361901430?text=${whatsappMessage}`;
            window.open(whatsappLink, '_blank');
            
            // Show confirmation
            setTimeout(() => {
                alert('WhatsApp is opening. Please send the message to contact Azeem.');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                contactForm.reset();
            }, 500);
        }
    });
}

// Add parallax effect to profile image - DISABLED to maintain image quality
// window.addEventListener('scroll', () => {
//     const profileImage = document.querySelector('.profile-image img');
//     if (profileImage) {
//         const scrolled = window.pageYOffset;
//         const rate = scrolled * 0.5;
//         gsap.set(profileImage, {
//             y: rate,
//             scale: 1.02,
//             force3D: true
//         });
//     }
// });

// ============================================
// GSAP HOVER ANIMATIONS
// ============================================

// Navigation Links Hover
document.querySelectorAll('.nav-menu a').forEach(link => {
    const underline = link.querySelector('::after') || link;
    
    link.addEventListener('mouseenter', () => {
        gsap.to(link, {
            color: '#6366f1',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    link.addEventListener('mouseleave', () => {
        if (!link.classList.contains('active')) {
            gsap.to(link, {
                color: '#a0a0a0',
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    });
});

// Social Links Hover
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, {
            y: -3,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
            color: '#0a0a0a',
            boxShadow: '0 5px 15px rgba(99, 102, 241, 0.4)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    link.addEventListener('mouseleave', () => {
        gsap.to(link, {
            y: 0,
            background: '#1a1a1a',
            color: '#ffffff',
            boxShadow: '0 0 0 rgba(99, 102, 241, 0)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Resume Button Hover
document.querySelectorAll('.resume-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            y: -2,
            boxShadow: '0 5px 20px rgba(99, 102, 241, 0.4)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            y: 0,
            boxShadow: '0 0 0 rgba(99, 102, 241, 0)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Primary Button Hover
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            y: -2,
            boxShadow: '0 5px 20px rgba(99, 102, 241, 0.5)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            y: 0,
            boxShadow: '0 0 0 rgba(99, 102, 241, 0)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Secondary Button Hover
document.querySelectorAll('.btn-secondary').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            y: -2,
            borderColor: '#6366f1',
            color: '#6366f1',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            y: 0,
            borderColor: '#2a2a2a',
            color: '#ffffff',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Profile Image Hover - DISABLED to maintain image quality
// document.querySelectorAll('.profile-image img').forEach(img => {
//     img.addEventListener('mouseenter', () => {
//         gsap.to(img, {
//             scale: 1.02,
//             duration: 0.3,
//             ease: 'power2.out',
//             force3D: true,
//             transformOrigin: 'center center'
//         });
//     });
//     
//     img.addEventListener('mouseleave', () => {
//         gsap.to(img, {
//             scale: 1,
//             duration: 0.3,
//             ease: 'power2.out',
//             force3D: true,
//             transformOrigin: 'center center'
//         });
//     });
// });

// Skill Items Hover
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        gsap.to(item, {
            y: -5,
            borderColor: '#6366f1',
            boxShadow: '0 10px 30px rgba(99, 102, 241, 0.2)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    item.addEventListener('mouseleave', () => {
        gsap.to(item, {
            y: 0,
            borderColor: '#2a2a2a',
            boxShadow: '0 0 0 rgba(99, 102, 241, 0)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Project Cards Hover
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -10,
            borderColor: '#6366f1',
            boxShadow: '0 15px 40px rgba(99, 102, 241, 0.3)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            borderColor: '#2a2a2a',
            boxShadow: '0 0 0 rgba(99, 102, 241, 0)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Project Links Hover
document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, {
            x: 5,
            filter: 'brightness(1.2)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    link.addEventListener('mouseleave', () => {
        gsap.to(link, {
            x: 0,
            filter: 'brightness(1)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Education Items Hover
document.querySelectorAll('.education-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        gsap.to(item, {
            x: 10,
            borderColor: '#6366f1',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    item.addEventListener('mouseleave', () => {
        gsap.to(item, {
            x: 0,
            borderColor: '#2a2a2a',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Contact Items Hover
document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        gsap.to(item, {
            y: -5,
            borderColor: '#6366f1',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    item.addEventListener('mouseleave', () => {
        gsap.to(item, {
            y: 0,
            borderColor: '#2a2a2a',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Contact Method Options Hover
document.querySelectorAll('.method-option').forEach(option => {
    option.addEventListener('mouseenter', () => {
        gsap.to(option, {
            y: -2,
            borderColor: '#6366f1',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    option.addEventListener('mouseleave', () => {
        const isChecked = option.querySelector('input[type="radio"]').checked;
        if (!isChecked) {
            gsap.to(option, {
                y: 0,
                borderColor: '#2a2a2a',
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    });
});



