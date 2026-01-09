// PS.js - Gestor de Contraseñas Seguro (Versión Cifrada)

// Variables globales
let masterKey = '';
let encryptedData = {};
let decryptedData = {};

// Elementos del DOM
const authScreen = document.getElementById('authScreen');
const passwordGrid = document.getElementById('passwordGrid');
const masterPasswordInput = document.getElementById('masterPassword');
const authButton = document.getElementById('authButton');
const errorMessage = document.getElementById('errorMessage');
const modal = document.getElementById('passwordModal');
const closeModal = document.getElementById('closeModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalService = document.getElementById('modalService');
const modalUsername = document.getElementById('modalUsername');
const modalPassword = document.getElementById('modalPassword');
const modalAdditional = document.getElementById('modalAdditional');

// Datos de servicios con sus clases CSS e iconos
const servicesConfig = {
    // Servicios originales
    'Discord': { class: 'DI', icon: 'fab fa-discord' },
    'Claro Video': { class: 'CL', icon: 'fas fa-video' },
    'Gmail': { class: 'GM', icon: 'fab fa-google' },
    'Signal': { class: 'SI', icon: 'fas fa-comment-alt' },
    'Mercado Libre': { class: 'ML', icon: 'fas fa-shopping-cart' },
    'PayPal': { class: 'PY', icon: 'fab fa-paypal' },
    'Facebook': { class: 'FB', icon: 'fab fa-facebook' },
    'Huawei': { class: 'HU', icon: 'fas fa-mobile-alt' },
    'Tibia': { class: 'TI', icon: 'fas fa-gamepad' },
    'Xiaomi': { class: 'MI', icon: 'fas fa-bolt' },
    'Steam': { class: 'ST', icon: 'fab fa-steam' },
    'Amazon': { class: 'AM', icon: 'fab fa-amazon' },
    'Remote Desktop': { class: 'RD', icon: 'fas fa-desktop' },
    'Battle.net': { class: 'BT', icon: 'fas fa-crosshairs' },
    
    // Nuevos servicios solicitados
    'Subes Benito Juárez': { class: 'SB', icon: 'fas fa-bus' },
    'Bendy in Nightmare': { class: 'BN', icon: 'fas fa-ghost' },
    'Bodega Aurrera': { class: 'BA', icon: 'fas fa-store' },
    'Twitter': { class: 'TW', icon: 'fab fa-twitter' },
    'Mega': { class: 'MG', icon: 'fas fa-cloud' },
    'Twitch': { class: 'TV', icon: 'fab fa-twitch' },
    'Disney Plus': { class: 'DP', icon: 'fas fa-film' },
    'Max (HBO)': { class: 'MX', icon: 'fas fa-tv' },
    'ChatGPT': { class: 'CG', icon: 'fas fa-robot' },
    'UAEH': { class: 'UH', icon: 'fas fa-university' },
    'Cinemex': { class: 'CX', icon: 'fas fa-film' },
    'Roblox': { class: 'RB', icon: 'fas fa-cube' },
    'Discord (2da cuenta)': { class: 'DI', icon: 'fab fa-discord' },
    'Ok Internacional': { class: 'OK', icon: 'fas fa-globe' },
    'Injustice 1': { class: 'IJ', icon: 'fas fa-fist-raised' },
    'Hotmail': { class: 'HM', icon: 'fas fa-envelope' },
    'Mi Telcel': { class: 'TC', icon: 'fas fa-phone-alt' },
    'Walmart': { class: 'WM', icon: 'fas fa-shopping-bag' },
    'Saiyan\'s Return': { class: 'SR', icon: 'fas fa-dragon' },
    'Call of Duty': { class: 'CD', icon: 'fas fa-gun' },
    'IPN': { class: 'IP', icon: 'fas fa-graduation-cap' },
    'Pidae': { class: 'PD', icon: 'fas fa-chart-line' },
    'Sicert': { class: 'SC', icon: 'fas fa-certificate' },
    'Udemy': { class: 'UD', icon: 'fab fa-udemy' },
    'Salud Digna': { class: 'SD', icon: 'fas fa-heartbeat' },
    'ORCID': { class: 'OC', icon: 'fas fa-id-badge' },
    'GitHub': { class: 'GH', icon: 'fab fa-github' },
    'Padhi': { class: 'PH', icon: 'fas fa-user-circle' },
    'SAT': { class: 'SAT', icon: 'fas fa-file-invoice-dollar' }
};

// Función para cargar datos cifrados desde el archivo JSON
async function loadEncryptedData() {
    try {
        const response = await fetch('data/passwords.enc.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo de contraseñas');
        }
        encryptedData = await response.json();
        console.log('Datos cifrados cargados correctamente');
        return true;
    } catch (error) {
        console.error('Error cargando datos cifrados:', error);
        errorMessage.textContent = 'Error cargando los datos cifrados. Verifica que el archivo exista.';
        errorMessage.style.display = 'block';
        return false;
    }
}

// Función para descifrar todas las contraseñas
function decryptAllPasswords() {
    decryptedData = {};
    
    for (const [service, encrypted] of Object.entries(encryptedData)) {
        try {
            // Descifrar el texto cifrado
            const decryptedBytes = CryptoJS.AES.decrypt(encrypted, masterKey);
            const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
            
            if (decryptedText) {
                // Parsear el JSON descifrado
                decryptedData[service] = JSON.parse(decryptedText);
            }
        } catch (error) {
            console.warn(`Error descifrando ${service}:`, error);
        }
    }
    
    return Object.keys(decryptedData).length > 0;
}

// Función para mostrar los botones de servicios
function renderPasswordButtons() {
    passwordGrid.innerHTML = '';
    
    Object.keys(servicesConfig).forEach(service => {
        const config = servicesConfig[service];
        const button = document.createElement('button');
        
        button.className = `password-btn ${config.class}`;
        button.setAttribute('data-service', service);
        button.innerHTML = `
            <i class="${config.icon}"></i>
            <span>${service}</span>
        `;
        
        // Verificar si existen credenciales para este servicio
        if (!decryptedData[service]) {
            button.style.opacity = '0.5';
            button.title = 'No hay credenciales guardadas para este servicio';
        }
        
        button.addEventListener('click', () => showCredentials(service));
        
        passwordGrid.appendChild(button);
    });
}

// Función para mostrar credenciales en el modal
function showCredentials(service) {
    const credentials = decryptedData[service];
    
    if (!credentials) {
        alert(`No hay credenciales guardadas para ${service}`);
        return;
    }
    
    // Actualizar contenido del modal
    modalService.textContent = service;
    modalUsername.textContent = credentials.username || 'No disponible';
    modalPassword.textContent = credentials.password || 'No disponible';
    modalAdditional.textContent = credentials.additional || 'Sin información adicional';
    
    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Función para copiar al portapapeles
function setupCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            let textToCopy = '';
            
            if (target === 'username') {
                textToCopy = modalUsername.textContent;
            } else if (target === 'password') {
                textToCopy = modalPassword.textContent;
            }
            
            // Usar la API del portapapeles
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    // Efecto visual de copiado
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                    this.style.background = 'var(--accent-green)';
                    this.style.color = 'var(--dark-bg)';
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.background = '';
                        this.style.color = '';
                    }, 1500);
                })
                .catch(err => {
                    console.error('Error al copiar: ', err);
                    alert('No se pudo copiar al portapapeles');
                });
        });
    });
}

// Función para cerrar el modal
function setupModalClose() {
    const closeFunctions = [
        () => closeModal.addEventListener('click', closeModalFunc),
        () => closeModalBtn.addEventListener('click', closeModalFunc),
        () => modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModalFunc();
        }),
        () => document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModalFunc();
            }
        })
    ];
    
    function closeModalFunc() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    closeFunctions.forEach(fn => fn());
}

// Función de autenticación
async function authenticate() {
    masterKey = masterPasswordInput.value.trim();
    
    if (!masterKey) {
        errorMessage.textContent = 'Por favor, introduce tu clave maestra';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Cargar datos cifrados
    const loaded = await loadEncryptedData();
    if (!loaded) return;
    
    // Intentar descifrar
    const success = decryptAllPasswords();
    
    if (success && Object.keys(decryptedData).length > 0) {
        // Autenticación exitosa
        errorMessage.style.display = 'none';
        authScreen.style.display = 'none';
        passwordGrid.style.display = 'grid';
        
        // Renderizar botones
        renderPasswordButtons();
        
        // Configurar modal
        setupModalClose();
        setupCopyButtons();
        
        // Efecto de aparición escalonada
        const buttons = document.querySelectorAll('.password-btn');
        buttons.forEach((button, index) => {
            button.style.animationDelay = `${index * 0.05}s`;
        });
        
        // Limpiar campo de contraseña (por seguridad)
        masterPasswordInput.value = '';
        
        // Efecto de brillo aleatorio en botones
        setInterval(() => {
            const activeButtons = document.querySelectorAll('.password-btn:not([style*="opacity: 0.5"])');
            if (activeButtons.length > 0) {
                const randomButton = activeButtons[Math.floor(Math.random() * activeButtons.length)];
                randomButton.style.boxShadow = '0 0 20px rgba(45, 212, 191, 0.7)';
                setTimeout(() => {
                    randomButton.style.boxShadow = '';
                }, 1000);
            }
        }, 3000);
        
    } else {
        // Autenticación fallida
        errorMessage.textContent = 'Clave maestra incorrecta o datos corruptos';
        errorMessage.style.display = 'block';
        masterPasswordInput.value = '';
        masterPasswordInput.focus();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Configurar botón de autenticación
    authButton.addEventListener('click', authenticate);
    
    // Permitir autenticación con Enter
    masterPasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            authenticate();
        }
    });
    
    // Enfocar el campo de contraseña al cargar
    masterPasswordInput.focus();
});

// Exportar funciones para uso externo (si es necesario)
window.PasswordManager = {
    authenticate,
    showCredentials,
    getDecryptedData: () => decryptedData
};