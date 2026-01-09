// Efecto de partículas para el encabezado
document.addEventListener('DOMContentLoaded', function() {
    const heroHeader = document.querySelector('.hero-header');
    
    // Añadir efecto de clic en las tarjetas
    const cards = document.querySelectorAll('.nav-card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn')) {
                const link = this.querySelector('a');
                if (link) {
                    // Efecto visual al hacer clic
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                        window.location.href = link.href;
                    }, 200);
                }
            }
        });
    });
    
    // Efecto de escritura para el título (opcional)
    const title = document.querySelector('.hero-header h1');
    const originalText = title.textContent;
    title.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < originalText.length) {
            title.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    // Iniciar la animación de escritura después de un breve retraso
    setTimeout(typeWriter, 500);
    
    // Efecto de brillo aleatorio en elementos
    setInterval(() => {
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        randomCard.style.boxShadow = '0 0 20px rgba(45, 212, 191, 0.7)';
        setTimeout(() => {
            randomCard.style.boxShadow = '';
        }, 1000);
    }, 3000);
});
