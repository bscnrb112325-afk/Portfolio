// Automatically update copyright year
document.getElementById('year').textContent = new Date().getFullYear();

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once it's visible
        }
    });
}, observerOptions);

// Select all elements that need to animate in
const animateElements = document.querySelectorAll('.fade-in-up');

animateElements.forEach(el => {
    observer.observe(el);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Offset for fixed navbar
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Profile Photo Upload Handling
const photoUpload = document.getElementById('photo-upload');
const profileImage = document.getElementById('profile-image');
const avatarIcon = document.getElementById('avatar-icon');

// Check if there's a saved photo in localStorage
const savedPhoto = localStorage.getItem('profilePhoto');
if (savedPhoto && profileImage) {
    profileImage.src = savedPhoto;
    profileImage.style.display = 'block';
    if (avatarIcon) avatarIcon.style.display = 'none';
}

if (photoUpload && profileImage) {
    photoUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageUrl = event.target.result;
                profileImage.src = imageUrl;
                profileImage.style.display = 'block';
                if (avatarIcon) avatarIcon.style.display = 'none';
                
                // Save to localStorage so it persists across reloads
                try {
                    localStorage.setItem('profilePhoto', imageUrl);
                } catch (err) {
                    console.warn("Image too large to save in localStorage.");
                }
            };
            reader.readAsDataURL(file);
        }
    });
}