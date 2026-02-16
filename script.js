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

// Toggle menu mobile
mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Mencegah event bubbling
    navMenu.classList.toggle('active');
    mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Tutup menu jika klik di luar
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// ========== PENANGANAN KLIK TAUTAN NAVIGASI (MOBILE + DESKTOP) ==========
document.querySelectorAll('#navMenu a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Mencegah lompatan langsung
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Tutup menu mobile jika sedang terbuka
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            
            // Hitung posisi scroll dengan offset header (80px)
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 10; // tambah sedikit ruang
            
            // Scroll halus
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Fallback untuk browser lama
            if (!('scrollBehavior' in document.documentElement.style)) {
                window.scrollTo(0, targetPosition);
            }
        } else {
            console.warn('Elemen target tidak ditemukan:', targetId);
        }
    });
});

// Setup interaksi WhatsApp
function setupWhatsAppInteraction() {
    let currentProduct = 'default';
    const baseUrl = 'https://wa.me/6289456372844';
    
    // Update link default
    updateWhatsAppLink();
    
    // Produk dipilih
    document.querySelectorAll('.btn-product').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            currentProduct = this.getAttribute('data-product');
            updateWhatsAppLink();
            
            document.getElementById('cta').scrollIntoView({ behavior: 'smooth' });
            showProductSelectionFeedback(currentProduct);
        });
    });
    
    function updateWhatsAppLink() {
        let message = currentProduct === 'default'
            ? 'Halo TAPAKØ, saya tertarik dengan produk Anda. Bisa dibantu untuk informasi lebih lanjut?'
            : `Halo TAPAKØ, saya tertarik dengan produk ${currentProduct}. Bisa dibantu untuk informasi lebih lanjut dan pemesanan?`;
        whatsappBtn.href = `${baseUrl}?text=${encodeURIComponent(message)}`;
    }
    
    function showProductSelectionFeedback(productName) {
        setTimeout(() => {
            alert(`Anda memilih TAPAKØ - ${productName}. Klik tombol WhatsApp untuk melanjutkan pemesanan.`);
        }, 500);
    }
}

// Efek scroll pada header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Intersection Observer untuk animasi elemen
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animated');
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .product-card, .testimonial-card').forEach(el => observer.observe(el));

// Preload gambar
function preloadImages() {
    document.querySelectorAll('img[src]').forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const image = new Image();
            image.src = src;
            image.onload = () => img.classList.add('loaded');
        }
    });
}

// Animasi sepatu
function setupShoeAnimations() {
    if (heroShoe && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            heroShoe.style.transform = `translateZ(20px) rotate(-5deg) translateX(${x}px) translateY(${y}px)`;
        });
        
        heroShoe.addEventListener('touchstart', () => {
            heroShoe.style.animation = 'none';
            setTimeout(() => {
                heroShoe.style.animation = 'shoeFloat 6s ease-in-out infinite, shoeRotate 20s infinite linear';
            }, 10);
        });
    }
    
    document.querySelectorAll('.product-img').forEach(img => {
        img.addEventListener('click', function() {
            const shoeType = this.getAttribute('data-shoe');
            showShoeModal(shoeType);
        });
        
        img.addEventListener('touchstart', function() { this.style.transform = 'scale(1.05)'; });
        img.addEventListener('touchend', function() { this.style.transform = 'scale(1)'; });
    });
}

// Modal produk
function showShoeModal(shoeType) {
    const productImg = document.querySelector(`.product-img[data-shoe="${shoeType}"]`);
    if (!productImg) return;
    
    const productCard = productImg.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    const productDesc = productCard.querySelector('.product-description').textContent;
    const productPrice = productCard.querySelector('.price').textContent;
    const oldPrice = productCard.querySelector('.old-price').textContent;
    
    modalShoeImg.src = productImg.src;
    modalShoeImg.alt = productImg.alt;
    modalShoeName.textContent = productName;
    modalShoeDesc.textContent = productDesc;
    modalShoePrice.innerHTML = `<span class="price">${productPrice}</span> <span class="old-price">${oldPrice}</span>`;
    
    shoeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeShoeModal() {
    shoeModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

closeModal.addEventListener('click', closeShoeModal);
shoeModal.addEventListener('click', (e) => { if (e.target === shoeModal) closeShoeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && shoeModal.classList.contains('active')) closeShoeModal(); });

// Penyesuaian untuk mobile
function adjustForMobile() {
    if (window.innerWidth <= 768 && heroShoe) {
        document.documentElement.style.setProperty('--float-distance', '10px');
        document.documentElement.style.setProperty('--rotation-angle', '3deg');
    }
}

// Efek ripple pada tombol
function setupButtonInteractions() {
    whatsappBtn.addEventListener('mouseenter', function() { this.style.transform = 'scale(1.05)'; });
    whatsappBtn.addEventListener('mouseleave', function() { this.style.transform = 'scale(1)'; });
    
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
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Highlight menu saat scroll
function setupNavigationHighlight() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#navMenu a');
    
    function highlightNavLink() {
        const scrollPos = window.scrollY + 100;
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

// Handler resize
function handleResize() {
    adjustForMobile();
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
}

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', function() {
    setupWhatsAppInteraction();
    preloadImages();
    setupShoeAnimations();
    adjustForMobile();
    setupButtonInteractions();
    setupNavigationHighlight();
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 250);
    });
});