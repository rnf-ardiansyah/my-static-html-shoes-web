const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
const shoeModal = document.getElementById('shoeModal');
const closeModal = document.getElementById('closeModal');
const modalShoeImg = document.getElementById('modalShoeImg');
const modalShoeName = document.getElementById('modalShoeName');
const modalShoeDesc = document.getElementById('modalShoeDesc');
const modalShoePrice = document.getElementById('modalShoePrice');
const whatsappBtn = document.getElementById('whatsappBtn');
const heroShoe = document.getElementById('heroShoe');

let resizeTimer;

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

function setupWhatsAppInteraction() {
    let currentProduct = 'default';
    const baseUrl = 'https://wa.me/6289456372844';
    
    // Set default message
    updateWhatsAppLink();
    
    // Product selection handler
    document.querySelectorAll('.btn-product').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            currentProduct = this.getAttribute('data-product');
            updateWhatsAppLink();
            
            // Scroll to CTA section
            document.getElementById('cta').scrollIntoView({
                behavior: 'smooth'
            });
            
            // Show confirmation
            showProductSelectionFeedback(currentProduct);
        });
    });
    
    function updateWhatsAppLink() {
        let message;
        
        if (currentProduct === 'default') {
            message = 'Halo TAPAKØ, saya tertarik dengan produk Anda. Bisa dibantu untuk informasi lebih lanjut?';
        } else {
            message = `Halo TAPAKØ, saya tertarik dengan produk ${currentProduct}. Bisa dibantu untuk informasi lebih lanjut dan pemesanan?`;
        }
        
        whatsappBtn.href = `${baseUrl}?text=${encodeURIComponent(message)}`;
    }
    
    function showProductSelectionFeedback(productName) {
        setTimeout(() => {
            alert(`Anda memilih TAPAKØ - ${productName}. Klik tombol WhatsApp untuk melanjutkan pemesanan.`);
        }, 500);
    }
}

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .product-card, .testimonial-card').forEach(el => {
    observer.observe(el);
});

function preloadImages() {
    const images = document.querySelectorAll('img[src]');
    
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (!src) return;
        
        const image = new Image();
        image.src = src;
        image.onload = () => {
            img.classList.add('loaded');
        };
    });
}

function setupShoeAnimations() {
    if (heroShoe && window.innerWidth > 768) {
        // Mouse move parallax effect for desktop
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            heroShoe.style.transform = `translateZ(20px) rotate(-5deg) translateX(${x}px) translateY(${y}px)`;
        });
        
        // Touch interaction for mobile
        heroShoe.addEventListener('touchstart', () => {
            heroShoe.style.animation = 'none';
            setTimeout(() => {
                heroShoe.style.animation = 'shoeFloat 6s ease-in-out infinite, shoeRotate 20s infinite linear';
            }, 10);
        });
    }
    
    // Product image interactions
    document.querySelectorAll('.product-img').forEach(img => {
        // Click to open modal
        img.addEventListener('click', function() {
            const shoeType = this.getAttribute('data-shoe');
            showShoeModal(shoeType);
        });
        
        // Touch interaction
        img.addEventListener('touchstart', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        img.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

function showShoeModal(shoeType) {
    // Find the product card based on shoe type
    const productImg = document.querySelector(`.product-img[data-shoe="${shoeType}"]`);
    if (!productImg) return;
    
    const productCard = productImg.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    const productDesc = productCard.querySelector('.product-description').textContent;
    const productPrice = productCard.querySelector('.price').textContent;
    const oldPrice = productCard.querySelector('.old-price').textContent;
    
    // Update modal with data from DOM (single source of truth)
    modalShoeImg.src = productImg.src;
    modalShoeImg.alt = productImg.alt;
    modalShoeName.textContent = productName;
    modalShoeDesc.textContent = productDesc;
    modalShoePrice.innerHTML = `
        <span class="price">${productPrice}</span>
        <span class="old-price">${oldPrice}</span>
    `;
    
    shoeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeShoeModal() {
    shoeModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

closeModal.addEventListener('click', closeShoeModal);
shoeModal.addEventListener('click', (e) => {
    if (e.target === shoeModal) {
        closeShoeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && shoeModal.classList.contains('active')) {
        closeShoeModal();
    }
});

function adjustForMobile() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && heroShoe) {
        // Reduce animation intensity on mobile
        document.documentElement.style.setProperty('--float-distance', '10px');
        document.documentElement.style.setProperty('--rotation-angle', '3deg');
    }
}

function setupButtonInteractions() {
    // WhatsApp button hover effect
    whatsappBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    whatsappBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Ripple effect for buttons
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-product').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

function setupNavigationHighlight() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#navMenu a');
    
    function highlightNavLink() {
        let scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
}

// Fungsi untuk menangani resize
function handleResize() {
    adjustForMobile(); // fungsi yang sudah ada
    
    // Jika layar melebihi 768px (mode desktop), sembunyikan menu mobile
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setupWhatsAppInteraction();
    preloadImages();
    setupShoeAnimations();
    adjustForMobile();
    setupButtonInteractions();
    setupNavigationHighlight();
    
    // Window resize handler
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 250);
    });
});