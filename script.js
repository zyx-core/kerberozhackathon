// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 2000); // Ensures loader is visible for at least 2 seconds for effect
});

// Countdown Timer
const eventDate = new Date('Jan 30, 2026 09:00:00').getTime();

// Store previous values to detect changes
const prevValues = {
    days: null,
    hours: null,
    minutes: null,
    seconds: null
};

// Animate countdown value with slide effect
function animateCountdownValue(elementId, newValue) {
    const element = document.getElementById(elementId);
    const formattedValue = newValue < 10 ? '0' + newValue : String(newValue);
    
    // Skip animation if value hasn't changed or it's the first render
    if (prevValues[elementId] === formattedValue) {
        return;
    }
    
    // First render - just set the value without animation
    if (prevValues[elementId] === null) {
        element.innerText = formattedValue;
        prevValues[elementId] = formattedValue;
        return;
    }
    
    // Value changed - animate!
    prevValues[elementId] = formattedValue;
    
    const parent = element.parentElement;
    
    // Add slide-out class to current element
    element.classList.add('slide-out');
    
    // Create new element for the incoming number
    const newElement = document.createElement('span');
    newElement.id = elementId;
    newElement.innerText = formattedValue;
    newElement.classList.add('slide-in');
    newElement.style.position = 'absolute';
    newElement.style.width = '100%';
    newElement.style.left = '0';
    
    // Add new element to parent
    parent.appendChild(newElement);
    
    // Clean up after animation completes
    setTimeout(() => {
        element.remove();
        newElement.style.position = '';
        newElement.style.width = '';
        newElement.style.left = '';
        newElement.classList.remove('slide-in');
    }, 400); // Match animation duration
}

function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        animateCountdownValue('days', 0);
        animateCountdownValue('hours', 0);
        animateCountdownValue('minutes', 0);
        animateCountdownValue('seconds', 0);
        clearInterval(timerInterval);
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    animateCountdownValue('days', days);
    animateCountdownValue('hours', hours);
    animateCountdownValue('minutes', minutes);
    animateCountdownValue('seconds', seconds);
}

const timerInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
const scrollProgress = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.boxShadow = 'none';
    }

    // Update Scroll Progress
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollProgress) {
        scrollProgress.style.width = scrolled + "%";
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Animate hamburger icon (optional simple toggle)
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Smooth Scroll for Internal Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Close mobile menu if open
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger, .reveal-prize');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optional: Stop observing once revealed
            // observer.unobserve(entry.target); 
        }
    });
}, {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
});

revealElements.forEach(el => revealObserver.observe(el));
