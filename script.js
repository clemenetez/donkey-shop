/* ============================================
   DONKEY PARADISE - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // NAVIGATION
    // ============================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll Effect for Navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id], header[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ============================================
    // ANIMATED COUNTER
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeProgress);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    };

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => counterObserver.observe(stat));

    // ============================================
    // CATALOG FILTER
    // ============================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // Filter products with animation
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Add fadeIn animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // SHOPPING CART
    // ============================================
    let cart = [];
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const cartClose = document.getElementById('cartClose');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const totalPrice = document.getElementById('totalPrice');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Load cart from localStorage
    const loadCart = () => {
        const savedCart = localStorage.getItem('donkeyCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartUI();
        }
    };

    // Save cart to localStorage
    const saveCart = () => {
        localStorage.setItem('donkeyCart', JSON.stringify(cart));
    };

    // Update cart UI
    const updateCartUI = () => {
        // Update cart count
        cartCount.textContent = cart.length;

        // Update cart items
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon">🛒</div>
                    <p>Ваш кошик порожній</p>
                </div>
            `;
            totalPrice.textContent = '₴0';
        } else {
            cartItems.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <span class="cart-item-emoji">🫏</span>
                        <div>
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">₴${item.price.toLocaleString()}</div>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-index="${index}">&times;</button>
                </div>
            `).join('');

            // Calculate total
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            totalPrice.textContent = `₴${total.toLocaleString()}`;

            // Add remove handlers
            document.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.getAttribute('data-index'));
                    cart.splice(index, 1);
                    saveCart();
                    updateCartUI();
                    showToast('Товар видалено з кошика');
                });
            });
        }
    };

    // Show toast notification
    const showToast = (message) => {
        toastMessage.textContent = message;
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    };

    // Add to cart
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseInt(btn.getAttribute('data-price'));

            // Check if already in cart
            const exists = cart.find(item => item.id === id);
            if (exists) {
                showToast('Цей віслюк вже у кошику!');
                return;
            }

            cart.push({ id, name, price });
            saveCart();
            updateCartUI();
            showToast(`${name} додано до кошика!`);

            // Button animation
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        });
    });

    // Open cart modal
    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close cart modal
    const closeCartModal = () => {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    cartClose.addEventListener('click', closeCartModal);
    cartModal.querySelector('.modal-overlay').addEventListener('click', closeCartModal);

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Спочатку додайте товари до кошика');
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        alert(`Дякуємо за замовлення!\n\nВаше замовлення:\n${cart.map(item => `- ${item.name}: ₴${item.price.toLocaleString()}`).join('\n')}\n\nЗагальна сума: ₴${total.toLocaleString()}\n\nНаш менеджер зв'яжеться з вами найближчим часом!`);
        
        cart = [];
        saveCart();
        updateCartUI();
        closeCartModal();
    });

    // Load cart on page load
    loadCart();

    // ============================================
    // REVIEWS SLIDER
    // ============================================
    const reviewsTrack = document.querySelector('.reviews-track');
    const reviewCards = document.querySelectorAll('.review-card');
    const prevBtn = document.getElementById('reviewPrev');
    const nextBtn = document.getElementById('reviewNext');
    
    let currentSlide = 0;
    let slidesToShow = 3;
    
    const updateSlidesToShow = () => {
        if (window.innerWidth <= 768) {
            slidesToShow = 1;
        } else if (window.innerWidth <= 1024) {
            slidesToShow = 2;
        } else {
            slidesToShow = 3;
        }
    };

    const updateSlider = () => {
        const cardWidth = reviewCards[0].offsetWidth + 32; // card width + gap
        reviewsTrack.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    };

    const maxSlide = () => Math.max(0, reviewCards.length - slidesToShow);

    prevBtn.addEventListener('click', () => {
        currentSlide = Math.max(0, currentSlide - 1);
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = Math.min(maxSlide(), currentSlide + 1);
        updateSlider();
    });

    window.addEventListener('resize', () => {
        updateSlidesToShow();
        currentSlide = Math.min(currentSlide, maxSlide());
        updateSlider();
    });

    updateSlidesToShow();

    // Auto-slide
    let autoSlide = setInterval(() => {
        if (currentSlide >= maxSlide()) {
            currentSlide = 0;
        } else {
            currentSlide++;
        }
        updateSlider();
    }, 5000);

    // Pause on hover
    const reviewsSlider = document.getElementById('reviewsSlider');
    reviewsSlider.addEventListener('mouseenter', () => clearInterval(autoSlide));
    reviewsSlider.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            if (currentSlide >= maxSlide()) {
                currentSlide = 0;
            } else {
                currentSlide++;
            }
            updateSlider();
        }, 5000);
    });

    // ============================================
    // CONTACT FORM
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const message = formData.get('message');

        // Validate
        if (!name || !phone) {
            showToast('Будь ласка, заповніть обов\'язкові поля');
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Надсилання...</span>';

        setTimeout(() => {
            alert(`Дякуємо за заявку, ${name}!\n\nМи зв'яжемося з вами за номером ${phone} найближчим часом.`);
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <span>Надіслати заявку</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
            `;
        }, 1500);
    });

    // ============================================
    // NEWSLETTER FORM
    // ============================================
    const newsletterForm = document.getElementById('newsletterForm');
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input').value;
        
        if (!email) {
            showToast('Введіть email адресу');
            return;
        }

        showToast('Дякуємо за підписку!');
        newsletterForm.reset();
    });

    // ============================================
    // QUICK VIEW (Optional enhancement)
    // ============================================
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    
    // Donkey details data
    const donkeyDetails = {
        1: {
            name: 'Барні',
            age: '2 роки',
            color: 'Сірий',
            height: '120 см',
            weight: '180 кг',
            character: 'Грайливий, дружелюбний',
            price: 15000,
            description: 'Барні — молодий та енергійний віслюк з прекрасним характером. Він обожнює гратися з дітьми та дуже контактний. Пройшов базове навчання та привчений до недоузда.'
        },
        2: {
            name: 'Марта',
            age: '6 років',
            color: 'Коричневий',
            height: '130 см',
            weight: '220 кг',
            character: 'Спокійна, врівноважена',
            price: 22000,
            description: 'Марта — досвідчена самка з чудовим темпераментом. Ідеальна для фермерського господарства або як компаньйон. Має досвід роботи з дітьми та початківцями.'
        },
        3: {
            name: 'Піксель',
            age: '3 роки',
            color: 'Плямистий',
            height: '90 см',
            weight: '120 кг',
            character: 'Ласкавий, допитливий',
            price: 20000,
            description: 'Піксель — чарівний мініатюрний віслюк з унікальним плямистим забарвленням. Його компактний розмір робить його ідеальним для невеликих ділянок.'
        },
        4: {
            name: 'Зевс',
            age: '1.5 роки',
            color: 'Коричневий',
            height: '115 см',
            weight: '160 кг',
            character: 'Енергійний, допитливий',
            price: 13500,
            description: 'Зевс — молодий та перспективний віслюк. Він ще навчається, але демонструє відмінні здібності та бажання співпрацювати.'
        },
        5: {
            name: 'Гектор',
            age: '8 років',
            color: 'Темно-коричневий',
            height: '140 см',
            weight: '280 кг',
            character: 'Надійний, працьовитий',
            price: 28000,
            description: 'Гектор — справжній робочий віслюк з багаторічним досвідом. Привчений до ваги та перевезення вантажів. Надійний помічник у господарстві.'
        },
        6: {
            name: 'Клевер',
            age: '2 роки',
            color: 'Сіро-білий',
            height: '85 см',
            weight: '100 кг',
            character: 'Чарівний, фотогенічний',
            price: 23000,
            description: 'Клевер — мініатюрний красень з унікальним забарвленням. Ідеальний для фотосесій, заходів та як домашній улюбленець.'
        }
    };

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const donkey = donkeyDetails[id];
            
            if (donkey) {
                alert(`🫏 ${donkey.name}\n\n` +
                    `Вік: ${donkey.age}\n` +
                    `Забарвлення: ${donkey.color}\n` +
                    `Зріст: ${donkey.height}\n` +
                    `Вага: ${donkey.weight}\n` +
                    `Характер: ${donkey.character}\n\n` +
                    `${donkey.description}\n\n` +
                    `Ціна: ₴${donkey.price.toLocaleString()}`);
            }
        });
    });

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // ============================================
    // PHONE INPUT MASK
    // ============================================
    const phoneInput = document.getElementById('phone');
    
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value.startsWith('38')) {
                value = value.substring(2);
            }
            
            let formatted = '+38';
            
            if (value.length > 0) {
                formatted += ' (' + value.substring(0, 3);
            }
            if (value.length >= 3) {
                formatted += ') ' + value.substring(3, 6);
            }
            if (value.length >= 6) {
                formatted += '-' + value.substring(6, 8);
            }
            if (value.length >= 8) {
                formatted += '-' + value.substring(8, 10);
            }
            
            e.target.value = formatted;
        }
    });

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    const animatedElements = document.querySelectorAll('.product-card, .service-card, .feature, .contact-item');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease forwards';
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        scrollObserver.observe(el);
    });

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    document.addEventListener('keydown', (e) => {
        // Close modal on Escape
        if (e.key === 'Escape' && cartModal.classList.contains('active')) {
            closeCartModal();
        }
    });

    console.log('🫏 Donkey Paradise loaded successfully!');
});
