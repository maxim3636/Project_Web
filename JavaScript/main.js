document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Seleccionem tots els elements que volem animar
    // (Busquem elements amb la classe 'reveal')
    const revealElements = document.querySelectorAll('.reveal');

    // 2. Configurem l'observador (l'ull que vigila l'scroll)
    const observerOptions = {
        root: null,      // Vigila respecte a la finestra del navegador
        threshold: 0.15, // Dispara l'animació quan el 15% de l'element és visible
        rootMargin: "0px 0px -50px 0px" // Un petit marge perquè no animi just a la vora inferior
    };

    // 3. Creem la funció que s'executa quan es detecten els elements
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si l'element entra en pantalla...
            if (entry.isIntersecting) {
                // Afegim la classe 'active' que conté l'animació CSS
                entry.target.classList.add('active');
                
                // (Opcional) Deixem d'observar-lo perquè no es repeteixi l'animació
                // si l'usuari fa scroll amunt i avall.
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 4. Activem l'observador per a cada element
    revealElements.forEach(el => {
        observer.observe(el);
    });


    // --- MENÚ MÒBIL ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links'); 

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            // 1. Intercanviar classe per mostrar/amagar menú
            navLinks.classList.toggle('mobile-active');
            
            // 2. Intercanviar classe per animar el botó (fer la X)
            menuBtn.classList.toggle('open');
        });
        
        // (Opcional) Tancar el menú quan es clica un enllaç
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-active');
                menuBtn.classList.remove('open');
            });
        });
    }

    

  // --- MODE FOSC (DARK MODE) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    // CANVI IMPORTANT: Ara treballem amb l'element arrel (HTML), no BODY
    const rootElement = document.documentElement; 

    // 1. Verificar estat inicial per posar la icona correcta
    // (La classe ja l'ha posat l'script del head, només mirem la icona)
    if (rootElement.classList.contains('dark-mode')) {
        if(themeToggleBtn) themeToggleBtn.textContent = '☀️';
    }

    // 2. Event al fer clic
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            // Canviem la classe a l'etiqueta HTML
            rootElement.classList.toggle('dark-mode');
            
            if (rootElement.classList.contains('dark-mode')) {
                themeToggleBtn.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            } else {
                themeToggleBtn.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            }
        });
    }



   // --- LIGHTBOX AMB NAVEGACIÓ ---
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    // Totes les fotos de la pàgina
    const galleryItems = document.querySelectorAll('.photo-item');
    
    let currentIndex = 0; // Guardarem quina foto estem mirant

    // Funció per mostrar una foto específica segons l'índex
    function showLightboxImage(index) {
        const item = galleryItems[index];
        
        // Dades de l'element actual
        const img = item.querySelector('img');
        const placeholder = item.querySelector('.photo-placeholder');
        const captionText = item.querySelector('.caption') ? item.querySelector('.caption').textContent : '';

        // Netejem placeholders anteriors si n'hi ha
        const existingPlaceholder = document.querySelector('.placeholder-display');
        if (existingPlaceholder) existingPlaceholder.remove();

        // Lògica de visualització
        if (img) {
            lightboxImg.style.display = 'block';
            lightboxImg.src = img.src;
        } else if (placeholder) {
            lightboxImg.style.display = 'none';
            // Creem el placeholder de text dinàmicament
            let displayDiv = document.createElement('div');
            displayDiv.className = 'placeholder-display';
            displayDiv.textContent = placeholder.textContent;
            lightboxImg.parentNode.insertBefore(displayDiv, lightboxImg);
        }

        // Actualitzem text
        lightboxCaption.textContent = captionText;
    }

    // Inicialització al fer clic
    if (lightbox && galleryItems.length > 0) {
        
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index; // Guardem l'índex clicat
                showLightboxImage(currentIndex);
                lightbox.classList.add('active');
            });
        });

        // Tancar
        const closeLightbox = () => {
            lightbox.classList.remove('active');
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // --- NAVEGACIÓ FLETXES ---
        
        // Següent
        const showNext = (e) => {
            if(e) e.stopPropagation(); // Evita tancar al clicar fletxa
            currentIndex++;
            if (currentIndex >= galleryItems.length) {
                currentIndex = 0; // Tornem al principi
            }
            showLightboxImage(currentIndex);
        };

        // Anterior
        const showPrev = (e) => {
            if(e) e.stopPropagation();
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = galleryItems.length - 1; // Anem al final
            }
            showLightboxImage(currentIndex);
        };

        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);

        // --- NAVEGACIÓ TECLAT (Bonus) ---
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'Escape') closeLightbox();
        });
    }


    // --- BOTÓ BACK TO TOP ---
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        
        // 1. Mostrar/Amagar botó al fer Scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                // Si hem baixat més de 300px, mostrem el botó
                backToTopBtn.classList.add('visible');
            } else {
                // Si estem a dalt, l'amaguem
                backToTopBtn.classList.remove('visible');
            }
        });

        // 2. Acció al fer clic (Pujar a dalt)
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Desplaçament suau natiu
            });
        });
    }
});

// --- FIX: REACTIVAR TRANSICIONS UN COP CARREGAT ---
window.addEventListener('load', () => {
    // Esperem un petit moment per assegurar que el pintat inicial està fet
    setTimeout(() => {
        document.body.classList.remove('preload');
    }, 100);
});