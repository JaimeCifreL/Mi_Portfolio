// Animación de aparición por sección al hacer scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const triggerBottom = window.innerHeight * 0.92;
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < triggerBottom) {
            el.classList.add('animated');
        } else {
            el.classList.remove('animated');
        }
    });
}
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('resize', animateOnScroll);
window.addEventListener('DOMContentLoaded', animateOnScroll);

// Filtro de proyectos por tecnología (muy simple)
document.addEventListener('DOMContentLoaded', function() {
    const filter = document.getElementById('tech-filter');
    if (filter) {
        filter.addEventListener('change', function() {
            const value = filter.value;
            document.querySelectorAll('.project-card').forEach(card => {
                // Busca los tags de cada proyecto
                const tags = Array.from(card.querySelectorAll('.project-tags span')).map(e => e.textContent);
                if (value === 'all' || tags.includes(value)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('main-nav');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !expanded);
            navMenu.classList.toggle('open');
        });
    }
});
