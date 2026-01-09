// PS.js - SISTEMA DE SEGURIDAD MEJORADO
// Este archivo se carga después de Passwords.html

(function() {
    'use strict';
    
    // 🔐 CONSTANTES DE SEGURIDAD
    const SECURITY_HASH = "ENCRYPTED_SYSTEM_V1_" + btoa("DYNAMIC_PASSWORDS_2024");
    const REQUIRED_ELEMENTS = ['authScreen', 'passwordGrid', 'masterPassword', 'authButton'];
    
    // 🛡️ VERIFICACIÓN DE INTEGRIDAD DEL SISTEMA
    function verifySystemIntegrity() {
        try {
            // 1. Verificar elementos DOM críticos
            for (const id of REQUIRED_ELEMENTS) {
                if (!document.getElementById(id)) {
                    console.error(`[SEGURIDAD] Elemento ${id} no encontrado`);
                    return false;
                }
            }
            
            // 2. Verificar que CryptoJS esté cargado
            if (typeof CryptoJS === 'undefined' || !CryptoJS.AES) {
                console.error('[SEGURIDAD] CryptoJS no está disponible');
                return false;
            }
            
            // 3. Verificar que las funciones críticas existan
            const requiredFunctions = ['authenticate', 'decryptAllPasswords', 'loadEncryptedData'];
            for (const funcName of requiredFunctions) {
                if (typeof window[funcName] === 'undefined') {
                    console.error(`[SEGURIDAD] Función ${funcName} no encontrada`);
                    return false;
                }
            }
            
            // 4. Verificar que no se haya manipulado el objeto PasswordManager
            if (!window.PasswordManager || typeof window.PasswordManager !== 'object') {
                console.error('[SEGURIDAD] PasswordManager no disponible');
                return false;
            }
            
            return true;
            
        } catch (error) {
            console.error('[SEGURIDAD] Error en verificación:', error);
            return false;
        }
    }
    
    // 🚨 MOSTRAR ALERTA DE SEGURIDAD
    function showSecurityAlert(reason) {
        const alertHTML = `
            <div style="
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: #0f172a;
                z-index: 99999;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                padding: 20px;
                color: white;
            ">
                <h1 style="color: #ff6b6b; font-size: 2.5rem; margin-bottom: 20px;">
                    <i class="fas fa-shield-alt"></i> ALERTA DE SEGURIDAD
                </h1>
                <p style="font-size: 1.2rem; margin-bottom: 10px;">
                    Se ha detectado una violación de seguridad.
                </p>
                <p style="margin-bottom: 20px; color: #ccc;">
                    Razón: ${reason}
                </p>
                <p style="margin-bottom: 30px;">
                    Por seguridad, el sistema ha sido bloqueado.
                </p>
                <button onclick="location.reload()" style="
                    background: #2dd4bf;
                    color: #0f172a;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 10px;
                    font-size: 1.1rem;
                    cursor: pointer;
                    font-weight: bold;
                ">
                    <i class="fas fa-redo"></i> Recargar Página
                </button>
            </div>
        `;
        
        document.body.innerHTML = alertHTML;
        return false;
    }
    
    // 🔍 DETECTAR MANIPULACIÓN EN TIEMPO REAL
    function setupRealTimeMonitoring() {
        // Monitorear cambios en elementos críticos
        const criticalSelectors = [
            '#authScreen', '#passwordGrid', '#masterPassword',
            '#authButton', '#securityAlert', '.modal-overlay'
        ];
        
        let originalHTML = {};
        criticalSelectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                originalHTML[selector] = element.outerHTML;
            }
        });
        
        // Verificar periódicamente
        setInterval(() => {
            criticalSelectors.forEach(selector => {
                const element = document.querySelector(selector);
                if (element && originalHTML[selector]) {
                    if (element.outerHTML !== originalHTML[selector]) {
                        showSecurityAlert(`Manipulación detectada en ${selector}`);
                    }
                } else if (!element && originalHTML[selector]) {
                    showSecurityAlert(`Elemento eliminado: ${selector}`);
                }
            });
        }, 2000);
    }
    
    // 🛑 PROTECCIÓN CONTRA DEBUGGERS
    function antiDebugProtection() {
        // Detectar debugger con performance
        let lastTime = Date.now();
        setInterval(() => {
            const currentTime = Date.now();
            if (currentTime > (lastTime + 100)) {
                // Demasiado tiempo, posible debugger
                showSecurityAlert('Herramientas de desarrollo detectadas');
            }
            lastTime = currentTime;
        }, 100);
        
        // Sobrescribir console methods
        const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn
        };
        
        console.log = function(...args) {
            if (args.join(' ').toLowerCase().includes('password') || 
                args.join(' ').toLowerCase().includes('masterkey')) {
                showSecurityAlert('Intento de logging de credenciales');
                return;
            }
            originalConsole.log.apply(console, args);
        };
    }
    
    // 🔄 INTERCEPTAR LLAMADAS A FUNCIONES CRÍTICAS
    function protectCriticalFunctions() {
        // Interceptar authenticate si existe
        if (window.authenticate && typeof window.authenticate === 'function') {
            const originalAuthenticate = window.authenticate;
            window.authenticate = function() {
                // Verificar seguridad antes de ejecutar
                if (!verifySystemIntegrity()) {
                    showSecurityAlert('Integridad del sistema comprometida');
                    return Promise.reject('Security violation');
                }
                
                // Limitar tasa de intentos
                if (!window.authAttempts) window.authAttempts = 0;
                window.authAttempts++;
                
                if (window.authAttempts > 5) {
                    showSecurityAlert('Demasiados intentos de autenticación');
                    return Promise.reject('Too many attempts');
                }
                
                return originalAuthenticate.apply(this, arguments);
            };
        }
        
        // Interceptar decryptAllPasswords si existe
        if (window.decryptAllPasswords && typeof window.decryptAllPasswords === 'function') {
            const originalDecrypt = window.decryptAllPasswords;
            window.decryptAllPasswords = function() {
                // Verificar que haya una clave maestra
                if (!window.masterKey || window.masterKey.length < 1) {
                    console.error('[SEGURIDAD] Intento de descifrado sin clave');
                    return false;
                }
                
                // Verificar que haya datos para descifrar
                if (!window.encryptedData || Object.keys(window.encryptedData).length === 0) {
                    console.error('[SEGURIDAD] No hay datos cifrados');
                    return false;
                }
                
                const result = originalDecrypt.apply(this, arguments);
                
                // Verificar que el descifrado produjo resultados
                if (!result || !window.decryptedData) {
                    console.error('[SEGURIDAD] Descifrado fallido');
                    return false;
                }
                
                return result;
            };
        }
    }
    
    // 🚀 INICIALIZAR SISTEMA DE SEGURIDAD
    function initializeSecuritySystem() {
        console.log('[SEGURIDAD] Inicializando sistema de protección...');
        
        // 1. Verificar integridad inicial
        if (!verifySystemIntegrity()) {
            return showSecurityAlert('Verificación de integridad fallida');
        }
        
        // 2. Configurar monitoreo en tiempo real
        setupRealTimeMonitoring();
        
        // 3. Proteger contra debugging (solo en producción)
        if (window.location.hostname.includes('github.io')) {
            antiDebugProtection();
        }
        
        // 4. Interceptar funciones críticas
        protectCriticalFunctions();
        
        // 5. Configurar watchdog
        setInterval(() => {
            if (!verifySystemIntegrity()) {
                showSecurityAlert('Verificación periódica fallida');
            }
        }, 10000);
        
        console.log('[SEGURIDAD] Sistema de protección activado');
        return true;
    }
    
    // 📦 EXPORTAR FUNCIONES DE SEGURIDAD
    window.SecuritySystem = {
        initialize: initializeSecuritySystem,
        verify: verifySystemIntegrity,
        showAlert: showSecurityAlert
    };
    
    // ⏱️ INICIALIZAR CUANDO EL DOM ESTÉ LISTO
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSecuritySystem);
    } else {
        initializeSecuritySystem();
    }
    
})();