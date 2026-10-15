/**
 * OFICIOS QUE VALEN - Aplicación Web Principal
 * Manejo de navegación SPA, renderizado dinámico, filtros, galería lightbox,
 * modal de trazabilidad WhatsApp, onboarding de especialistas y portal B2B.
 */

// Obtención de datos del modelo global
const {
  CATEGORIES_DATA = [],
  SPECIALISTS_DATA = [],
  B2B_SERVICES_DATA = [],
  HOW_IT_WORKS_STEPS = [],
  TRUST_PILLARS = []
} = (typeof window !== 'undefined' && window.OQV_DATA) ? window.OQV_DATA : {};

// Estado global de la aplicación
const state = {
  currentView: 'inicio', // inicio, categorias, especialistas, perfil, b2b, quiero-ofrecer, como-funciona, contacto, admin
  currentCategory: null,
  currentSpecialist: null,
  currentDossier: null,
  searchQuery: '',
  filters: {
    category: 'all',
    modality: 'all',
    location: 'all',
    sortBy: 'experience'
  },
  onboardingStep: 1,
  onboardingData: {
    nombre: '',
    telefono: '',
    ciudad: '',
    oficio: '',
    aniosExperiencia: '',
    descripcion: '',
    modalidad: 'presencial',
    fotos: []
  },
  lightbox: {
    isOpen: false,
    images: [],
    currentIndex: 0
  },
  // Almacenamiento local de leads para demostrar trazabilidad
  leads: JSON.parse(localStorage.getItem('oqv_leads') || '[]'),
  b2bRequests: JSON.parse(localStorage.getItem('oqv_b2b_requests') || '[]'),
  specialistApplications: JSON.parse(localStorage.getItem('oqv_applications') || '[]')
};

// Guardado de estado en LocalStorage
function persistData() {
  localStorage.setItem('oqv_leads', JSON.stringify(state.leads));
  localStorage.setItem('oqv_b2b_requests', JSON.stringify(state.b2bRequests));
  localStorage.setItem('oqv_applications', JSON.stringify(state.specialistApplications));
}

// Inicialización de la app
document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initGlobalEventListeners();
  renderHeader();
  renderFooter();
  handleRoute();
});

// Enrutador basado en Hash (#inicio, #categorias, #especialistas, #perfil/slug, #b2b, etc.)
function initRouter() {
  window.addEventListener('hashchange', handleRoute);
}

function navigateTo(hash) {
  window.location.hash = hash;
}

function handleRoute() {
  const hash = window.location.hash.replace('#', '') || 'inicio';
  const parts = hash.split('/');
  const route = parts[0];
  const param = parts[1];

  state.currentView = route;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Cerrar menú móvil al navegar
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
  }

  // Actualizar logo del header según la sección (B2B vs B2C)
  updateHeaderLogo(route === 'empresas-b2b' || route === 'dossier');

  // Renderizar la vista correspondiente
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  switch (route) {
    case 'inicio':
      renderInicio(mainContent);
      break;
    case 'categorias':
      renderCategorias(mainContent);
      break;
    case 'especialistas':
      if (param) {
        state.filters.category = param;
      }
      renderEspecialistasList(mainContent);
      break;
    case 'perfil':
      renderPerfilIndividual(mainContent, param);
      break;
    case 'empresas-b2b':
      renderEmpresasB2B(mainContent);
      break;
    case 'dossier':
      renderDossierB2B(mainContent, param);
      break;
    case 'quiero-ofrecer':
      renderQuieroOfrecer(mainContent);
      break;
    case 'como-funciona':
      renderComoFunciona(mainContent);
      break;
    case 'contacto':
      renderContacto(mainContent);
      break;
    case 'admin':
      renderAdminPanel(mainContent);
      break;
    default:
      renderInicio(mainContent);
      break;
  }

  // Refrescar iconos de Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Actualizar logo según vista
function updateHeaderLogo(isB2B) {
  const brandLogo = document.getElementById('brand-header-logo');
  const b2bBadge = document.getElementById('nav-b2b-badge');
  if (brandLogo) {
    brandLogo.src = isB2B ? 'assets/images/logo-b2b.png' : 'assets/images/logo.png';
  }
  if (b2bBadge) {
    b2bBadge.classList.toggle('ring-2', isB2B);
    b2bBadge.classList.toggle('ring-[#129BFF]', isB2B);
  }
}

// Componente Header Global
function renderHeader() {
  const headerContainer = document.getElementById('app-header');
  if (!headerContainer) return;

  headerContainer.innerHTML = `
    <!-- Barra superior de confianza y contacto asistido -->
    <div class="bg-[#052B63] text-white text-sm py-2 px-4 border-b border-[#0A63CE]/30">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div class="flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-[#129BFF] animate-pulse"></span>
          <span class="font-medium text-xs sm:text-sm">Plataforma de experiencia y talento especializado de 50 a 75 años</span>
        </div>
        <div class="flex items-center gap-4 text-xs sm:text-sm">
          <a href="#como-funciona" class="hover:text-[#129BFF] transition flex items-center gap-1">
            <i data-lucide="shield-check" class="w-4 h-4 text-[#129BFF]"></i>
            Perfiles 100% Validados
          </a>
          <span class="text-white/40">|</span>
          <a href="https://wa.me/573009998888?text=Hola,%20necesito%20asistencia%20en%20Oficios%20que%20Valen" target="_blank" class="hover:text-[#129BFF] transition flex items-center gap-1 font-semibold">
            <i data-lucide="help-circle" class="w-4 h-4 text-[#129BFF]"></i>
            Línea de Ayuda Asistida
          </a>
        </div>
      </div>
    </div>

    <!-- Navegación principal -->
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20 items-center">
          <!-- Logo Oficial sobre fondo blanco sin rediseñar -->
          <a href="#inicio" class="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#129BFF] rounded-lg p-1">
            <img id="brand-header-logo" src="assets/images/logo.png" alt="OFICIOS QUE VALEN - Logo Oficial" class="h-14 w-auto object-contain transition duration-200">
          </a>

          <!-- Links de escritorio según especificación de arquitectura -->
          <div class="hidden lg:flex items-center gap-7">
            <a href="#inicio" class="nav-link font-semibold text-[#172033] hover:text-[#0A63CE] transition py-1 border-b-2 border-transparent">INICIO</a>
            <a href="#categorias" class="nav-link font-semibold text-[#172033] hover:text-[#0A63CE] transition py-1 border-b-2 border-transparent">CATEGORÍAS</a>
            <a href="#como-funciona" class="nav-link font-semibold text-[#172033] hover:text-[#0A63CE] transition py-1 border-b-2 border-transparent">CÓMO FUNCIONA</a>
            
            <a href="#empresas-b2b" id="nav-b2b-badge" class="font-semibold text-[#052B63] hover:text-[#0A63CE] transition py-1 px-3 rounded-lg bg-[#EAF4FF] border border-[#B2D7FF] flex items-center gap-1.5">
              <span>EMPRESAS</span>
              <span class="badge-b2b text-xs">B2B</span>
            </a>
            
            <a href="#quiero-ofrecer" class="font-semibold text-[#0A63CE] hover:text-[#052B63] transition py-1">QUIERO OFRECER MI EXPERIENCIA</a>
            <a href="#contacto" class="nav-link font-semibold text-[#172033] hover:text-[#0A63CE] transition py-1">CONTACTO</a>
          </div>

          <!-- CTAs de cabecera -->
          <div class="hidden sm:flex items-center gap-3">
            <a href="#especialistas" class="btn-primary text-sm py-2 px-4 shadow-sm" style="min-height: 44px;">
              <i data-lucide="search" class="w-4 h-4"></i>
              <span>Explorar</span>
            </a>
            <a href="#admin" title="Ver leads y solicitudes registradas" class="p-2 text-gray-500 hover:text-[#052B63] rounded-lg hover:bg-gray-100 transition relative">
              <i data-lucide="clipboard-list" class="w-5 h-5"></i>
              <span id="header-leads-counter" class="absolute -top-1 -right-1 bg-[#129BFF] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                ${state.leads.length + state.b2bRequests.length + state.specialistApplications.length}
              </span>
            </a>
          </div>

          <!-- Botón Menú Móvil -->
          <div class="flex items-center lg:hidden gap-2">
            <a href="#especialistas" class="p-2 text-[#052B63] hover:bg-gray-100 rounded-lg">
              <i data-lucide="search" class="w-6 h-6"></i>
            </a>
            <button id="mobile-menu-btn" class="p-2.5 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0A63CE]" aria-label="Abrir menú">
              <i data-lucide="menu" class="w-7 h-7"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Menú Móvil desplegable -->
      <div id="mobile-menu" class="hidden lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
        <a href="#inicio" class="block px-3 py-2.5 rounded-lg text-lg font-semibold text-[#172033] hover:bg-[#EAF4FF]">INICIO</a>
        <a href="#categorias" class="block px-3 py-2.5 rounded-lg text-lg font-semibold text-[#172033] hover:bg-[#EAF4FF]">CATEGORÍAS</a>
        <a href="#como-funciona" class="block px-3 py-2.5 rounded-lg text-lg font-semibold text-[#172033] hover:bg-[#EAF4FF]">CÓMO FUNCIONA</a>
        <a href="#empresas-b2b" class="flex items-center justify-between px-3 py-2.5 rounded-lg text-lg font-semibold text-[#052B63] bg-[#EAF4FF]">
          <span>EMPRESAS / TALENTO B2B</span>
          <span class="badge-b2b text-xs">B2B</span>
        </a>
        <a href="#quiero-ofrecer" class="block px-3 py-2.5 rounded-lg text-lg font-semibold text-[#0A63CE] hover:bg-[#EAF4FF]">QUIERO OFRECER MI EXPERIENCIA</a>
        <a href="#contacto" class="block px-3 py-2.5 rounded-lg text-lg font-semibold text-[#172033] hover:bg-[#EAF4FF]">CONTACTO</a>
        <div class="pt-4 border-t border-gray-100 flex flex-col gap-3">
          <a href="#especialistas" class="btn-primary w-full text-center">Explorar Especialistas</a>
          <a href="https://wa.me/573009998888?text=Hola,%20necesito%20ayuda%20para%20usar%20Oficios%20que%20Valen" target="_blank" class="btn-secondary w-full text-center">
            <i data-lucide="help-circle" class="w-5 h-5"></i>
            Línea de Ayuda Asistida
          </a>
        </div>
      </div>
    </nav>
  `;

  // Toggle menú móvil
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// Componente Footer Global
function renderFooter() {
  const footerContainer = document.getElementById('app-footer');
  if (!footerContainer) return;

  footerContainer.innerHTML = `
    <footer class="bg-[#052B63] text-white pt-16 pb-12 border-t border-[#0A63CE]/40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          <!-- Columna Marca -->
          <div class="lg:col-span-2 space-y-4">
            <div class="bg-white p-3 rounded-xl inline-block">
              <img src="assets/images/logo.png" alt="Oficios que Valen" class="h-12 w-auto">
            </div>
            <p class="text-white/80 text-base max-w-md">
              Marketplace de experiencia, servicios y talento especializado. Conectamos la trayectoria acumulada de personas de 50 a 75 años con personas y empresas que valoran el trabajo bien hecho.
            </p>
            <div class="p-3 bg-white/5 rounded-lg border border-white/10 inline-block text-sm text-[#129BFF] font-medium">
              “La experiencia sigue generando valor.”
            </div>
          </div>

          <!-- Navegación -->
          <div>
            <h4 class="text-white font-bold text-lg mb-4">Navegación</h4>
            <ul class="space-y-2.5 text-white/80 text-sm">
              <li><a href="#inicio" class="hover:text-[#129BFF] transition">Inicio</a></li>
              <li><a href="#categorias" class="hover:text-[#129BFF] transition">Categorías de Oficios</a></li>
              <li><a href="#especialistas" class="hover:text-[#129BFF] transition">Directorio de Especialistas</a></li>
              <li><a href="#como-funciona" class="hover:text-[#129BFF] transition">Cómo Funciona</a></li>
              <li><a href="#empresas-b2b" class="hover:text-[#129BFF] transition flex items-center gap-1">Empresas / B2B <span class="badge-b2b text-[10px]">B2B</span></a></li>
              <li><a href="#quiero-ofrecer" class="hover:text-[#129BFF] transition">Ofrecer mi Experiencia</a></li>
            </ul>
          </div>

          <!-- Confianza y Seguridad -->
          <div>
            <h4 class="text-white font-bold text-lg mb-4">Confianza & Soporte</h4>
            <ul class="space-y-2.5 text-white/80 text-sm">
              <li><a href="#como-funciona" class="hover:text-[#129BFF] transition">Validación de perfiles</a></li>
              <li><a href="#contacto" class="hover:text-[#129BFF] transition">Prevención y seguridad</a></li>
              <li><a href="#contacto" class="hover:text-[#129BFF] transition">Reportar una incidencia</a></li>
              <li><a href="#contacto" class="hover:text-[#129BFF] transition">Términos y condiciones</a></li>
              <li><a href="#contacto" class="hover:text-[#129BFF] transition">Política de privacidad</a></li>
            </ul>
          </div>

          <!-- Contacto Asistido -->
          <div>
            <h4 class="text-white font-bold text-lg mb-4">Atención Humana</h4>
            <p class="text-white/80 text-sm mb-4">
              ¿Tienes dudas o necesitas asistencia personalizada para encontrar a alguien?
            </p>
            <a href="https://wa.me/573009998888?text=Hola,%20deseo%20asesoria%20en%20Oficios%20que%20Valen" target="_blank" class="btn-whatsapp w-full text-sm py-2.5 px-3 mb-3">
              <i data-lucide="message-circle" class="w-5 h-5"></i>
              WhatsApp Oficial
            </a>
            <div class="text-xs text-white/60 space-y-1">
              <p>Horario: Lun - Sáb, 8:00 a 18:00</p>
              <p>Atención directa sin bots confusos.</p>
            </div>
          </div>
        </div>

        <!-- Barra inferior -->
        <div class="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/60">
          <p>© 2026 OFICIOS QUE VALEN. Todos los derechos reservados. Diseñado para la dignidad y el valor del conocimiento.</p>
          <div class="flex items-center gap-4">
            <a href="#admin" class="hover:text-white transition flex items-center gap-1">
              <i data-lucide="database" class="w-3.5 h-3.5"></i>
              Panel de Solicitudes (MVP)
            </a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// -----------------------------------------------------------------------------
// VISTA 1: INICIO (HOME)
// -----------------------------------------------------------------------------
function renderInicio(container) {
  // Tomamos 6 categorías principales y 3 especialistas destacados
  const topCategories = CATEGORIES_DATA.slice(0, 6);
  const featuredSpecialists = SPECIALISTS_DATA.slice(0, 3);

  container.innerHTML = `
    <!-- HERO PRINCIPAL -->
    <section class="relative bg-gradient-to-b from-[#EAF4FF] via-[#F6F8FB] to-white py-16 lg:py-24 overflow-hidden border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Texto del Hero -->
          <div class="lg:col-span-7 space-y-6">
            <!-- Badge de enfoque -->
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#B2D7FF] shadow-sm">
              <span class="w-2.5 h-2.5 rounded-full bg-[#129BFF]"></span>
              <span class="text-xs font-bold text-[#052B63] tracking-wide uppercase">Talento y Oficios con Trayectoria</span>
            </div>

            <!-- Headline oficial sugerido -->
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-[#052B63] tracking-tight leading-tight">
              Tu experiencia sigue <span class="text-[#0A63CE]">teniendo valor.</span>
            </h1>

            <!-- Subheadline oficial sugerido -->
            <p class="text-lg sm:text-xl text-[#667085] leading-relaxed max-w-2xl">
              Encuentra personas con experiencia para aprender, resolver una necesidad o fortalecer tu negocio. Artesanos, técnicos y profesionales de 50 a 75 años con vocación y oficio comprobado.
            </p>

            <!-- Buscador visible según especificación -->
            <div class="bg-white p-3 rounded-2xl shadow-xl border border-gray-200 max-w-2xl">
              <form id="hero-search-form" class="flex flex-col sm:flex-row gap-2">
                <div class="relative flex-1 flex items-center">
                  <i data-lucide="search" class="w-6 h-6 text-gray-400 absolute left-4 pointer-events-none"></i>
                  <input 
                    type="text" 
                    id="hero-search-input"
                    class="w-full pl-13 pr-4 py-3.5 text-base sm:text-lg text-[#172033] placeholder-gray-400 border-0 focus:ring-0 focus:outline-none"
                    placeholder="¿Qué necesitas? Ej.: clases de matemática, carpintería, asesoría contable…"
                  >
                </div>
                <button type="submit" class="btn-primary text-base px-6 py-3 whitespace-nowrap">
                  <span>Buscar</span>
                  <i data-lucide="arrow-right" class="w-5 h-5"></i>
                </button>
              </form>
              <div class="mt-2.5 pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs text-gray-500 px-2">
                <span class="font-semibold text-[#052B63]">Sugerencias:</span>
                <button class="search-tag px-2 py-1 bg-gray-100 hover:bg-[#EAF4FF] text-[#0A63CE] rounded-md transition" data-query="carpintería">Carpintería</button>
                <button class="search-tag px-2 py-1 bg-gray-100 hover:bg-[#EAF4FF] text-[#0A63CE] rounded-md transition" data-query="costura">Alta Costura</button>
                <button class="search-tag px-2 py-1 bg-gray-100 hover:bg-[#EAF4FF] text-[#0A63CE] rounded-md transition" data-query="contabilidad">Contabilidad Pyme</button>
                <button class="search-tag px-2 py-1 bg-gray-100 hover:bg-[#EAF4FF] text-[#0A63CE] rounded-md transition" data-query="matemáticas">Tutorías</button>
              </div>
            </div>

            <!-- CTAs principales -->
            <div class="flex flex-wrap items-center gap-4 pt-2">
              <a href="#especialistas" class="btn-primary">
                <i data-lucide="users" class="w-5 h-5"></i>
                <span>Explorar especialistas</span>
              </a>
              <a href="#quiero-ofrecer" class="btn-secondary">
                <i data-lucide="user-plus" class="w-5 h-5"></i>
                <span>Quiero ofrecer mi experiencia</span>
              </a>
            </div>

            <!-- Acceso visible a Empresas / B2B -->
            <div class="pt-2 flex items-center gap-2 text-sm text-gray-600">
              <span class="badge-b2b text-xs">B2B</span>
              <span>¿Representas una empresa o institución?</span>
              <a href="#empresas-b2b" class="text-[#0A63CE] font-bold hover:underline flex items-center gap-0.5">
                Conoce el servicio corporativo
                <i data-lucide="chevron-right" class="w-4 h-4"></i>
              </a>
            </div>
          </div>

          <!-- Fotografía real y digna en el Hero -->
          <div class="lg:col-span-5 relative">
            <div class="relative mx-auto max-w-md lg:max-w-none">
              <!-- Tarjeta de respaldo flotante -->
              <div class="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100 z-20 flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#EAF4FF] text-[#0A63CE] flex items-center justify-center">
                  <i data-lucide="award" class="w-6 h-6"></i>
                </div>
                <div>
                  <p class="text-xs text-gray-500 font-medium">Experiencia promedio</p>
                  <p class="text-base font-bold text-[#052B63]">+30 años en oficio real</p>
                </div>
              </div>

              <!-- Imagen del especialista activo trabajando con dignidad -->
              <div class="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-200 aspect-[4/5] relative">
                <img 
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80" 
                  alt="Especialista sénior trabajando con maestría" 
                  class="w-full h-full object-cover object-center"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-[#052B63]/80 via-transparent to-transparent flex items-end p-6">
                  <div class="text-white">
                    <span class="badge-verified text-xs mb-1.5 inline-flex bg-white/90 text-[#052B63]">
                      <i data-lucide="check" class="w-3.5 h-3.5 text-[#0A63CE]"></i> Maestro Activo
                    </span>
                    <p class="text-lg font-bold">Don Roberto Méndez</p>
                    <p class="text-xs text-white/90">34 años en ebanistería y restauración de maderas</p>
                  </div>
                </div>
              </div>

              <!-- Tarjeta flotante de contacto seguro -->
              <div class="absolute -bottom-5 -right-4 bg-white p-4 rounded-xl shadow-xl border border-gray-100 z-20 flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#EAF4FF] text-[#128C7E] flex items-center justify-center">
                  <i data-lucide="message-circle" class="w-6 h-6"></i>
                </div>
                <div>
                  <p class="text-xs text-gray-500 font-medium">Contacto directo</p>
                  <p class="text-sm font-bold text-[#172033]">WhatsApp trazable y seguro</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- BLOQUE DE CATEGORÍAS PRINCIPALES -->
    <section class="py-16 bg-[#F6F8FB]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span class="text-sm font-bold text-[#0A63CE] uppercase tracking-wider">Especialidades</span>
            <h2 class="text-3xl font-extrabold text-[#052B63] mt-1">Categorías de Oficios y Conocimiento</h2>
            <p class="text-base text-[#667085] mt-1">Servicios ofrecidos por personas que conocen a fondo su labor.</p>
          </div>
          <a href="#categorias" class="btn-secondary text-sm py-2 px-4 self-start md:self-auto">
            <span>Ver todas las categorías (11)</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${topCategories.map(cat => `
            <div class="card-clean p-6 flex flex-col justify-between hover:-translate-y-1 transition duration-200">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 rounded-xl bg-[#EAF4FF] text-[#0A63CE] flex items-center justify-center">
                    <i data-lucide="${cat.icon}" class="w-6 h-6"></i>
                  </div>
                  <span class="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    ${cat.serviceCount} especialistas
                  </span>
                </div>
                <h3 class="text-xl font-bold text-[#052B63] mb-2">${cat.name}</h3>
                <p class="text-sm text-[#667085] leading-relaxed mb-4">${cat.shortDesc}</p>
                <div class="flex flex-wrap gap-1.5 mb-4">
                  ${cat.tags.slice(0, 3).map(tag => `
                    <span class="text-xs bg-[#F6F8FB] text-gray-600 px-2 py-0.5 rounded border border-gray-200">${tag}</span>
                  `).join('')}
                </div>
              </div>
              <a href="#especialistas/${cat.slug}" class="text-sm font-bold text-[#0A63CE] hover:text-[#052B63] flex items-center gap-1 mt-2 pt-3 border-t border-gray-100">
                <span>Explorar especialistas</span>
                <i data-lucide="chevron-right" class="w-4 h-4"></i>
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- BLOQUE DE PERFILES DESTACADOS -->
    <section class="py-16 bg-white border-y border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span class="text-sm font-bold text-[#0A63CE] uppercase tracking-wider">Perfiles con Portafolio</span>
            <h2 class="text-3xl font-extrabold text-[#052B63] mt-1">Especialistas Destacados</h2>
            <p class="text-base text-[#667085] mt-1">Trayectoria verificada, evidencias reales y vocación de servicio.</p>
          </div>
          <a href="#especialistas" class="btn-primary text-sm py-2 px-5 self-start md:self-auto">
            <span>Ver todo el directorio</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${featuredSpecialists.map(sp => renderSpecialistCardHtml(sp)).join('')}
        </div>
      </div>
    </section>

    <!-- CÓMO FUNCIONA EN 3 PASOS -->
    <section class="py-16 bg-[#F6F8FB]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-14">
          <span class="text-sm font-bold text-[#0A63CE] uppercase tracking-wider">Simple y Claro</span>
          <h2 class="text-3xl font-extrabold text-[#052B63] mt-1">¿Cómo funciona Oficios que Valen?</h2>
          <p class="text-base text-[#667085] mt-2">
            Diseñado para que cualquier persona, sin importar su familiaridad con la tecnología, pueda contratar con total tranquilidad.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          ${HOW_IT_WORKS_STEPS.map(step => `
            <div class="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm relative flex flex-col justify-between">
              <div class="mb-4">
                <div class="flex items-center justify-between mb-6">
                  <div class="w-14 h-14 rounded-2xl bg-[#EAF4FF] text-[#0A63CE] flex items-center justify-center font-bold text-xl">
                    <i data-lucide="${step.icon}" class="w-7 h-7"></i>
                  </div>
                  <span class="text-3xl font-black text-[#D0D5DD]">${step.step}</span>
                </div>
                <h3 class="text-xl font-bold text-[#052B63] mb-1">${step.title}</h3>
                <p class="text-xs font-semibold text-[#0A63CE] mb-3">${step.subtitle}</p>
                <p class="text-sm text-[#667085] leading-relaxed">${step.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="mt-12 text-center">
          <a href="#como-funciona" class="btn-secondary">
            <i data-lucide="info" class="w-5 h-5"></i>
            <span>Conoce más sobre nuestro proceso de validación</span>
          </a>
        </div>
      </div>
    </section>

    <!-- SECCIÓN DE CONFIANZA Y PROTECCIÓN -->
    <section class="py-16 bg-white border-y border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mb-12">
          <span class="text-sm font-bold text-[#0A63CE] uppercase tracking-wider">Garantía Humana</span>
          <h2 class="text-3xl font-extrabold text-[#052B63] mt-1">Por qué confiar en nuestra comunidad</h2>
          <p class="text-base text-[#667085] mt-2">
            No somos un tablón de anuncios anónimos ni una red social saturada. Respaldamos cada interacción.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${TRUST_PILLARS.map(pillar => `
            <div class="p-6 rounded-2xl bg-[#F6F8FB] border border-gray-200 space-y-3">
              <div class="w-12 h-12 rounded-xl bg-[#EAF4FF] text-[#052B63] flex items-center justify-center">
                <i data-lucide="${pillar.icon}" class="w-6 h-6 text-[#0A63CE]"></i>
              </div>
              <h3 class="text-lg font-bold text-[#052B63]">${pillar.title}</h3>
              <p class="text-sm text-[#667085] leading-relaxed">${pillar.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- BANNER B2B SEGÚN ESPECIFICACIÓN -->
    <section class="py-16 bg-[#052B63] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gradient-to-r from-[#052B63] to-[#0A63CE] p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div class="space-y-4 max-w-2xl">
            <div class="flex items-center gap-2">
              <span class="badge-b2b text-xs">SOLUCIONES B2B</span>
              <span class="text-xs uppercase tracking-wider text-[#129BFF] font-bold">Para Empresas e Instituciones</span>
            </div>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Experiencia que fortalece equipos.
            </h2>
            <p class="text-base sm:text-lg text-white/80 leading-relaxed">
              Conectamos empresas con especialistas de amplia trayectoria para capacitación técnica, mentoría a nuevos líderes, asesoría operativa y salvaguarda de conocimiento.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <a href="#empresas-b2b" class="btn-accent whitespace-nowrap">
              <span>Solicitar talento especializado</span>
              <i data-lucide="arrow-right" class="w-5 h-5"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  `;

  // Listener para el buscador del Hero
  const searchForm = document.getElementById('hero-search-form');
  const searchInput = document.getElementById('hero-search-input');
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      state.searchQuery = query;
      navigateTo('especialistas');
    });
  }

  // Tags rápidos del hero
  container.querySelectorAll('.search-tag').forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-query');
      state.searchQuery = query;
      navigateTo('especialistas');
    });
  });
}

// -----------------------------------------------------------------------------
// VISTA 2: CATEGORÍAS (LISTA COMPLETA)
// -----------------------------------------------------------------------------
function renderCategorias(container) {
  container.innerHTML = `
    <div class="bg-[#F6F8FB] py-10 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb accesible -->
        <nav class="flex items-center gap-2 text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
          <a href="#inicio" class="hover:text-[#0A63CE]">Inicio</a>
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
          <span class="text-[#052B63] font-semibold">Categorías</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-[#052B63]">Catálogo de Oficios y Especialidades</h1>
        <p class="text-base text-[#667085] mt-2 max-w-3xl">
          Selecciona una categoría para explorar especialistas con años de trayectoria comprobada, fotografías de trabajos reales y disponibilidad de atención.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${CATEGORIES_DATA.map(cat => `
          <div class="card-clean overflow-hidden flex flex-col justify-between group">
            <div class="h-44 overflow-hidden relative bg-gray-100">
              <img 
                src="${cat.image}" 
                alt="${cat.name}" 
                class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
              <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span class="text-xs font-semibold px-2 py-0.5 rounded bg-[#052B63]/80 backdrop-blur-sm">
                  ${cat.serviceCount} especialistas
                </span>
                <div class="w-8 h-8 rounded-full bg-white text-[#0A63CE] flex items-center justify-center shadow">
                  <i data-lucide="${cat.icon}" class="w-4 h-4"></i>
                </div>
              </div>
            </div>

            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h2 class="text-xl font-bold text-[#052B63] mb-2">${cat.name}</h2>
                <p class="text-sm text-[#667085] leading-relaxed mb-4">${cat.description}</p>
                
                <div class="flex flex-wrap gap-1.5 mb-6">
                  ${cat.tags.map(tag => `
                    <span class="text-xs bg-[#EAF4FF] text-[#052B63] font-medium px-2 py-0.5 rounded border border-[#B2D7FF]/40">${tag}</span>
                  `).join('')}
                </div>
              </div>

              <a href="#especialistas/${cat.slug}" class="btn-primary w-full text-center text-sm py-2.5">
                <span>Explorar Especialistas</span>
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// VISTA 3: LISTADO DE ESPECIALISTAS (DIRECTORIO FILTRABLE)
// -----------------------------------------------------------------------------
function renderEspecialistasList(container) {
  // Aplicar filtros
  let filtered = SPECIALISTS_DATA.filter(sp => {
    // Filtro categoría
    if (state.filters.category !== 'all' && sp.category !== state.filters.category) {
      return false;
    }
    // Filtro modalidad
    if (state.filters.modality !== 'all' && sp.modalityType !== state.filters.modality) {
      return false;
    }
    // Filtro búsqueda
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      const matchName = sp.name.toLowerCase().includes(q);
      const matchTitle = sp.title.toLowerCase().includes(q);
      const matchAbout = sp.aboutMe.toLowerCase().includes(q);
      const matchCat = sp.categoryName.toLowerCase().includes(q);
      const matchServ = sp.services.some(s => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q));
      if (!matchName && !matchTitle && !matchAbout && !matchCat && !matchServ) {
        return false;
      }
    }
    return true;
  });

  // Ordenamiento
  if (state.filters.sortBy === 'experience') {
    filtered.sort((a, b) => b.yearsExperience - a.yearsExperience);
  }

  // Nombre de categoría activa
  const activeCategoryObj = CATEGORIES_DATA.find(c => c.slug === state.filters.category);
  const categoryTitle = activeCategoryObj ? activeCategoryObj.name : 'Todos los Especialistas';

  container.innerHTML = `
    <div class="bg-[#F6F8FB] py-8 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex items-center gap-2 text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
          <a href="#inicio" class="hover:text-[#0A63CE]">Inicio</a>
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
          <a href="#categorias" class="hover:text-[#0A63CE]">Categorías</a>
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
          <span class="text-[#052B63] font-semibold">${categoryTitle}</span>
        </nav>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-extrabold text-[#052B63]">${categoryTitle}</h1>
            <p class="text-sm text-[#667085] mt-1">
              ${activeCategoryObj ? activeCategoryObj.shortDesc : 'Directorio de personas con trayectoria y trabajo artesanal, técnico o profesional.'}
            </p>
          </div>
          <div class="text-sm font-semibold text-[#052B63] bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm self-start">
            ${filtered.length} perfiles disponibles
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- BARRA DE FILTROS ACCESIBLE -->
      <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-8 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          
          <!-- Filtro Categoría -->
          <div>
            <label for="filter-category" class="block text-xs font-bold text-[#052B63] uppercase tracking-wider mb-1.5">Oficio / Categoría</label>
            <select id="filter-category" class="form-input-accessible py-2 text-sm h-12">
              <option value="all">Todas las categorías</option>
              ${CATEGORIES_DATA.map(c => `
                <option value="${c.slug}" ${state.filters.category === c.slug ? 'selected' : ''}>${c.name}</option>
              `).join('')}
            </select>
          </div>

          <!-- Filtro Modalidad -->
          <div>
            <label for="filter-modality" class="block text-xs font-bold text-[#052B63] uppercase tracking-wider mb-1.5">Modalidad de Atención</label>
            <select id="filter-modality" class="form-input-accessible py-2 text-sm h-12">
              <option value="all" ${state.filters.modality === 'all' ? 'selected' : ''}>Todas las modalidades</option>
              <option value="presencial" ${state.filters.modality === 'presencial' ? 'selected' : ''}>Presencial / En sitio o taller</option>
              <option value="virtual" ${state.filters.modality === 'virtual' ? 'selected' : ''}>Virtual / En línea</option>
              <option value="hibrido" ${state.filters.modality === 'hibrido' ? 'selected' : ''}>Híbrido (Presencial y Virtual)</option>
            </select>
          </div>

          <!-- Búsqueda por texto -->
          <div>
            <label for="filter-search" class="block text-xs font-bold text-[#052B63] uppercase tracking-wider mb-1.5">Palabra clave</label>
            <div class="relative">
              <input 
                type="text" 
                id="filter-search" 
                value="${state.searchQuery}" 
                placeholder="Ej. ebanista, DIAN, motor..." 
                class="form-input-accessible py-2 pr-8 text-sm h-12"
              >
              ${state.searchQuery ? `
                <button id="clear-search-btn" class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-700">
                  <i data-lucide="x" class="w-4 h-4"></i>
                </button>
              ` : ''}
            </div>
          </div>

          <!-- Botón de limpieza de filtros -->
          <div class="flex items-end h-full pt-4 sm:pt-0">
            <button id="reset-filters-btn" class="btn-secondary w-full text-sm py-2 h-12">
              <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
              <span>Restablecer Filtros</span>
            </button>
          </div>

        </div>

        ${state.searchQuery ? `
          <div class="flex items-center gap-2 pt-2 text-sm text-[#052B63]">
            <span class="font-medium">Filtrando por búsqueda:</span>
            <span class="bg-[#EAF4FF] px-2.5 py-1 rounded-md text-[#0A63CE] font-bold">"${state.searchQuery}"</span>
          </div>
        ` : ''}
      </div>

      <!-- LISTADO DE TARJETAS DE ESPECIALISTAS -->
      ${filtered.length > 0 ? `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${filtered.map(sp => renderSpecialistCardHtml(sp)).join('')}
        </div>
      ` : `
        <div class="bg-white p-12 text-center rounded-2xl border border-gray-200 max-w-xl mx-auto space-y-4">
          <div class="w-16 h-16 rounded-full bg-[#EAF4FF] text-[#0A63CE] flex items-center justify-center mx-auto">
            <i data-lucide="search-x" class="w-8 h-8"></i>
          </div>
          <h3 class="text-xl font-bold text-[#052B63]">No se encontraron especialistas con estos criterios</h3>
          <p class="text-sm text-[#667085]">
            Prueba cambiando la modalidad o el término de búsqueda, o solicita asistencia manual para buscarte el especialista adecuado.
          </p>
          <div class="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button id="empty-reset-btn" class="btn-primary text-sm">Ver todos los perfiles</button>
            <a href="https://wa.me/573009998888?text=Hola,%20busco%20un%20especialista%20y%20no%20lo%20encuentro" target="_blank" class="btn-whatsapp text-sm">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              Solicitar Búsqueda Asistida
            </a>
          </div>
        </div>
      `}
    </div>
  `;

  // Event Listeners de Filtros
  const catSelect = document.getElementById('filter-category');
  const modSelect = document.getElementById('filter-modality');
  const searchInput = document.getElementById('filter-search');
  const resetBtn = document.getElementById('reset-filters-btn');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const emptyResetBtn = document.getElementById('empty-reset-btn');

  if (catSelect) {
    catSelect.addEventListener('change', (e) => {
      state.filters.category = e.target.value;
      renderEspecialistasList(container);
      if (window.lucide) window.lucide.createIcons();
    });
  }

  if (modSelect) {
    modSelect.addEventListener('change', (e) => {
      state.filters.modality = e.target.value;
      renderEspecialistasList(container);
      if (window.lucide) window.lucide.createIcons();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      // debounce simple
      clearTimeout(window._searchTimer);
      window._searchTimer = setTimeout(() => {
        renderEspecialistasList(container);
        if (window.lucide) window.lucide.createIcons();
      }, 350);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.filters.category = 'all';
      state.filters.modality = 'all';
      state.searchQuery = '';
      renderEspecialistasList(container);
      if (window.lucide) window.lucide.createIcons();
    });
  }

  if (emptyResetBtn) {
    emptyResetBtn.addEventListener('click', () => {
      state.filters.category = 'all';
      state.filters.modality = 'all';
      state.searchQuery = '';
      renderEspecialistasList(container);
      if (window.lucide) window.lucide.createIcons();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      state.searchQuery = '';
      renderEspecialistasList(container);
      if (window.lucide) window.lucide.createIcons();
    });
  }
}

// Renderizado de tarjeta de especialista reutilizable (conforme a 5.3)
function renderSpecialistCardHtml(sp) {
  const previewImage = sp.portfolio && sp.portfolio.length > 0 ? sp.portfolio[0].image : sp.avatar;

  return `
    <div class="card-clean overflow-hidden flex flex-col justify-between group">
      <div>
        <!-- Foto en acción o retrato + Badge de Verificado -->
        <div class="relative h-60 overflow-hidden bg-gray-100">
          <img 
            src="${sp.avatar}" 
            alt="${sp.name}" 
            class="w-full h-full object-cover object-top group-hover:scale-103 transition duration-300"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-[#052B63]/85 via-transparent to-transparent"></div>
          
          <!-- Badge verificado oficial -->
          <div class="absolute top-3 left-3">
            <span class="badge-verified shadow-sm bg-white/95 text-[#052B63] font-bold">
              <i data-lucide="check-circle" class="w-4 h-4 text-[#0A63CE]"></i>
              Verificado
            </span>
          </div>

          <!-- Años de experiencia destacados (no la edad biológica, sino el oficio) -->
          <div class="absolute top-3 right-3 bg-[#052B63] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm border border-white/20">
            ${sp.yearsExperience} años de experiencia
          </div>

          <!-- Nombre y especialidad en el pie de imagen -->
          <div class="absolute bottom-3 left-4 right-4 text-white">
            <h3 class="text-xl font-black tracking-tight leading-tight">${sp.name}</h3>
            <p class="text-xs text-white/90 line-clamp-1">${sp.title}</p>
          </div>
        </div>

        <!-- Contenido de la tarjeta -->
        <div class="p-5 space-y-4">
          <!-- Ubicación y modalidad -->
          <div class="space-y-1.5 text-xs text-[#667085] pb-3 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <i data-lucide="map-pin" class="w-4 h-4 text-[#0A63CE] shrink-0"></i>
              <span class="line-clamp-1">${sp.location}</span>
            </div>
            <div class="flex items-center gap-2">
              <i data-lucide="clock" class="w-4 h-4 text-[#0A63CE] shrink-0"></i>
              <span>${sp.modality}</span>
            </div>
          </div>

          <!-- Breve descripción de valor -->
          <p class="text-sm text-[#172033] line-clamp-2 leading-relaxed">
            ${sp.shortSummary}
          </p>

          <!-- Miniatura real de trabajo / portafolio de evidencia -->
          ${sp.portfolio && sp.portfolio.length > 0 ? `
            <div class="pt-2">
              <div class="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                <span class="font-semibold text-[#052B63]">Evidencia de trabajo:</span>
                <span class="text-[11px]">${sp.portfolio.length} proyectos en portafolio</span>
              </div>
              <div class="flex items-center gap-2.5 p-2 bg-[#F6F8FB] rounded-xl border border-gray-200">
                <img src="${previewImage}" alt="Trabajo previo" class="w-12 h-12 rounded-lg object-cover shrink-0">
                <div class="text-xs leading-snug overflow-hidden">
                  <p class="font-bold text-[#172033] truncate">${sp.portfolio[0].title}</p>
                  <p class="text-gray-500 text-[11px] truncate">${sp.portfolio[0].workType}</p>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Acciones de la tarjeta: Ver perfil y Solicitar servicio -->
      <div class="p-5 pt-0 flex items-center gap-2">
        <a href="#perfil/${sp.slug}" class="btn-secondary flex-1 text-sm py-2.5 text-center" style="min-height: 48px;">
          <span>Ver perfil</span>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </a>
        <button 
          onclick="window.openContactModal('${sp.id}', '${sp.name}', '${sp.services[0].name}')" 
          class="btn-primary text-sm py-2.5 px-3 shrink-0" 
          style="min-height: 48px;" 
          title="Contactar o solicitar servicio"
        >
          <i data-lucide="message-circle" class="w-5 h-5"></i>
        </button>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// VISTA 4: PERFIL INDIVIDUAL DEL ESPECIALISTA (CONFORME A 5.4 Y 5.5)
// -----------------------------------------------------------------------------
function renderPerfilIndividual(container, slug) {
  const sp = SPECIALISTS_DATA.find(s => s.slug === slug || s.id === slug);

  if (!sp) {
    container.innerHTML = `
      <div class="max-w-2xl mx-auto py-20 px-4 text-center">
        <h2 class="text-2xl font-bold text-[#052B63]">Especialista no encontrado</h2>
        <p class="text-gray-600 mt-2">El perfil solicitado no existe o ha sido reubicado.</p>
        <a href="#especialistas" class="btn-primary mt-6">Regresar al Directorio</a>
      </div>
    `;
    return;
  }

  state.currentSpecialist = sp;

  container.innerHTML = `
    <!-- Barra superior de navegación / volver atrás -->
    <div class="bg-white border-b border-gray-200 py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <nav class="flex items-center gap-2 text-sm text-gray-500">
          <a href="#inicio" class="hover:text-[#0A63CE]">Inicio</a>
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
          <a href="#especialistas" class="hover:text-[#0A63CE]">Especialistas</a>
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
          <span class="text-[#052B63] font-semibold truncate max-w-xs">${sp.name}</span>
        </nav>
        <a href="#especialistas" class="btn-secondary text-xs py-1.5 px-3" style="min-height: 38px;">
          <i data-lucide="arrow-left" class="w-4 h-4"></i>
          <span>Volver al listado</span>
        </a>
      </div>
    </div>

    <!-- CABECERA DEL PERFIL (FICHA PRINCIPAL) -->
    <section class="bg-gradient-to-b from-[#EAF4FF]/50 to-white py-10 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Foto grande y digna del especialista -->
          <div class="lg:col-span-4">
            <div class="rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gray-100 aspect-square relative">
              <img 
                src="${sp.avatar}" 
                alt="${sp.name}" 
                class="w-full h-full object-cover object-top"
              >
              <div class="absolute bottom-3 left-3">
                <span class="badge-verified bg-white/95 text-[#052B63] font-bold shadow-md">
                  <i data-lucide="check-circle" class="w-4 h-4 text-[#0A63CE]"></i>
                  ${sp.badgeText}
                </span>
              </div>
            </div>

            <!-- Mini caja de datos rápidos -->
            <div class="mt-4 bg-white p-4 rounded-2xl border border-gray-200 space-y-2.5 text-xs text-[#667085]">
              <div class="flex items-center gap-2">
                <i data-lucide="calendar" class="w-4 h-4 text-[#0A63CE]"></i>
                <span><strong>Disponibilidad:</strong> ${sp.disponibilidad}</span>
              </div>
              <div class="flex items-center gap-2">
                <i data-lucide="map" class="w-4 h-4 text-[#0A63CE]"></i>
                <span><strong>Zonas de cobertura:</strong> ${sp.zoneCoverage}</span>
              </div>
              <div class="flex items-center gap-2">
                <i data-lucide="shield" class="w-4 h-4 text-[#0A63CE]"></i>
                <span>Identidad y antecedentes verificados por la plataforma</span>
              </div>
            </div>
          </div>

          <!-- Información y llamada a la acción -->
          <div class="lg:col-span-8 space-y-6">
            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-3">
                <span class="bg-[#EAF4FF] text-[#052B63] font-bold text-xs px-3 py-1 rounded-full border border-[#B2D7FF]">
                  ${sp.categoryName}
                </span>
                <span class="bg-[#052B63] text-white text-xs font-bold px-3 py-1 rounded-full">
                  ${sp.yearsExperience} años de experiencia comprobada
                </span>
                <span class="text-xs text-gray-500 font-medium">
                  Modalidad: ${sp.modality}
                </span>
              </div>
              <h1 class="text-3xl sm:text-4xl font-black text-[#052B63] tracking-tight">
                ${sp.name}
              </h1>
              <p class="text-xl text-[#0A63CE] font-semibold">
                ${sp.title}
              </p>
            </div>

            <p class="text-lg text-[#172033] leading-relaxed">
              ${sp.shortSummary}
            </p>

            <div class="flex items-center gap-2 text-sm text-gray-600">
              <i data-lucide="map-pin" class="w-5 h-5 text-[#0A63CE]"></i>
              <span>${sp.location}</span>
            </div>

            <!-- BOTÓN PRINCIPAL DE CONTACTO Y WHATSAPP TRAZABLE -->
            <div class="p-6 bg-[#F6F8FB] rounded-2xl border border-gray-200 space-y-3">
              <h3 class="text-base font-bold text-[#052B63]">¿Deseas contratar o consultar con ${sp.name}?</h3>
              <p class="text-sm text-gray-600">
                La solicitud registra tu interés y abre directamente una conversación por WhatsApp con los datos del servicio precargados.
              </p>
              <div class="flex flex-wrap items-center gap-4 pt-1">
                <button 
                  onclick="window.openContactModal('${sp.id}', '${sp.name}', '${sp.services[0].name}')" 
                  class="btn-whatsapp text-base flex-1 sm:flex-initial"
                >
                  <i data-lucide="message-circle" class="w-6 h-6"></i>
                  <span>Contactar por WhatsApp Oficial</span>
                </button>
                <a href="#contacto" class="btn-secondary text-sm">
                  <i data-lucide="help-circle" class="w-5 h-5"></i>
                  <span>Asistencia telefónica</span>
                </a>
              </div>
              <p class="text-[11px] text-gray-500">
                * Tu número y datos quedan protegidos por nuestra política de intermediación segura.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- DETALLE DEL PERFIL: SERVICIOS, TRAYECTORIA Y PORTAFOLIO VISUAL -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <!-- Columna Principal -->
        <div class="lg:col-span-8 space-y-12">
          
          <!-- SECCIÓN: SOBRE MÍ -->
          <section class="space-y-4">
            <h2 class="text-2xl font-bold text-[#052B63] flex items-center gap-2">
              <i data-lucide="user" class="w-6 h-6 text-[#0A63CE]"></i>
              <span>Sobre mi oficio y trayectoria</span>
            </h2>
            <div class="text-[#172033] text-base leading-relaxed bg-white p-6 rounded-2xl border border-gray-200">
              <p class="whitespace-pre-line">${sp.aboutMe}</p>
            </div>
          </section>

          <!-- SECCIÓN: SERVICIOS DETALLADOS -->
          <section class="space-y-4">
            <h2 class="text-2xl font-bold text-[#052B63] flex items-center gap-2">
              <i data-lucide="check-square" class="w-6 h-6 text-[#0A63CE]"></i>
              <span>Servicios que ofrezco</span>
            </h2>
            <div class="grid grid-cols-1 gap-4">
              ${sp.services.map(serv => `
                <div class="bg-white p-5 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div class="space-y-1">
                    <h3 class="text-lg font-bold text-[#052B63]">${serv.name}</h3>
                    <p class="text-sm text-[#667085]">${serv.desc}</p>
                  </div>
                  <button 
                    onclick="window.openContactModal('${sp.id}', '${sp.name}', '${serv.name}')" 
                    class="btn-primary text-xs py-2 px-4 whitespace-nowrap self-start sm:self-center"
                    style="min-height: 40px;"
                  >
                    Consultar este servicio
                  </button>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- SECCIÓN OBLIGATORIA: PORTAFOLIO VISUAL CON GALERÍA Y LIGHTBOX (5.4) -->
          <section id="portafolio-section" class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-[#052B63] flex items-center gap-2">
                  <i data-lucide="image" class="w-6 h-6 text-[#0A63CE]"></i>
                  <span>Portafolio de Trabajos y Evidencias</span>
                </h2>
                <p class="text-sm text-gray-500 mt-0.5">Fotografías reales de piezas, restauraciones y proyectos realizados.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              ${sp.portfolio.map((item, index) => `
                <div 
                  class="gallery-thumbnail card-clean overflow-hidden group bg-white"
                  onclick="window.openLightbox(${index})"
                >
                  <div class="h-48 overflow-hidden relative">
                    <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                      <span class="bg-white/90 text-[#052B63] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow">
                        <i data-lucide="zoom-in" class="w-4 h-4 text-[#0A63CE]"></i>
                        Ver en grande
                      </span>
                    </div>
                  </div>
                  <div class="p-3.5 space-y-1">
                    <span class="text-[11px] font-bold text-[#0A63CE] uppercase tracking-wide">${item.workType}</span>
                    <h4 class="text-sm font-bold text-[#052B63] line-clamp-1">${item.title}</h4>
                    <p class="text-xs text-gray-500 line-clamp-2">${item.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- SECCIÓN DE RESEÑAS PREPARADA (5.4: sin inventar testimonios falsos) -->
          <section class="space-y-4">
            <h2 class="text-2xl font-bold text-[#052B63] flex items-center gap-2">
              <i data-lucide="star" class="w-6 h-6 text-[#0A63CE]"></i>
              <span>Reseñas de Clientes</span>
            </h2>
            <div class="bg-[#F6F8FB] p-6 rounded-2xl border border-dashed border-gray-300 text-center space-y-2">
              <div class="w-10 h-10 rounded-full bg-white text-gray-400 flex items-center justify-center mx-auto shadow-sm">
                <i data-lucide="message-square" class="w-5 h-5"></i>
              </div>
              <h3 class="text-base font-bold text-[#052B63]">Módulo de Valoraciones Verificadas</h3>
              <p class="text-sm text-gray-600 max-w-lg mx-auto">
                En cumplimiento de nuestra política de honestidad y transparencia, solo publicamos testimonios verificados de contrataciones reales. Este perfil se encuentra activo para recibir sus primeras solicitudes en la plataforma.
              </p>
            </div>
          </section>

        </div>

        <!-- Columna Lateral: Trayectoria, Formación y Reportar -->
        <div class="lg:col-span-4 space-y-6">
          
          <!-- Hitos de Trayectoria -->
          <div class="bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
            <h3 class="text-lg font-bold text-[#052B63] flex items-center gap-2">
              <i data-lucide="briefcase" class="w-5 h-5 text-[#0A63CE]"></i>
              <span>Trayectoria Destacada</span>
            </h3>
            <ul class="space-y-3">
              ${sp.trajectory.map(item => `
                <li class="flex items-start gap-2.5 text-xs text-gray-700 leading-relaxed">
                  <i data-lucide="check" class="w-4 h-4 text-[#0A63CE] shrink-0 mt-0.5"></i>
                  <span>${item}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Formación y Certificaciones -->
          <div class="bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
            <h3 class="text-lg font-bold text-[#052B63] flex items-center gap-2">
              <i data-lucide="award" class="w-5 h-5 text-[#0A63CE]"></i>
              <span>Certificaciones y Formación</span>
            </h3>
            <ul class="space-y-3">
              ${sp.certificaciones.map(cert => `
                <li class="flex items-start gap-2.5 text-xs text-gray-700 leading-relaxed">
                  <i data-lucide="shield-check" class="w-4 h-4 text-[#128C7E] shrink-0 mt-0.5"></i>
                  <span>${cert}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Si es B2B ready -->
          ${sp.isB2BReady ? `
            <div class="bg-[#EAF4FF] p-6 rounded-2xl border border-[#B2D7FF] space-y-3">
              <div class="flex items-center gap-2">
                <span class="badge-b2b text-xs">PERFIL B2B</span>
                <span class="text-xs font-bold text-[#052B63]">Disponible para Empresas</span>
              </div>
              <p class="text-xs text-[#052B63] leading-relaxed">
                Este especialista cuenta con credenciales para asesoría corporativa, capacitaciones de planta y mentoría de líderes.
              </p>
              <a href="#dossier/${sp.id}" class="btn-primary w-full text-xs py-2 text-center" style="min-height: 40px;">
                <span>Ver Dossier Profesional</span>
                <i data-lucide="external-link" class="w-4 h-4"></i>
              </a>
            </div>
          ` : ''}

          <!-- Botón de Seguridad / Reportar -->
          <div class="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
            <button 
              onclick="alert('Mecanismo de reporte de incidencia:\\n\\nSi observas alguna inconsistencia en este perfil o necesitas mediación, escríbenos a soporte@oficiosquevalen.com o al WhatsApp de la plataforma.');" 
              class="text-xs text-gray-500 hover:text-red-600 transition flex items-center justify-center gap-1.5 mx-auto"
            >
              <i data-lucide="flag" class="w-4 h-4"></i>
              <span>Reportar este perfil o solicitar soporte</span>
            </button>
          </div>

        </div>

      </div>
    </div>

    <!-- BARRA INFERIOR FIJA EN MÓVIL (CONFORME A 5.5) -->
    <div class="lg:hidden mobile-profile-action-bar flex items-center gap-3">
      <a href="#portafolio-section" class="btn-secondary text-xs py-2 px-3 shrink-0" style="min-height: 46px;">
        <i data-lucide="image" class="w-4 h-4"></i>
        <span>Portafolio</span>
      </a>
      <button 
        onclick="window.openContactModal('${sp.id}', '${sp.name}', '${sp.services[0].name}')" 
        class="btn-whatsapp text-sm flex-1 py-2" 
        style="min-height: 46px;"
      >
        <i data-lucide="message-circle" class="w-5 h-5"></i>
        <span>Solicitar Servicio</span>
      </button>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// VISTA 5: EMPRESAS / B2B (CONFORME A SECCIÓN 6)
// -----------------------------------------------------------------------------
function renderEmpresasB2B(container) {
  const b2bSpecialists = SPECIALISTS_DATA.filter(s => s.isB2BReady);

  container.innerHTML = `
    <!-- HERO B2B CON LOGO OFICIAL B2B -->
    <section class="bg-gradient-to-b from-[#052B63] to-[#0A63CE] text-white py-16 lg:py-24 border-b border-blue-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div class="lg:col-span-7 space-y-6">
            <!-- Badge B2B -->
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <span class="badge-b2b text-xs">OFICIOS QUE VALEN B2B</span>
              <span class="text-xs font-semibold text-[#129BFF]">Alianza Empresa - Talento Sénior</span>
            </div>

            <!-- Headline oficial sugerido -->
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Experiencia que <span class="text-[#129BFF]">fortalece equipos.</span>
            </h1>

            <!-- Subheadline oficial sugerido -->
            <p class="text-lg sm:text-xl text-white/85 leading-relaxed">
              Conectamos empresas con especialistas de amplia trayectoria para capacitar, asesorar, acompañar proyectos y transferir conocimiento crítico.
            </p>

            <div class="flex flex-wrap items-center gap-4 pt-4">
              <a href="#solicitar-b2b-form" class="btn-accent">
                <i data-lucide="briefcase" class="w-5 h-5"></i>
                <span>Solicitar talento especializado</span>
              </a>
              <a href="#especialistas-b2b" class="btn-secondary bg-white/10 text-white border-white/30 hover:bg-white hover:text-[#052B63]">
                <i data-lucide="users" class="w-5 h-5"></i>
                <span>Explorar especialistas B2B</span>
              </a>
            </div>

            <div class="pt-2 flex items-center gap-3 text-xs text-white/70">
              <i data-lucide="check-circle" class="w-4 h-4 text-[#129BFF]"></i>
              <span>No es una bolsa de trabajo genérica. Es acceso a criterio y experiencia sénior probada.</span>
            </div>
          </div>

          <!-- Logo Oficial B2B destacado sobre fondo blanco limpio -->
          <div class="lg:col-span-5 flex justify-center">
            <div class="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border-4 border-white/30 text-center max-w-sm">
              <img src="assets/images/logo-b2b.png" alt="OFICIOS QUE VALEN B2B" class="w-full h-auto object-contain mx-auto">
              <div class="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 font-medium">
                Soluciones de asesoría, mentoría y capacitación técnica para organizaciones
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- FLUJO B2B EXPLICADO (CONFORME A SECCIÓN 7) -->
    <section class="py-14 bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <span class="text-xs font-bold text-[#0A63CE] uppercase tracking-wider">Metodología de Acompañamiento</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#052B63] mt-1">Cómo trabajamos con tu empresa</h2>
          <p class="text-sm text-gray-600 mt-1">Matching manual y personalizado sin algoritmos impersonales.</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
          ${[
            { num: '1', title: 'Necesidad', desc: 'Recibimos el requerimiento puntual' },
            { num: '2', title: 'Diagnóstico', desc: 'Alineamos alcance y objetivos' },
            { num: '3', title: 'Selección', desc: 'Presentamos especialistas idóneos' },
            { num: '4', title: 'Propuesta', desc: 'Definimos plan de trabajo y horas' },
            { num: '5', title: 'Servicio', desc: 'Ejecución y transferencia en sitio' },
            { num: '6', title: 'Seguimiento', desc: 'Medición de impacto y continuidad' }
          ].map(f => `
            <div class="p-4 rounded-xl bg-[#F6F8FB] border border-gray-200 flex flex-col justify-between">
              <div class="w-8 h-8 rounded-full bg-[#052B63] text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">
                ${f.num}
              </div>
              <h4 class="text-sm font-bold text-[#052B63] mb-1">${f.title}</h4>
              <p class="text-[11px] text-gray-500">${f.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SERVICIOS B2B (CONFORME A 6.2) -->
    <section class="py-16 bg-[#F6F8FB]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mb-12">
          <span class="badge-b2b text-xs mb-2">LÍNEAS DE SERVICIO</span>
          <h2 class="text-3xl font-extrabold text-[#052B63]">Soluciones Especializadas para Empresas</h2>
          <p class="text-base text-[#667085] mt-1">
            Flexibilidad contractual por horas, proyectos cerrados o programas de mentoría continua.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${B2B_SERVICES_DATA.map(serv => `
            <div class="card-clean p-7 flex flex-col justify-between">
              <div class="space-y-4">
                <div class="w-12 h-12 rounded-xl bg-[#EAF4FF] text-[#0A63CE] flex items-center justify-center">
                  <i data-lucide="${serv.icon}" class="w-6 h-6"></i>
                </div>
                <h3 class="text-xl font-bold text-[#052B63]">${serv.title}</h3>
                <p class="text-sm text-[#667085] leading-relaxed">${serv.description}</p>
                
                <div class="space-y-1.5 pt-2">
                  <p class="text-xs font-bold text-[#052B63] uppercase tracking-wide">Entregables habituales:</p>
                  <ul class="text-xs text-gray-600 space-y-1">
                    ${serv.deliverables.map(d => `
                      <li class="flex items-center gap-1.5">
                        <i data-lucide="check" class="w-3.5 h-3.5 text-[#0A63CE]"></i>
                        <span>${d}</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              </div>

              <div class="pt-6 mt-4 border-t border-gray-100">
                <a href="#solicitar-b2b-form" class="text-sm font-bold text-[#0A63CE] hover:text-[#052B63] flex items-center gap-1">
                  <span>Solicitar este servicio</span>
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- PERFILES B2B EJECUTIVOS (CONFORME A 6.3) -->
    <section id="especialistas-b2b" class="py-16 bg-white border-y border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span class="badge-b2b text-xs mb-2">TALENTO DISPONIBLE</span>
            <h2 class="text-3xl font-extrabold text-[#052B63]">Especialistas con Ficha Corporativa</h2>
            <p class="text-base text-[#667085] mt-1">Perfiles ejecutivos preparados para inserción ágil en proyectos y asesorías.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${b2bSpecialists.map(sp => `
            <div class="card-clean p-6 flex flex-col justify-between">
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <img src="${sp.avatar}" alt="${sp.name}" class="w-18 h-18 rounded-2xl object-cover border-2 border-[#129BFF]">
                  <div>
                    <h3 class="text-lg font-bold text-[#052B63] leading-snug">${sp.name}</h3>
                    <p class="text-xs text-[#0A63CE] font-semibold">${sp.title}</p>
                    <span class="badge-verified text-[11px] mt-1">
                      <i data-lucide="check-circle" class="w-3.5 h-3.5 text-[#0A63CE]"></i>
                      ${sp.yearsExperience} años en sector
                    </span>
                  </div>
                </div>

                <p class="text-sm text-gray-700 leading-relaxed">
                  ${sp.b2bHeadline || sp.shortSummary}
                </p>

                <!-- Sectores dominados -->
                ${sp.b2bSectors ? `
                  <div class="space-y-1.5 pt-2">
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Sectores de experiencia:</p>
                    <div class="flex flex-wrap gap-1.5">
                      ${sp.b2bSectors.map(s => `
                        <span class="text-xs bg-[#EAF4FF] text-[#052B63] font-medium px-2 py-0.5 rounded">${s}</span>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>

              <div class="pt-6 mt-4 border-t border-gray-100 flex items-center gap-3">
                <a href="#dossier/${sp.id}" class="btn-primary flex-1 text-xs py-2 text-center" style="min-height: 44px;">
                  <i data-lucide="file-text" class="w-4 h-4"></i>
                  <span>Ver Dossier</span>
                </a>
                <button 
                  onclick="window.openContactModal('${sp.id}', '${sp.name}', 'Asesoría B2B Corporativa')" 
                  class="btn-secondary text-xs py-2 px-3" 
                  style="min-height: 44px;" 
                  title="Consultar disponibilidad"
                >
                  <i data-lucide="message-circle" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- FORMULARIO DE SOLICITUD DE TALENTO PARA EMPRESAS (CONFORME A 6.4) -->
    <section id="solicitar-b2b-form" class="py-16 bg-[#F6F8FB]">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xl space-y-6">
          <div class="text-center space-y-2">
            <span class="badge-b2b text-xs">SOLICITUD CORPORATIVA</span>
            <h2 class="text-3xl font-extrabold text-[#052B63]">Cuéntanos qué necesita tu empresa</h2>
            <p class="text-base text-gray-600 max-w-xl mx-auto">
              Completa este breve formulario y nuestro equipo de enlace te propondrá perfiles acordes con tu objetivo en menos de 48 horas.
            </p>
          </div>

          <form id="b2b-contact-form" class="space-y-6 pt-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label for="b2b-empresa" class="block text-sm font-bold text-[#052B63] mb-1">Nombre de la Empresa *</label>
                <input type="text" id="b2b-empresa" required placeholder="Ej. Soluciones Logísticas SAS" class="form-input-accessible">
              </div>
              <div>
                <label for="b2b-contacto" class="block text-sm font-bold text-[#052B63] mb-1">Nombre y Cargo de Contacto *</label>
                <input type="text" id="b2b-contacto" required placeholder="Ej. Andrea Morales - Dir. Talento" class="form-input-accessible">
              </div>
              <div>
                <label for="b2b-correo" class="block text-sm font-bold text-[#052B63] mb-1">Correo Corporativo *</label>
                <input type="email" id="b2b-correo" required placeholder="andrea@empresa.com" class="form-input-accessible">
              </div>
              <div>
                <label for="b2b-telefono" class="block text-sm font-bold text-[#052B63] mb-1">Teléfono o WhatsApp de Contacto *</label>
                <input type="tel" id="b2b-telefono" required placeholder="+57 300 000 0000" class="form-input-accessible">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label for="b2b-servicio" class="block text-sm font-bold text-[#052B63] mb-1">Tipo de Servicio *</label>
                <select id="b2b-servicio" required class="form-input-accessible">
                  <option value="Capacitación corporativa">Capacitación corporativa</option>
                  <option value="Mentoría para líderes">Mentoría para líderes</option>
                  <option value="Asesoría especializada">Asesoría especializada</option>
                  <option value="Gestión de proyectos">Gestión de proyectos</option>
                  <option value="Transferencia de conocimiento">Transferencia de conocimiento</option>
                  <option value="Acompañamiento en planta">Acompañamiento en operaciones</option>
                </select>
              </div>
              <div>
                <label for="b2b-modalidad" class="block text-sm font-bold text-[#052B63] mb-1">Modalidad Deseada *</label>
                <select id="b2b-modalidad" required class="form-input-accessible">
                  <option value="Híbrida">Híbrida</option>
                  <option value="Presencial en instalaciones">Presencial en instalaciones</option>
                  <option value="100% Remota / Virtual">100% Remota / Virtual</option>
                </select>
              </div>
              <div>
                <label for="b2b-fecha" class="block text-sm font-bold text-[#052B63] mb-1">Fecha Estimada de Inicio</label>
                <input type="date" id="b2b-fecha" class="form-input-accessible">
              </div>
            </div>

            <div>
              <label for="b2b-descripcion" class="block text-sm font-bold text-[#052B63] mb-1">Descripción del Desafío o Necesidad *</label>
              <textarea 
                id="b2b-descripcion" 
                rows="4" 
                required 
                placeholder="Describe el área a fortalecer, el problema técnico u operativo que buscan resolver o los conocimientos específicos que requieren." 
                class="form-input-accessible h-auto py-3"
              ></textarea>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p class="text-xs text-gray-500 max-w-sm">
                Al enviar este formulario aceptas el contacto de enlace empresarial por parte de Oficios que Valen.
              </p>
              <button type="submit" class="btn-accent w-full sm:w-auto px-8">
                <span>Enviar Solicitud Corporativa</span>
                <i data-lucide="send" class="w-5 h-5"></i>
              </button>
            </div>
          </form>

          <!-- Mensaje de éxito oculto -->
          <div id="b2b-success-alert" class="hidden p-6 rounded-2xl bg-[#EAF4FF] border border-[#0A63CE] text-center space-y-2">
            <div class="w-12 h-12 rounded-full bg-[#0A63CE] text-white flex items-center justify-center mx-auto">
              <i data-lucide="check" class="w-6 h-6"></i>
            </div>
            <h3 class="text-xl font-bold text-[#052B63]">¡Solicitud recibida con éxito!</h3>
            <!-- Mensaje obligatorio exacto según 6.4 / página 7 -->
            <p class="text-base text-[#172033] font-medium max-w-lg mx-auto">
              “Nuestro equipo revisará tu necesidad y te propondrá especialistas adecuados.”
            </p>
            <p class="text-xs text-gray-500">Nos comunicaremos al correo o teléfono proporcionado en breve.</p>
          </div>

        </div>
      </div>
    </section>
  `;

  // Listener para el formulario B2B
  const b2bForm = document.getElementById('b2b-contact-form');
  const b2bSuccessAlert = document.getElementById('b2b-success-alert');

  if (b2bForm && b2bSuccessAlert) {
    b2bForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const requestData = {
        id: 'B2B-' + Date.now(),
        empresa: document.getElementById('b2b-empresa').value,
        contacto: document.getElementById('b2b-contacto').value,
        correo: document.getElementById('b2b-correo').value,
        telefono: document.getElementById('b2b-telefono').value,
        servicio: document.getElementById('b2b-servicio').value,
        modalidad: document.getElementById('b2b-modalidad').value,
        fecha: document.getElementById('b2b-fecha').value || 'Inmediata',
        descripcion: document.getElementById('b2b-descripcion').value,
        fechaRegistro: new Date().toLocaleString(),
        estado: 'Pendiente de diagnóstico'
      };

      state.b2bRequests.unshift(requestData);
      persistData();

      b2bForm.classList.add('hidden');
      b2bSuccessAlert.classList.remove('hidden');

      // Actualizar contador en header
      const counter = document.getElementById('header-leads-counter');
      if (counter) {
        counter.textContent = state.leads.length + state.b2bRequests.length + state.specialistApplications.length;
      }

      if (window.lucide) window.lucide.createIcons();
    });
  }
}

// -----------------------------------------------------------------------------
// VISTA: DOSSIER PROFESIONAL B2B (CONFORME A 6.3)
// -----------------------------------------------------------------------------
function renderDossierB2B(container, specialistId) {
  const sp = SPECIALISTS_DATA.find(s => s.id === specialistId) || SPECIALISTS_DATA[2]; // Default a Carlos Restrepo

  container.innerHTML = `
    <div class="bg-white border-b border-gray-200 py-4 no-print">
      <div class="max-w-5xl mx-auto px-4 flex items-center justify-between">
        <a href="#empresas-b2b" class="btn-secondary text-xs py-1.5 px-3" style="min-height: 38px;">
          <i data-lucide="arrow-left" class="w-4 h-4"></i>
          <span>Volver al portal B2B</span>
        </a>
        <div class="flex items-center gap-2">
          <button onclick="window.print()" class="btn-secondary text-xs py-1.5 px-3" style="min-height: 38px;">
            <i data-lucide="printer" class="w-4 h-4"></i>
            <span>Imprimir / Descargar PDF</span>
          </button>
          <button onclick="window.openContactModal('${sp.id}', '${sp.name}', 'Contratación B2B')" class="btn-primary text-xs py-1.5 px-3" style="min-height: 38px;">
            <i data-lucide="check" class="w-4 h-4"></i>
            <span>Solicitar este Especialista</span>
          </button>
        </div>
      </div>
    </div>

    <!-- DOCUMENTO DEL DOSSIER EJECUTIVO -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div class="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xl space-y-8">
        
        <!-- Header del Dossier -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b-2 border-gray-100 gap-4">
          <div class="flex items-center gap-4">
            <img src="assets/images/logo-b2b.png" alt="OFICIOS QUE VALEN B2B" class="h-16 w-auto">
          </div>
          <div class="text-left sm:text-right text-xs text-gray-500">
            <span class="badge-b2b text-xs mb-1">DOSSIER EJECUTIVO</span>
            <p class="font-bold text-[#052B63] text-sm">Ficha Técnica de Especialista Sénior</p>
            <p>ID Verificación: OQV-B2B-${sp.id.toUpperCase()}</p>
          </div>
        </div>

        <!-- Perfil y Datos clave -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div class="md:col-span-4">
            <div class="aspect-square rounded-2xl overflow-hidden border-2 border-[#129BFF] shadow-md">
              <img src="${sp.avatar}" alt="${sp.name}" class="w-full h-full object-cover">
            </div>
          </div>
          <div class="md:col-span-8 space-y-3">
            <div class="inline-flex items-center gap-2">
              <span class="badge-verified font-bold text-xs">
                <i data-lucide="shield-check" class="w-4 h-4 text-[#0A63CE]"></i>
                Perfil Auditado
              </span>
              <span class="text-xs bg-[#052B63] text-white px-2.5 py-0.5 rounded font-bold">
                ${sp.yearsExperience} años de experiencia
              </span>
            </div>
            <h1 class="text-3xl font-black text-[#052B63]">${sp.name}</h1>
            <p class="text-lg font-bold text-[#0A63CE]">${sp.title}</p>
            <p class="text-sm text-gray-700 leading-relaxed">${sp.b2bHeadline || sp.shortSummary}</p>
            
            <div class="grid grid-cols-2 gap-2 text-xs pt-2 text-gray-600">
              <p><strong>Modalidad:</strong> ${sp.modality}</p>
              <p><strong>Ubicación:</strong> ${sp.location}</p>
            </div>
          </div>
        </div>

        <!-- Hitos y Sectores -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
          <div class="space-y-3">
            <h3 class="text-base font-bold text-[#052B63] uppercase tracking-wider">Historial y Capacidades</h3>
            <ul class="space-y-2 text-xs text-gray-700 leading-relaxed">
              ${sp.trajectory.map(t => `
                <li class="flex items-start gap-2">
                  <i data-lucide="check-circle-2" class="w-4 h-4 text-[#0A63CE] shrink-0 mt-0.5"></i>
                  <span>${t}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          <div class="space-y-3">
            <h3 class="text-base font-bold text-[#052B63] uppercase tracking-wider">Certificaciones y Estudios</h3>
            <ul class="space-y-2 text-xs text-gray-700 leading-relaxed">
              ${sp.certificaciones.map(c => `
                <li class="flex items-start gap-2">
                  <i data-lucide="award" class="w-4 h-4 text-[#128C7E] shrink-0 mt-0.5"></i>
                  <span>${c}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <!-- Evidencias / Casos -->
        <div class="space-y-4 pt-6 border-t border-gray-100">
          <h3 class="text-base font-bold text-[#052B63] uppercase tracking-wider">Casos de Aplicación y Portafolio</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${sp.portfolio.map(p => `
              <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <img src="${p.image}" alt="${p.title}" class="w-16 h-16 rounded-lg object-cover shrink-0">
                <div class="text-xs space-y-1">
                  <p class="font-bold text-[#052B63]">${p.title}</p>
                  <p class="text-gray-600 line-clamp-2">${p.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Footer del Dossier -->
        <div class="pt-6 border-t-2 border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2">
          <p>Emitido a través de OFICIOS QUE VALEN B2B. Confidencialidad y protección de datos garantizada.</p>
          <p class="font-bold text-[#052B63]">oficiosquevalen.com/b2b</p>
        </div>

      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// VISTA 6: QUIERO OFRECER MI EXPERIENCIA (SENIOR ONBOARDING - SECCIÓN 5.6)
// -----------------------------------------------------------------------------
function renderQuieroOfrecer(container) {
  const currentStep = state.onboardingStep;

  container.innerHTML = `
    <!-- HEADER EMPÁTICO Y DIGNIFICANTE -->
    <section class="bg-gradient-to-b from-[#EAF4FF] to-[#F6F8FB] py-12 border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#B2D7FF] text-xs font-bold text-[#052B63]">
          <i data-lucide="heart-handshake" class="w-4 h-4 text-[#0A63CE]"></i>
          Convocatoria para personas de 50 a 75 años
        </span>
        <h1 class="text-3xl sm:text-5xl font-black text-[#052B63] tracking-tight">
          Lo que sabes hacer todavía puede abrir nuevas oportunidades.
        </h1>
        <p class="text-base sm:text-lg text-[#667085] max-w-2xl mx-auto leading-relaxed">
          Tu conocimiento, tus manos y tu experiencia acumulada tienen un valor enorme para personas y empresas. Te acompañamos en cada paso para crear tu ficha sin complicaciones tecnológicas.
        </p>

        <!-- BOTÓN PERMANENTE DE ASISTENCIA HUMANA POR WHATSAPP (5.6) -->
        <div class="pt-2">
          <a 
            href="https://wa.me/573009998888?text=Hola,%20quisiera%20ofrecer%20mi%20experiencia%20y%20necesito%20ayuda%20para%20registrarme" 
            target="_blank" 
            class="btn-whatsapp text-sm sm:text-base py-3 px-6 shadow-md inline-flex items-center gap-2"
          >
            <i data-lucide="help-circle" class="w-5 h-5"></i>
            <span>¿Prefieres ayuda para registrarte? Escríbenos por WhatsApp</span>
          </a>
          <p class="text-xs text-gray-500 mt-1.5">Un asesor de nuestro equipo te ayudará a responder las preguntas paso a paso.</p>
        </div>
      </div>
    </section>

    <!-- RUTA VISUAL DE 5 PASOS SENCILLOS (5.6) -->
    <section class="py-10 bg-white border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-5 gap-2 text-center text-xs">
          ${[
            { num: 1, label: 'Regístrate' },
            { num: 2, label: 'Qué sabes hacer' },
            { num: 3, label: 'Tus fotos o trabajos' },
            { num: 4, label: 'Validamos tu perfil' },
            { num: 5, label: 'Oportunidades' }
          ].map(s => `
            <div class="flex flex-col items-center">
              <div class="w-9 h-9 rounded-full ${s.num === currentStep ? 'bg-[#0A63CE] text-white ring-4 ring-[#EAF4FF]' : (s.num < currentStep ? 'bg-[#052B63] text-white' : 'bg-gray-100 text-gray-500')} font-bold text-sm flex items-center justify-center mb-1.5 transition">
                ${s.num < currentStep ? '✓' : s.num}
              </div>
              <span class="font-semibold ${s.num === currentStep ? 'text-[#052B63]' : 'text-gray-500'} hidden sm:block">${s.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- FORMULARIO EN PASOS (CAMPOS GRANDES, FÁCILES DE LEER) -->
    <section class="py-12 bg-[#F6F8FB]">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-lg">
          
          <form id="onboarding-form" class="space-y-6">
            
            <!-- PASO 1: DATOS BÁSICOS -->
            <div id="step-1-fields" class="${currentStep === 1 ? 'block' : 'hidden'} space-y-5">
              <div>
                <h3 class="text-xl font-bold text-[#052B63]">Paso 1: Tus datos de contacto</h3>
                <p class="text-xs text-gray-500 mt-1">Así podremos llamarte y coordinar contigo.</p>
              </div>

              <div>
                <label for="onb-nombre" class="block text-base font-bold text-[#052B63] mb-1.5">Tu nombre completo *</label>
                <input 
                  type="text" 
                  id="onb-nombre" 
                  value="${state.onboardingData.nombre}" 
                  required 
                  placeholder="Ej. Roberto Méndez" 
                  class="form-input-accessible"
                >
              </div>

              <div>
                <label for="onb-telefono" class="block text-base font-bold text-[#052B63] mb-1.5">Teléfono o WhatsApp donde te podamos llamar *</label>
                <input 
                  type="tel" 
                  id="onb-telefono" 
                  value="${state.onboardingData.telefono}" 
                  required 
                  placeholder="Ej. 300 123 4567" 
                  class="form-input-accessible"
                >
              </div>

              <div>
                <label for="onb-ciudad" class="block text-base font-bold text-[#052B63] mb-1.5">Ciudad y barrio o zona donde vives *</label>
                <input 
                  type="text" 
                  id="onb-ciudad" 
                  value="${state.onboardingData.ciudad}" 
                  required 
                  placeholder="Ej. Bogotá - Suba" 
                  class="form-input-accessible"
                >
              </div>

              <div class="pt-4 flex justify-end">
                <button type="button" id="btn-to-step-2" class="btn-primary w-full sm:w-auto">
                  <span>Continuar al Paso 2</span>
                  <i data-lucide="arrow-right" class="w-5 h-5"></i>
                </button>
              </div>
            </div>

            <!-- PASO 2: OFICIO Y EXPERIENCIA -->
            <div id="step-2-fields" class="${currentStep === 2 ? 'block' : 'hidden'} space-y-5">
              <div>
                <h3 class="text-xl font-bold text-[#052B63]">Paso 2: ¿Cuál es tu oficio o saber?</h3>
                <p class="text-xs text-gray-500 mt-1">Cuéntanos sobre tu especialidad y tus años en la labor.</p>
              </div>

              <div>
                <label for="onb-categoria" class="block text-base font-bold text-[#052B63] mb-1.5">Categoría que mejor describe lo que haces *</label>
                <select id="onb-categoria" required class="form-input-accessible">
                  ${CATEGORIES_DATA.map(c => `
                    <option value="${c.name}">${c.name}</option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label for="onb-oficio" class="block text-base font-bold text-[#052B63] mb-1.5">Tu título u oficio exacto *</label>
                <input 
                  type="text" 
                  id="onb-oficio" 
                  value="${state.onboardingData.oficio}" 
                  required 
                  placeholder="Ej. Maestro ebanista, Modista, Contador público..." 
                  class="form-input-accessible"
                >
              </div>

              <div>
                <label for="onb-anios" class="block text-base font-bold text-[#052B63] mb-1.5">¿Aproximadamente cuántos años llevas haciendo este trabajo? *</label>
                <input 
                  type="number" 
                  id="onb-anios" 
                  value="${state.onboardingData.aniosExperiencia}" 
                  required 
                  min="5" 
                  max="65" 
                  placeholder="Ej. 25" 
                  class="form-input-accessible"
                >
              </div>

              <div class="pt-4 flex justify-between gap-3">
                <button type="button" id="btn-back-to-1" class="btn-secondary">
                  <i data-lucide="arrow-left" class="w-5 h-5"></i>
                  <span>Atrás</span>
                </button>
                <button type="button" id="btn-to-step-3" class="btn-primary">
                  <span>Continuar al Paso 3</span>
                  <i data-lucide="arrow-right" class="w-5 h-5"></i>
                </button>
              </div>
            </div>

            <!-- PASO 3: SERVICIOS Y FOTOGRAFÍAS -->
            <div id="step-3-fields" class="${currentStep === 3 ? 'block' : 'hidden'} space-y-5">
              <div>
                <h3 class="text-xl font-bold text-[#052B63]">Paso 3: Servicios y fotos de tu trabajo</h3>
                <p class="text-xs text-gray-500 mt-1">A los clientes les genera mucha confianza ver fotos reales de lo que has hecho.</p>
              </div>

              <div>
                <label for="onb-desc" class="block text-base font-bold text-[#052B63] mb-1.5">¿Qué servicios o trabajos haces principalmente? *</label>
                <textarea 
                  id="onb-desc" 
                  rows="3" 
                  required 
                  placeholder="Ej. Hago comedores en cedro, restauro marcos antiguos y arreglo puertas descolgadas..." 
                  class="form-input-accessible h-auto py-3"
                >${state.onboardingData.descripcion}</textarea>
              </div>

              <div>
                <label class="block text-base font-bold text-[#052B63] mb-1.5">¿Tienes fotografías de trabajos previos?</label>
                <div class="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center space-y-2 bg-[#F6F8FB]">
                  <i data-lucide="camera" class="w-8 h-8 text-[#0A63CE] mx-auto"></i>
                  <p class="text-sm font-semibold text-gray-700">Puedes tomar una foto con tu teléfono o seleccionarla de tu galería</p>
                  <p class="text-xs text-gray-500">Si no las tienes a la mano, no te preocupes: te ayudaremos a tomarlas después.</p>
                  <label class="btn-secondary text-xs py-2 px-4 inline-flex cursor-pointer mt-2" style="min-height: 42px;">
                    <i data-lucide="upload" class="w-4 h-4"></i>
                    <span>Cargar foto de muestra</span>
                    <input type="file" id="onb-file-input" accept="image/*" class="hidden">
                  </label>
                  <div id="file-feedback" class="text-xs text-[#0A63CE] font-bold mt-2"></div>
                </div>
              </div>

              <div>
                <label class="block text-base font-bold text-[#052B63] mb-1.5">¿Cómo prefieres atender? *</label>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <label class="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="modalidad" value="presencial" checked class="w-4 h-4 text-[#0A63CE]">
                    <span>En persona / Taller</span>
                  </label>
                  <label class="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="modalidad" value="virtual" class="w-4 h-4 text-[#0A63CE]">
                    <span>Por videollamada</span>
                  </label>
                  <label class="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="modalidad" value="ambas" class="w-4 h-4 text-[#0A63CE]">
                    <span>Ambas opciones</span>
                  </label>
                </div>
              </div>

              <div class="pt-4 flex justify-between gap-3">
                <button type="button" id="btn-back-to-2" class="btn-secondary">
                  <i data-lucide="arrow-left" class="w-5 h-5"></i>
                  <span>Atrás</span>
                </button>
                <button type="submit" class="btn-accent">
                  <i data-lucide="check" class="w-5 h-5"></i>
                  <span>Enviar mi postulación</span>
                </button>
              </div>
            </div>

          </form>

          <!-- PANTALLA FINAL DE CONFIRMACIÓN -->
          <div id="onboarding-success" class="hidden text-center space-y-4 py-6">
            <div class="w-16 h-16 rounded-full bg-[#EAF4FF] text-[#0A63CE] flex items-center justify-center mx-auto">
              <i data-lucide="check-circle" class="w-10 h-10"></i>
            </div>
            <h3 class="text-2xl font-black text-[#052B63]">¡Muchas gracias por postularte!</h3>
            <p class="text-base text-gray-700 max-w-md mx-auto leading-relaxed">
              Hemos recibido tu información. En un plazo máximo de 48 horas te llamaremos por teléfono para validar tus datos, ayudarte con las fotos y construir juntos tu ficha profesional.
            </p>
            <div class="p-4 bg-[#F6F8FB] rounded-xl border border-gray-200 text-xs text-gray-600 max-w-md mx-auto">
              <p><strong>Recuerda:</strong> En Oficios que Valen no cobramos por registrarte. Solo ganamos cuando tú ganas y recibes clientes.</p>
            </div>
            <div class="pt-4">
              <a href="#inicio" class="btn-primary">Volver al Inicio</a>
            </div>
          </div>

        </div>
      </div>
    </section>
  `;

  // Controladores de pasos
  const form = document.getElementById('onboarding-form');
  const step1 = document.getElementById('step-1-fields');
  const step2 = document.getElementById('step-2-fields');
  const step3 = document.getElementById('step-3-fields');
  const successBox = document.getElementById('onboarding-success');

  const btnTo2 = document.getElementById('btn-to-step-2');
  const btnBackTo1 = document.getElementById('btn-back-to-1');
  const btnTo3 = document.getElementById('btn-to-step-3');
  const btnBackTo2 = document.getElementById('btn-back-to-2');
  const fileInput = document.getElementById('onb-file-input');
  const fileFeedback = document.getElementById('file-feedback');

  if (btnTo2) {
    btnTo2.addEventListener('click', () => {
      const nom = document.getElementById('onb-nombre').value.trim();
      const tel = document.getElementById('onb-telefono').value.trim();
      const ciu = document.getElementById('onb-ciudad').value.trim();
      if (!nom || !tel || !ciu) {
        alert('Por favor completa tu nombre, teléfono y ciudad para continuar.');
        return;
      }
      state.onboardingData.nombre = nom;
      state.onboardingData.telefono = tel;
      state.onboardingData.ciudad = ciu;
      state.onboardingStep = 2;
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      if (window.lucide) window.lucide.createIcons();
    });
  }

  if (btnBackTo1) {
    btnBackTo1.addEventListener('click', () => {
      state.onboardingStep = 1;
      step2.classList.add('hidden');
      step1.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons();
    });
  }

  if (btnTo3) {
    btnTo3.addEventListener('click', () => {
      const ofi = document.getElementById('onb-oficio').value.trim();
      const ani = document.getElementById('onb-anios').value.trim();
      if (!ofi || !ani) {
        alert('Por favor indica tu oficio y los años aproximados de experiencia.');
        return;
      }
      state.onboardingData.oficio = ofi;
      state.onboardingData.aniosExperiencia = ani;
      state.onboardingStep = 3;
      step2.classList.add('hidden');
      step3.classList.remove('hidden');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      if (window.lucide) window.lucide.createIcons();
    });
  }

  if (btnBackTo2) {
    btnBackTo2.addEventListener('click', () => {
      state.onboardingStep = 2;
      step3.classList.add('hidden');
      step2.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons();
    });
  }

  if (fileInput && fileFeedback) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        fileFeedback.textContent = `✓ Archivo adjuntado: ${e.target.files[0].name}`;
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const desc = document.getElementById('onb-desc').value.trim();
      state.onboardingData.descripcion = desc;
      state.onboardingData.id = 'APP-' + Date.now();
      state.onboardingData.fecha = new Date().toLocaleString();
      state.onboardingData.estado = 'Pendiente de llamada de validación';

      state.specialistApplications.unshift({ ...state.onboardingData });
      persistData();

      form.classList.add('hidden');
      successBox.classList.remove('hidden');

      // Actualizar contador en header
      const counter = document.getElementById('header-leads-counter');
      if (counter) {
        counter.textContent = state.leads.length + state.b2bRequests.length + state.specialistApplications.length;
      }

      if (window.lucide) window.lucide.createIcons();
    });
  }
}

// -----------------------------------------------------------------------------
// VISTA 7: CÓMO FUNCIONA (CONFORME A SECCIÓN 7 Y 8)
// -----------------------------------------------------------------------------
function renderComoFunciona(container) {
  container.innerHTML = `
    <div class="bg-[#F6F8FB] py-12 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-[#052B63]">Cómo Funciona la Plataforma</h1>
        <p class="text-base text-[#667085] mt-2 max-w-3xl">
          Conocimiento claro, seguridad para el cliente y acompañamiento permanente para los especialistas.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      <!-- FLUJO B2C: PARA CLIENTES -->
      <section class="space-y-8">
        <div class="border-l-4 border-[#0A63CE] pl-4">
          <span class="text-xs font-bold text-[#0A63CE] uppercase tracking-wider">Línea B2C</span>
          <h2 class="text-2xl font-bold text-[#052B63]">Si necesitas un servicio o aprender algo</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          ${[
            { step: '1', title: 'Explora o busca', desc: 'Filtra por oficio, modalidad o zona de atención. Revisa fotos reales de trabajos terminados.' },
            { step: '2', title: 'Inicia el contacto', desc: 'Haz clic en "Solicitar servicio" o WhatsApp. Registramos tu interés para proteger la atención.' },
            { step: '3', title: 'Coordina detalles', desc: 'Acuerda con el especialista fecha, alcance de la labor y presupuesto sin sorpresas.' },
            { step: '4', title: 'Servicio con respaldo', desc: 'Recibes un trabajo hecho con paciencia, criterio y el respaldo de la comunidad.' }
          ].map(s => `
            <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <span class="w-8 h-8 rounded-full bg-[#EAF4FF] text-[#0A63CE] font-bold text-sm flex items-center justify-center">
                ${s.step}
              </span>
              <h3 class="text-lg font-bold text-[#052B63]">${s.title}</h3>
              <p class="text-sm text-gray-600 leading-relaxed">${s.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- FLUJO ESPECIALISTA: PARA PERSONAS MAYORES -->
      <section class="space-y-8">
        <div class="border-l-4 border-[#129BFF] pl-4">
          <span class="text-xs font-bold text-[#129BFF] uppercase tracking-wider">Línea Especialistas</span>
          <h2 class="text-2xl font-bold text-[#052B63]">Si quieres ofrecer tu conocimiento y oficio</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          ${[
            { step: '1', title: 'Postulación simple', desc: 'Llena el formulario corto o contáctanos por WhatsApp. No necesitas saber de tecnología.' },
            { step: '2', title: 'Validación humana', desc: 'Un miembro del equipo habla contigo, valida tu experiencia y te ayuda con las fotos.' },
            { step: '3', title: 'Construcción de ficha', desc: 'Armamos tu portafolio digital profesional resaltando tus mejores trabajos y logros.' },
            { step: '4', title: 'Nuevas oportunidades', desc: 'Comienzas a recibir solicitudes de clientes y empresas con acompañamiento en el cobro.' }
          ].map(s => `
            <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <span class="w-8 h-8 rounded-full bg-[#052B63] text-white font-bold text-sm flex items-center justify-center">
                ${s.step}
              </span>
              <h3 class="text-lg font-bold text-[#052B63]">${s.title}</h3>
              <p class="text-sm text-gray-600 leading-relaxed">${s.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- SEGURIDAD Y PREVENCIÓN DE ESTAFAS (SECCIÓN 8) -->
      <section class="bg-[#EAF4FF] p-8 sm:p-12 rounded-3xl border border-[#B2D7FF] space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-white text-[#052B63] flex items-center justify-center shadow">
            <i data-lucide="shield-alert" class="w-6 h-6 text-[#0A63CE]"></i>
          </div>
          <div>
            <h3 class="text-2xl font-bold text-[#052B63]">Seguridad, Privacidad y Prevención</h3>
            <p class="text-sm text-gray-600">Normas claras para cuidar a clientes y especialistas</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div class="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
            <h4 class="font-bold text-[#052B63] text-sm">Privacidad de datos</h4>
            <p class="text-xs text-gray-600 leading-relaxed">
              No publicamos teléfonos personales sin autorización previa. Todas las solicitudes iniciales se canalizan a través de enlaces trazables.
            </p>
          </div>
          <div class="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
            <h4 class="font-bold text-[#052B63] text-sm">Transparencia en cobros</h4>
            <p class="text-xs text-gray-600 leading-relaxed">
              La plataforma no cobra dinero por adelantado en fase MVP. Los pagos y acuerdos se coordinan bajo presupuesto claro acordado entre las partes.
            </p>
          </div>
          <div class="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
            <h4 class="font-bold text-[#052B63] text-sm">Mecanismo de mediación</h4>
            <p class="text-xs text-gray-600 leading-relaxed">
              Contamos con una línea directa de reporte para mediar ante cualquier retraso o inconformidad en el servicio pactado.
            </p>
          </div>
        </div>
      </section>

    </div>
  `;
}

// -----------------------------------------------------------------------------
// VISTA 8: CONTACTO
// -----------------------------------------------------------------------------
function renderContacto(container) {
  container.innerHTML = `
    <div class="bg-[#F6F8FB] py-12 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-[#052B63]">Contacto y Línea de Ayuda</h1>
        <p class="text-base text-[#667085] mt-2 max-w-2xl">
          Estamos aquí para resolver preguntas, acompañarte en tu registro o gestionar requerimientos corporativos.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div class="lg:col-span-5 space-y-8">
          <div class="space-y-4">
            <h2 class="text-2xl font-bold text-[#052B63]">Canales Oficiales</h2>
            <p class="text-sm text-gray-600 leading-relaxed">
              Creemos en la atención humana y cercana. Si tienes alguna duda o eres una persona mayor que desea soporte, comunícate con nosotros:
            </p>
          </div>

          <div class="space-y-4">
            <div class="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-200">
              <div class="w-12 h-12 rounded-xl bg-[#EAF4FF] text-[#128C7E] flex items-center justify-center shrink-0">
                <i data-lucide="message-circle" class="w-6 h-6"></i>
              </div>
              <div>
                <h4 class="font-bold text-[#052B63]">WhatsApp de Asistencia</h4>
                <p class="text-sm text-gray-600">+57 300 999 8888</p>
                <a href="https://wa.me/573009998888" target="_blank" class="text-xs font-bold text-[#0A63CE] hover:underline mt-1 inline-block">
                  Abrir conversación →
                </a>
              </div>
            </div>

            <div class="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-200">
              <div class="w-12 h-12 rounded-xl bg-[#EAF4FF] text-[#0A63CE] flex items-center justify-center shrink-0">
                <i data-lucide="mail" class="w-6 h-6"></i>
              </div>
              <div>
                <h4 class="font-bold text-[#052B63]">Correo Institucional</h4>
                <p class="text-sm text-gray-600">contacto@oficiosquevalen.com</p>
                <p class="text-xs text-gray-400 mt-0.5">Respuesta en menos de 24 horas</p>
              </div>
            </div>

            <div class="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-200">
              <div class="w-12 h-12 rounded-xl bg-[#EAF4FF] text-[#052B63] flex items-center justify-center shrink-0">
                <i data-lucide="map-pin" class="w-6 h-6"></i>
              </div>
              <div>
                <h4 class="font-bold text-[#052B63]">Sede Principal</h4>
                <p class="text-sm text-gray-600">Bogotá, Colombia</p>
                <p class="text-xs text-gray-400 mt-0.5">Atención presencial previa cita</p>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-7">
          <div class="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-lg space-y-6">
            <h3 class="text-2xl font-bold text-[#052B63]">Envíanos un mensaje</h3>
            <form id="general-contact-form" class="space-y-4">
              <div>
                <label for="cont-nombre" class="block text-sm font-bold text-[#052B63] mb-1">Tu nombre completo *</label>
                <input type="text" id="cont-nombre" required placeholder="Ej. Mariana Duque" class="form-input-accessible">
              </div>
              <div>
                <label for="cont-correo" class="block text-sm font-bold text-[#052B63] mb-1">Correo electrónico o teléfono *</label>
                <input type="text" id="cont-correo" required placeholder="mariana@correo.com o 310 000 0000" class="form-input-accessible">
              </div>
              <div>
                <label for="cont-asunto" class="block text-sm font-bold text-[#052B63] mb-1">Motivo de contacto *</label>
                <select id="cont-asunto" required class="form-input-accessible">
                  <option value="Consulta sobre un especialista">Consulta sobre un especialista</option>
                  <option value="Quiero postularme como especialista">Quiero postularme como especialista</option>
                  <option value="Propuesta para empresas B2B">Propuesta para empresas B2B</option>
                  <option value="Reportar una incidencia">Reportar una incidencia</option>
                  <option value="Otro motivo">Otro motivo</option>
                </select>
              </div>
              <div>
                <label for="cont-mensaje" class="block text-sm font-bold text-[#052B63] mb-1">¿En qué podemos ayudarte? *</label>
                <textarea id="cont-mensaje" rows="4" required placeholder="Escribe tu mensaje con confianza..." class="form-input-accessible h-auto py-3"></textarea>
              </div>
              <button type="submit" class="btn-primary w-full">
                <span>Enviar Mensaje</span>
                <i data-lucide="send" class="w-5 h-5"></i>
              </button>
            </form>

            <div id="contact-success" class="hidden p-4 rounded-xl bg-green-50 text-green-800 text-sm font-semibold text-center border border-green-200">
              ¡Mensaje enviado correctamente! Nos pondremos en contacto contigo lo más pronto posible.
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  const contactForm = document.getElementById('general-contact-form');
  const contactSuccess = document.getElementById('contact-success');
  if (contactForm && contactSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.classList.add('hidden');
      contactSuccess.classList.remove('hidden');
    });
  }
}

// -----------------------------------------------------------------------------
// VISTA 9: PANEL DE ADMINISTRACIÓN / LEADS CAPTURADOS (MVP RECOMENDADO - 10)
// -----------------------------------------------------------------------------
function renderAdminPanel(container) {
  container.innerHTML = `
    <div class="bg-[#052B63] text-white py-10 border-b border-[#0A63CE]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span class="badge-b2b text-xs mb-1">ADMINISTRACIÓN DEMOSTRATIVA</span>
          <h1 class="text-3xl font-extrabold text-white">Panel de Solicitudes y Leads</h1>
          <p class="text-sm text-white/80 mt-1">
            Demuestra cómo el MVP registra y estructura las consultas B2C, solicitudes B2B y postulaciones.
          </p>
        </div>
        <button id="admin-clear-btn" class="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white hover:text-red-600 text-xs py-2 px-3">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
          <span>Limpiar datos de prueba</span>
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <!-- 1. SOLICITUDES B2C / WHATSAPP -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 class="text-lg font-bold text-[#052B63]">1. Solicitudes B2C (Consultas a Especialistas)</h3>
            <p class="text-xs text-gray-500">Contactos iniciados desde perfiles para abrir WhatsApp oficial.</p>
          </div>
          <span class="badge-verified font-bold">${state.leads.length} registros</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-100 text-gray-600 uppercase font-bold">
              <tr>
                <th class="p-3.5">Fecha</th>
                <th class="p-3.5">Especialista Consultado</th>
                <th class="p-3.5">Servicio</th>
                <th class="p-3.5">Cliente</th>
                <th class="p-3.5">Teléfono</th>
                <th class="p-3.5">Mensaje</th>
                <th class="p-3.5">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 text-gray-700">
              ${state.leads.length > 0 ? state.leads.map(l => `
                <tr>
                  <td class="p-3.5 text-gray-500 whitespace-nowrap">${l.fecha}</td>
                  <td class="p-3.5 font-bold text-[#052B63]">${l.especialistaNombre}</td>
                  <td class="p-3.5">${l.servicio}</td>
                  <td class="p-3.5 font-medium">${l.clienteNombre}</td>
                  <td class="p-3.5">${l.clienteTelefono}</td>
                  <td class="p-3.5 max-w-xs truncate" title="${l.mensaje}">${l.mensaje}</td>
                  <td class="p-3.5"><span class="px-2 py-0.5 rounded bg-green-100 text-green-800 font-semibold">${l.estado}</span></td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="7" class="p-6 text-center text-gray-400">No hay consultas B2C registradas aún. Abre el perfil de un especialista y haz clic en "Contactar".</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 2. SOLICITUDES CORPORATIVAS B2B -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 class="text-lg font-bold text-[#052B63]">2. Solicitudes B2B (Empresas)</h3>
            <p class="text-xs text-gray-500">Requerimientos de capacitación, consultoría y talento sénior.</p>
          </div>
          <span class="badge-b2b text-xs">${state.b2bRequests.length} solicitudes</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-100 text-gray-600 uppercase font-bold">
              <tr>
                <th class="p-3.5">ID / Fecha</th>
                <th class="p-3.5">Empresa</th>
                <th class="p-3.5">Contacto</th>
                <th class="p-3.5">Servicio</th>
                <th class="p-3.5">Modalidad</th>
                <th class="p-3.5">Descripción</th>
                <th class="p-3.5">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 text-gray-700">
              ${state.b2bRequests.length > 0 ? state.b2bRequests.map(b => `
                <tr>
                  <td class="p-3.5 text-gray-500 whitespace-nowrap">${b.fechaRegistro}</td>
                  <td class="p-3.5 font-bold text-[#052B63]">${b.empresa}</td>
                  <td class="p-3.5">${b.contacto}<br><span class="text-gray-400 text-[10px]">${b.correo} | ${b.telefono}</span></td>
                  <td class="p-3.5 font-medium">${b.servicio}</td>
                  <td class="p-3.5">${b.modalidad}</td>
                  <td class="p-3.5 max-w-xs truncate" title="${b.descripcion}">${b.descripcion}</td>
                  <td class="p-3.5"><span class="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">${b.estado}</span></td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="7" class="p-6 text-center text-gray-400">No hay solicitudes B2B aún. Completa el formulario en la sección Empresas.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3. POSTULACIONES DE NUEVOS ESPECIALISTAS -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 class="text-lg font-bold text-[#052B63]">3. Postulaciones de Nuevos Especialistas (50-75 años)</h3>
            <p class="text-xs text-gray-500">Personas mayores que han solicitado unirse a la plataforma.</p>
          </div>
          <span class="badge-verified font-bold">${state.specialistApplications.length} postulaciones</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-100 text-gray-600 uppercase font-bold">
              <tr>
                <th class="p-3.5">Fecha</th>
                <th class="p-3.5">Nombre</th>
                <th class="p-3.5">Oficio / Especialidad</th>
                <th class="p-3.5">Años Exp.</th>
                <th class="p-3.5">Ubicación</th>
                <th class="p-3.5">Teléfono</th>
                <th class="p-3.5">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 text-gray-700">
              ${state.specialistApplications.length > 0 ? state.specialistApplications.map(a => `
                <tr>
                  <td class="p-3.5 text-gray-500 whitespace-nowrap">${a.fecha}</td>
                  <td class="p-3.5 font-bold text-[#052B63]">${a.nombre}</td>
                  <td class="p-3.5 font-medium">${a.oficio}</td>
                  <td class="p-3.5">${a.aniosExperiencia} años</td>
                  <td class="p-3.5">${a.ciudad}</td>
                  <td class="p-3.5 font-semibold text-[#0A63CE]">${a.telefono}</td>
                  <td class="p-3.5"><span class="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 font-semibold">${a.estado}</span></td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="7" class="p-6 text-center text-gray-400">No hay postulaciones aún. Completa el flujo en "Quiero ofrecer mi experiencia".</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  const clearBtn = document.getElementById('admin-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('¿Deseas reiniciar los registros de prueba almacenados localmente?')) {
        state.leads = [];
        state.b2bRequests = [];
        state.specialistApplications = [];
        persistData();
        renderAdminPanel(container);
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }
}

// -----------------------------------------------------------------------------
// MODAL DE CONTACTO Y TRAZABILIDAD WHATSAPP (CONFORME A 5.5)
// -----------------------------------------------------------------------------
window.openContactModal = function(specialistId, specialistName, serviceName) {
  const modal = document.getElementById('contact-modal');
  if (!modal) return;

  const sp = SPECIALISTS_DATA.find(s => s.id === specialistId);
  const targetSpecialistName = sp ? sp.name : specialistName;
  const targetService = serviceName || (sp ? sp.services[0].name : 'Consulta de servicio');

  document.getElementById('modal-sp-name').textContent = targetSpecialistName;
  document.getElementById('modal-service-name').textContent = targetService;
  document.getElementById('modal-target-sp-id').value = specialistId;
  document.getElementById('modal-target-sp-name').value = targetSpecialistName;
  document.getElementById('modal-target-service').value = targetService;

  // Mensaje precargado oficial según especificación de página 5:
  // "Hola, vi el perfil de [NOMBRE DEL ESPECIALISTA] en Oficios que Valen y quisiera consultar por [SERVICIO]."
  const preloadedMsg = `Hola, vi el perfil de ${targetSpecialistName} en Oficios que Valen y quisiera consultar por ${targetService}.`;
  document.getElementById('modal-custom-msg').value = preloadedMsg;

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};

window.closeContactModal = function() {
  const modal = document.getElementById('contact-modal');
  if (modal) modal.classList.add('hidden');
};

// -----------------------------------------------------------------------------
// LIGHTBOX PARA GALERÍA DE PORTAFOLIO (CONFORME A 5.4)
// -----------------------------------------------------------------------------
window.openLightbox = function(index) {
  if (!state.currentSpecialist || !state.currentSpecialist.portfolio) return;
  state.lightbox.images = state.currentSpecialist.portfolio;
  state.lightbox.currentIndex = index;

  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;

  updateLightboxContent();
  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};

window.closeLightbox = function() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) modal.classList.add('hidden');
};

window.nextLightbox = function() {
  if (state.lightbox.currentIndex < state.lightbox.images.length - 1) {
    state.lightbox.currentIndex++;
  } else {
    state.lightbox.currentIndex = 0;
  }
  updateLightboxContent();
};

window.prevLightbox = function() {
  if (state.lightbox.currentIndex > 0) {
    state.lightbox.currentIndex--;
  } else {
    state.lightbox.currentIndex = state.lightbox.images.length - 1;
  }
  updateLightboxContent();
};

function updateLightboxContent() {
  const item = state.lightbox.images[state.lightbox.currentIndex];
  if (!item) return;

  const img = document.getElementById('lightbox-img');
  const title = document.getElementById('lightbox-title');
  const desc = document.getElementById('lightbox-desc');
  const counter = document.getElementById('lightbox-counter');

  if (img) img.src = item.image;
  if (title) title.textContent = item.title;
  if (desc) desc.textContent = item.description;
  if (counter) counter.textContent = `${state.lightbox.currentIndex + 1} de ${state.lightbox.images.length}`;
}

// Inicialización de listeners globales (modales, etc.)
function initGlobalEventListeners() {
  // Manejo de formulario del modal de contacto WhatsApp
  const leadForm = document.getElementById('lead-capture-form');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const spId = document.getElementById('modal-target-sp-id').value;
      const spName = document.getElementById('modal-target-sp-name').value;
      const service = document.getElementById('modal-target-service').value;
      const clienteNombre = document.getElementById('modal-client-name').value.trim();
      const clienteTelefono = document.getElementById('modal-client-phone').value.trim();
      const mensaje = document.getElementById('modal-custom-msg').value.trim();

      // Guardar lead para trazabilidad
      const lead = {
        id: 'LEAD-' + Date.now(),
        fecha: new Date().toLocaleString(),
        especialistaId: spId,
        especialistaNombre: spName,
        servicio: service,
        clienteNombre,
        clienteTelefono,
        mensaje,
        estado: 'Contacto WhatsApp Iniciado'
      };

      state.leads.unshift(lead);
      persistData();

      // Cerrar modal
      window.closeContactModal();

      // Actualizar contador del header
      const counter = document.getElementById('header-leads-counter');
      if (counter) {
        counter.textContent = state.leads.length + state.b2bRequests.length + state.specialistApplications.length;
      }

      // Enlace oficial de WhatsApp con mensaje precargado
      // Número institucional o del especialista autorizado
      const sp = SPECIALISTS_DATA.find(s => s.id === spId);
      const phone = (sp && sp.whatsappNumber) ? sp.whatsappNumber.replace('+', '') : '573009998888';
      const encodedMsg = encodeURIComponent(mensaje);
      const waUrl = `https://wa.me/${phone}?text=${encodedMsg}`;

      // Abrir WhatsApp en nueva pestaña
      window.open(waUrl, '_blank');
    });
  }

  // Teclado para lightbox (Escape, ArrowLeft, ArrowRight)
  window.addEventListener('keydown', (e) => {
    const lightboxModal = document.getElementById('lightbox-modal');
    if (lightboxModal && !lightboxModal.classList.contains('hidden')) {
      if (e.key === 'Escape') window.closeLightbox();
      if (e.key === 'ArrowRight') window.nextLightbox();
      if (e.key === 'ArrowLeft') window.prevLightbox();
    }
    const contactModal = document.getElementById('contact-modal');
    if (contactModal && !contactModal.classList.contains('hidden')) {
      if (e.key === 'Escape') window.closeContactModal();
    }
  });
}
