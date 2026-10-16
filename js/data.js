/**
 * OFICIOS QUE VALEN - Modelo de Datos y Contenidos de Ejemplo Demostrativo
 * Estructura modular preparada para conexión a CMS / API / Base de Datos
 */

const CATEGORIES_DATA = [
  {
    id: 'carpinteria-madera',
    slug: 'carpinteria-madera',
    name: 'Carpintería y madera',
    icon: 'hammer',
    shortDesc: 'Fabricación, restauración y ebanistería tradicional a medida.',
    description: 'Maestros artesanos y carpinteros con décadas dominando maderas finas, ensambles, muebles a medida y reparaciones estructurales.',
    image: 'assets/images/ebanista-madera.png',
    order: 1,
    serviceCount: 4,
    tags: ['Ebanistería', 'Muebles a medida', 'Restauración', 'Puertas y ventanas']
  },
  {
    id: 'costura-confeccion',
    slug: 'costura-confeccion',
    name: 'Costura y confección',
    icon: 'scissors',
    shortDesc: 'Alta costura, patronaje, arreglos y confección de piezas exclusivas.',
    description: 'Especialistas con maestría en patronaje, sastrería, confección de cortinas, vestidos de gala y reparación de prendas finas.',
    image: 'assets/images/modista-alta-costura.png',
    order: 2,
    serviceCount: 5,
    tags: ['Sastrería', 'Ajustes finos', 'Tapicería ligera', 'Patronaje']
  },
  {
    id: 'reparacion-mantenimiento',
    slug: 'reparacion-mantenimiento',
    name: 'Reparación y mantenimiento',
    icon: 'wrench',
    shortDesc: 'Diagnóstico técnico de electrodomésticos, plomería y electricidad segura.',
    description: 'Técnicos certificados con amplia experiencia resolviendo averías de hogar y comercio con precisión, honestidad y garantía.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    order: 3,
    serviceCount: 6,
    tags: ['Electricidad', 'Electrodomésticos', 'Plomería', 'Cerrajería']
  },
  {
    id: 'restauracion',
    slug: 'restauracion',
    name: 'Restauración',
    icon: 'sparkles',
    shortDesc: 'Recuperación de piezas antiguas, antigüedades y reliquias familiares.',
    description: 'Conservadores y restauradores con técnicas minuciosas para devolver el esplendor a muebles de época, marcos y objetos históricos.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    order: 4,
    serviceCount: 3,
    tags: ['Muebles de época', 'Pátinas', 'Barniz tradicional', 'Objetos de arte']
  },
  {
    id: 'clases-tutorias',
    slug: 'clases-tutorias',
    name: 'Clases y tutorías',
    icon: 'graduation-cap',
    shortDesc: 'Docencia con pedagogía probada en ciencias, idiomas, artes y música.',
    description: 'Docentes y catedráticos con décadas en aulas escolares y universitarias que enseñan con paciencia, claridad y método comprobado.',
    image: 'assets/images/profesora-matematicas.png',
    order: 5,
    serviceCount: 7,
    tags: ['Matemáticas y física', 'Inglés y francés', 'Lectura y escritura', 'Música']
  },
  {
    id: 'capacitacion',
    slug: 'capacitacion',
    name: 'Capacitación',
    icon: 'users',
    shortDesc: 'Talleres prácticos, formación de oficios y competencias laborales.',
    description: 'Formadores técnicos experimentados para transmitir habilidades prácticas directamente aplicables al trabajo o a la vida.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    order: 6,
    serviceCount: 4,
    tags: ['Talleres de oficios', 'Seguridad laboral', 'Técnicas culinarias', 'Atención']
  },
  {
    id: 'mentoria-asesoria',
    slug: 'mentoria-asesoria',
    name: 'Mentoría y asesoría',
    icon: 'compass',
    shortDesc: 'Guía estratégica individual y para líderes de proyectos emergentes.',
    description: 'Líderes que han dirigido áreas clave guiando a emprendedores, profesionales jóvenes y directivos en la toma de decisiones.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    order: 7,
    serviceCount: 5,
    tags: ['Liderazgo', 'Negocios', 'Mentoría ejecutiva', 'Transición laboral']
  },
  {
    id: 'administracion-gestion',
    slug: 'administracion-gestion',
    name: 'Administración y gestión',
    icon: 'briefcase',
    shortDesc: 'Orden administrativo, estructuración de procesos y control operativo.',
    description: 'Especialistas que dominan la organización documental, compras, contratos y dirección operativa para pymes y particulares.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    order: 8,
    serviceCount: 4,
    tags: ['Organización pyme', 'Contratación', 'Sistemas de archivo', 'Gestión general']
  },
  {
    id: 'contabilidad-finanzas',
    slug: 'contabilidad-finanzas',
    name: 'Contabilidad y finanzas',
    icon: 'calculator',
    shortDesc: 'Declaraciones tributarias, estados financieros, nómina y costos.',
    description: 'Contadores públicos y auditores con solidez técnica en tributación peruana, presupuestos y auditoría preventiva.',
    image: 'assets/images/contador-finanzas.png',
    order: 9,
    serviceCount: 6,
    tags: ['Impuestos y SUNAT', 'Costos y presupuestos', 'Auditoría', 'Planillas']
  },
  {
    id: 'gestion-proyectos',
    slug: 'gestion-proyectos',
    name: 'Gestión de proyectos',
    icon: 'clipboard-list',
    shortDesc: 'Planificación rigurosa, presupuestación y control de hitos de entrega.',
    description: 'Directores de proyectos experimentados en metodologías ágiles y tradicionales con enfoque en cumplimiento y reducción de riesgos.',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    order: 10,
    serviceCount: 3,
    tags: ['PMI', 'Presupuestos de obra', 'Monitoreo de hitos', 'Mitigación de riesgos']
  },
  {
    id: 'operaciones-procesos',
    slug: 'operaciones-procesos',
    name: 'Operaciones y procesos',
    icon: 'trending-up',
    shortDesc: 'Optimización de plantas, logística, inventarios y calidad.',
    description: 'Ingenieros y jefes de planta veteranos que identifican cuellos de botella y aumentan la eficiencia con métodos comprobados.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    order: 11,
    serviceCount: 5,
    tags: ['Control de calidad', 'Logística e inventarios', 'Lean', 'Plantas']
  }
];

const SPECIALISTS_DATA = [
  {
    id: 'roberto-mendez',
    slug: 'roberto-mendez-ebanista',
    name: 'Don Roberto Méndez',
    title: 'Maestro Ebanista & Restaurador de Maderas Nobles',
    category: 'carpinteria-madera',
    categoryName: 'Carpintería y madera',
    yearsExperience: 34,
    location: 'Pueblo Libre, Lima (taller y atención a domicilio)',
    zoneCoverage: 'Pueblo Libre, Jesús María, Magdalena, San Miguel y otros distritos de Lima previa coordinación',
    modality: 'Presencial / En taller y a domicilio',
    modalityType: 'presencial',
    isVerified: true,
    badgeText: 'Perfil Verificado por Oficios que Valen',
    avatar: 'assets/images/ebanista-madera.png',
    actionPhoto: 'assets/images/ebanista-madera.png',
    shortSummary: '34 años dedicados a la carpintería arquitectónica, ensambles tradicionales sin clavos a la vista y rescate de mobiliario en cedro y roble.',
    aboutMe: 'Inicié en el oficio en 1990 en el taller de mi familia, perfeccionando técnicas de ensamble tradicional, torno y tallado a mano. A lo largo de tres décadas he construido comedores, bibliotecas integrales y restaurado piezas históricas que siguen intactas hoy. Para mí la madera es un material vivo; cada trabajo que entrego debe estar hecho para durar al menos dos generaciones.',
    services: [
      {
        name: 'Fabricación de mobiliario a medida',
        desc: 'Comedores, bibliotecas, consolas y muebles de baño en maderas macizas seleccionadas.'
      },
      {
        name: 'Restauración y ajuste de puertas y marcos',
        desc: 'Cepillado de precisión, cambio de bisagras de forja y nivelación milimétrica.'
      },
      {
        name: 'Tratamiento y sellado de maderas antiguas',
        desc: 'Retiro de barnices químicos, lijado al grano fino y aplicación de ceras naturales o gomalaca.'
      }
    ],
    trajectory: [
      'Maestro ebanista en taller artesanal de Lima (1995-2012), coordinando proyectos residenciales de alto detalle.',
      'Ebanista independiente con más de 450 piezas construidas a medida y entregadas a satisfacción.',
      'Capacitador voluntario de jóvenes aprendices en técnicas de ensamble con cola animal y caja y espiga.'
    ],
    certificaciones: [
      'Técnico en Carpintería y Ebanistería, formación técnica especializada (1992)',
      'Certificación en Manejo Seguro de Maquinaria y Conservación Forestal'
    ],
    disponibilidad: 'Lunes a Viernes de 8:00 a.m. a 5:00 p.m. Sábados de 8:00 a.m. a 1:00 p.m.',
    whatsappNumber: '',
    isB2BReady: false,
    portfolio: [
      {
        id: 'p1',
        title: 'Biblioteca modular en Roble Macizo',
        description: 'Estructura de 3.20m de altura con escalera corrediza sobre riel de bronce y ensambles ocultos.',
        image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=900&q=80',
        workType: 'Fabricación a medida'
      },
      {
        id: 'p2',
        title: 'Comedor rústico en Cedro con acabados en cera de abejas',
        description: 'Mesa para 10 puestos construida a partir de tablones recuperados, sin tornillos visibles.',
        image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=900&q=80',
        workType: 'Mobiliario artesanal'
      },
      {
        id: 'p3',
        title: 'Restauración de puerta colonial de doble batiente',
        description: 'Recuperación de estructura afectada por humedad, reemplazo de tableros y sellado mate.',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
        workType: 'Restauración'
      }
    ]
  },
  {
    id: 'elena-valenzuela',
    slug: 'elena-valenzuela-confeccion',
    name: 'Elena Valenzuela',
    title: 'Modista de Alta Confección & Patronista Textil',
    category: 'costura-confeccion',
    categoryName: 'Costura y confección',
    yearsExperience: 29,
    location: 'Jesús María, Lima (atelier propio y atención con cita)',
    zoneCoverage: 'Jesús María, Pueblo Libre, Lince, Magdalena, San Miguel y Lima Metropolitana previa coordinación',
    modality: 'Presencial y Asesoría Virtual de Medidas',
    modalityType: 'hibrido',
    isVerified: true,
    badgeText: 'Perfil Verificado por Oficios que Valen',
    avatar: 'assets/images/modista-alta-costura.png',
    actionPhoto: 'assets/images/modista-alta-costura.png',
    shortSummary: '29 años en sastrería femenina y masculina, diseño de prendas a la medida y transformación de ropa con corte anatómico impecable.',
    aboutMe: 'Aprendí a coser antes de terminar la secundaria y convertí el patronaje en mi pasión de vida. He confeccionado desde trajes de sastrería ejecutiva hasta vestidos de novia y ajustes complejos en telas delicadas como seda y lino. Mi propósito es que cada prenda calce con exactitud y comodidad, realzando la presencia de quien la viste.',
    services: [
      {
        name: 'Sastrería y trajes a la medida',
        desc: 'Toma de medidas anatómicas, pruebas intermedias y terminados a mano en solapas y dobladillos.'
      },
      {
        name: 'Ajustes estructurales de alta precisión',
        desc: 'Reducción de hombros, entalle de sacos, transformación de prendas vintage y cambio de forros.'
      },
      {
        name: 'Confección de mantelería fina y cortinajes',
        desc: 'Cálculo de caídas, pespuntes invisibles y materiales resistentes al sol.'
      }
    ],
    trajectory: [
      'Jefa de corte y patronaje en taller de confección de Gamarra, Lima (1998-2010).',
      'Atelier independiente con más de 1,200 clientes satisfechos a lo largo de 15 años.',
      'Tutora invitada en talleres de costura comunitaria para mujeres cabeza de hogar.'
    ],
    certificaciones: [
      'Diplomado en Patronaje Industrial y Escalamiento Femenino (1996)',
      'Certificado en Manejo de Telas Pesadas y Forros de Seda'
    ],
    disponibilidad: 'Martes a Sábado con cita previa de 9:00 a.m. a 6:00 p.m.',
    whatsappNumber: '',
    isB2BReady: false,
    portfolio: [
      {
        id: 'p4',
        title: 'Traje de dos piezas en paño inglés',
        description: 'Confección artesanal con solapa de pico y forro en contraste para evento formal.',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80',
        workType: 'Sastrería a medida'
      },
      {
        id: 'p5',
        title: 'Vestido de gala en crepé de seda con drapeado',
        description: 'Patronaje sobre maniquí con ajuste exacto y cierre invisible reforzado.',
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80',
        workType: 'Alta costura'
      },
      {
        id: 'p6',
        title: 'Renovación de abrigo clásico de lana virgen',
        description: 'Desmontaje completo, cambio de entretela, ajuste de tiro y nuevo forro de satín.',
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80',
        workType: 'Restauración textil'
      }
    ]
  },
  {
    id: 'carlos-restrepo',
    slug: 'carlos-alberto-restrepo-finanzas',
    name: 'Carlos Alberto Restrepo',
    title: 'Contador Público Colegiado & Asesor Financiero Pyme',
    category: 'contabilidad-finanzas',
    categoryName: 'Contabilidad y finanzas',
    yearsExperience: 32,
    location: 'San Isidro, Lima (atención presencial y virtual a nivel nacional)',
    zoneCoverage: 'Lima Metropolitana y asesoría virtual para empresas y profesionales de todo el Perú',
    modality: 'Híbrida (Virtual nacional y Presencial en empresas)',
    modalityType: 'hibrido',
    isVerified: true,
    badgeText: 'Perfil Verificado por Oficios que Valen',
    avatar: 'assets/images/contador-finanzas.png',
    actionPhoto: 'assets/images/contador-finanzas.png',
    shortSummary: '32 años ordenando las finanzas y la tributación de pymes y profesionales independientes, evitando sanciones y blindando el flujo de caja.',
    aboutMe: 'He ejercido como contador general, director de finanzas y revisor fiscal en compañías comerciales y manufactureras. Conozco a profundidad las exigencias de la SUNAT y las dificultades reales que afronta una empresa pequeña o mediana. Mi enfoque no es simplemente entregar cifras históricas, sino explicar con claridad qué significan para tomar decisiones financieras saludables.',
    services: [
      {
        name: 'Diagnóstico contable y saneamiento tributario',
        desc: 'Revisión exhaustiva de declaraciones pasadas, conciliaciones bancarias y plan de regularización.'
      },
      {
        name: 'Planeación fiscal para personas naturales y pymes',
        desc: 'Estructuración legal de costos y deducciones para pagar lo justo sin riesgos de requerimientos.'
      },
      {
        name: 'Estructuración de flujos de caja y presupuestos',
        desc: 'Modelos sencillos en hoja de cálculo adaptados al día a día del dueño de negocio.'
      }
    ],
    trajectory: [
      'Auditor y contador principal en empresas comerciales del sector alimentos e importaciones (2004-2021).',
      'Director administrativo y financiero en empresa textil peruana (1993-2003).',
      'Consultor independiente para más de 70 pequeñas empresas en adopción de NIIF y control de costos.'
    ],
    certificaciones: [
      'Contador Público Colegiado con habilitación profesional vigente',
      'Especialista en Gerencia Tributaria y Normas Internacionales NIIF'
    ],
    disponibilidad: 'Lunes a Viernes de 8:00 a.m. a 6:00 p.m.',
    whatsappNumber: '',
    isB2BReady: true,
    b2bHeadline: 'Auditoría financiera, planeamiento tributario y reestructuración de costos para empresas en crecimiento.',
    b2bSectors: ['Comercio mayorista', 'Servicios profesionales', 'Manufactura ligera', 'Pymes familiares'],
    portfolio: [
      {
        id: 'p7',
        title: 'Plan de saneamiento contable para empresa de logística',
        description: 'Conciliación de 3 periodos fiscales acumulados y regularización de obligaciones y revisión de saldos ante SUNAT.',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80',
        workType: 'Consultoría tributaria'
      },
      {
        id: 'p8',
        title: 'Modelo financiero de costos de producción en panificadora',
        description: 'Identificación de margen por línea de producto, reduciendo un 14% de desperdicio oculto.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
        workType: 'Estructuración de costos'
      }
    ]
  },
  {
    id: 'martha-gomez',
    slug: 'martha-cecilia-gomez-restauracion',
    name: 'Doña Martha Cecilia Gómez',
    title: 'Restauradora de Bienes Muebles, Porcelana & Objetos de Época',
    category: 'restauracion',
    categoryName: 'Restauración',
    yearsExperience: 26,
    location: 'Barranco, Lima (taller con atención previa cita)',
    zoneCoverage: 'Barranco, Miraflores, Surco, San Isidro y otros distritos de Lima previa coordinación',
    modality: 'Presencial / Recepción en taller',
    modalityType: 'presencial',
    isVerified: true,
    badgeText: 'Perfil Verificado por Oficios que Valen',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    actionPhoto: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
    shortSummary: '26 años conservando el patrimonio familiar: marcos dorados a la hoja, figuras sacras, porcelana y relojes de péndulo.',
    aboutMe: 'Entiendo el valor emocional que tiene un objeto heredado de los abuelos. Mi técnica se basa en el principio de mínima intervención y máxima reversibilidad: no reemplazamos el alma de la pieza, la consolidamos con materiales compatibles con su época de origen.',
    services: [
      {
        name: 'Dorado al agua y a la sisa en marcos antiguos',
        desc: 'Reconstrucción de molduras en estuco de yeso tradicional y fijación de hojilla.'
      },
      {
        name: 'Restauración de porcelanas y mayólicas',
        desc: 'Unión limpia de fracturas con resinas de conservación y reintegración cromática casi invisible.'
      },
      {
        name: 'Mantenimiento preventivo de tallas de madera',
        desc: 'Desinfección contra xilófagos (comején), consolidación de soporte y acabado cera microcristalina.'
      }
    ],
    trajectory: [
      'Auxiliar de restauración en talleres y anticuarios del Centro Histórico de Lima (1997-2005).',
      'Restauradora titular en Taller San Cristóbal durante 18 años.',
      'Más de 800 objetos históricos y reliquias familiares restauradas.'
    ],
    certificaciones: [
      'Estudios en Conservación del Patrimonio Mueble y Técnicas Tradicionales de Dorado',
      'Seminario Internacional de Técnicas de Limpieza Química no Invasiva'
    ],
    disponibilidad: 'Lunes a Viernes de 9:30 a.m. a 4:30 p.m.',
    whatsappNumber: '',
    isB2BReady: false,
    portfolio: [
      {
        id: 'p9',
        title: 'Restauración de espejo barroco francés',
        description: 'Reconstrucción de 4 rosetas faltantes con pasta de madera y dorado con pan de oro fino.',
        image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=900&q=80',
        workType: 'Dorado y tallado'
      },
      {
        id: 'p10',
        title: 'Reintegración de jarrón de porcelana de mediados del siglo XX',
        description: 'Ensamblaje de 7 fragmentos, relleno de faltantes y acabado brillo vidriado.',
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=80',
        workType: 'Cerámica y porcelana'
      }
    ]
  },
  {
    id: 'maria-elena-torres',
    slug: 'maria-elena-torres-matematicas',
    name: 'Prof. María Elena Torres',
    title: 'Profesora & Tutora de Matemáticas, Álgebra y Cálculo',
    category: 'clases-tutorias',
    categoryName: 'Clases y tutorías',
    yearsExperience: 35,
    location: 'Pueblo Libre, Lima (atención presencial y virtual)',
    zoneCoverage: 'Pueblo Libre y distritos cercanos; clases virtuales para estudiantes de todo el Perú',
    modality: 'Virtual y presencial en Lima',
    modalityType: 'hibrido',
    isVerified: true,
    badgeText: 'Perfil Verificado por Oficios que Valen',
    avatar: 'assets/images/profesora-matematicas.png',
    actionPhoto: 'assets/images/profesora-matematicas.png',
    shortSummary: '35 años enseñando matemáticas con paciencia y método, desde secundaria hasta los primeros ciclos universitarios.',
    aboutMe: 'Fui profesora de matemáticas durante más de tres décadas durante más de tres décadas. La clave para aprender matemáticas no es memorizar fórmulas mecánicamente, sino entender los conceptos detrás de ellas y conectarlos con la realidad cotidiana. Utilizo pizarra digital interactiva, resolución paso a paso y paciencia absoluta.',
    services: [
      {
        name: 'Tutorías personalizadas de Cálculo Diferencial e Integral',
        desc: 'Preparación para parciales universitarios y resolución de talleres complejos.'
      },
      {
        name: 'Nivelación en Álgebra y Geometría para Bachillerato',
        desc: 'Refuerzo de bases sólidas para estudiantes con vacíos de conceptos escolares.'
      },
      {
        name: 'Física Mecánica y Termodinámica Aplicada',
        desc: 'Análisis de vectores, leyes de Newton y resolución guiada de problemas reales.'
      }
    ],
    trajectory: [
      'Docente de matemáticas y ciencias básicas en instituciones educativas de Lima durante más de tres décadas.',
      'Autor de 3 guías pedagógicas de ejercicios resueltos de cálculo diferencial.',
      'Miles de estudiantes acompañados en nivelación escolar, preparación universitaria y cursos de ciencias básicas.'
    ],
    certificaciones: [
      'Licenciada en Educación con especialidad en Matemática',
      'Magíster en Docencia de las Ciencias Exactas'
    ],
    disponibilidad: 'Lunes a Sábado de 7:00 a.m. a 8:00 p.m. con reserva de horas',
    whatsappNumber: '',
    isB2BReady: true,
    b2bHeadline: 'Capacitación en pensamiento analítico, análisis cuantitativo y lógica para equipos operativos.',
    b2bSectors: ['Educación técnica', 'Equipos de análisis de datos inicial', 'Entrenamiento a instructores'],
    portfolio: [
      {
        id: 'p11',
        title: 'Guías de cálculo visual explicadas paso a paso',
        description: 'Muestra de metodología pedagógica interactiva con diagramas vectoriales para estudiantes.',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80',
        workType: 'Metodología pedagógica'
      },
      {
        id: 'p12',
        title: 'Sesiones de preparación para evaluaciones y admisión universitaria',
        description: 'Estrategias de resolución y razonamiento cuantitativo para estudiantes de secundaria y postulantes universitarios.',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
        workType: 'Entrenamiento intensivo'
      }
    ]
  },
  {
    id: 'gloria-salazar',
    slug: 'gloria-patricia-salazar-operaciones',
    name: 'Gloria Patricia Salazar',
    title: 'Consultora en Gestión de Operaciones & Mejora Continua',
    category: 'operaciones-procesos',
    categoryName: 'Operaciones y procesos',
    yearsExperience: 31,
    location: 'Lima / Callao (presencial y remoto para empresas)',
    zoneCoverage: 'Proyectos empresariales en Lima, Callao y otras regiones del Perú según alcance',
    modality: 'Híbrida para empresas y asesorías virtuales',
    modalityType: 'hibrido',
    isVerified: true,
    badgeText: 'Perfil Verificado por Oficios que Valen',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
    actionPhoto: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80',
    shortSummary: '31 años de liderazgo en optimización de plantas industriales, bodegas, control de inventarios y simplificación de procesos.',
    aboutMe: 'Lideré gerencias de operaciones en el sector de alimentos y plásticos. Conozco la brecha que suele haber entre lo que la directiva diseña en papel y lo que el operario vive en el piso de la planta. Mi labor es conectar a ambos niveles, eliminar tiempos muertos y diseñar manuales de proceso que la gente realmente entienda y aplique.',
    services: [
      {
        name: 'Mapeo y rediseño de procesos productivos (VSM)',
        desc: 'Detección de desperdicios, cuellos de botella y balanceo de líneas de trabajo.'
      },
      {
        name: 'Auditoría y optimización de bodegas e inventarios',
        desc: 'Organización física, clasificación ABC, control de rotación y reducción de mermas.'
      },
      {
        name: 'Acompañamiento a jefes de turno y supervisores jóvenes',
        desc: 'Mentoría práctica en liderazgo de piso, resolución de conflictos y cumplimiento de KPIs.'
      }
    ],
    trajectory: [
      'Gerente de operaciones y planta en empresa manufacturera nacional (2001-2019).',
      'Jefa de control de calidad y procesos en empresa del sector alimentos (1993-2001).',
      'Asesora de más de 30 empresas medianas en implementación de metodologías 5S y Kaizen.'
    ],
    certificaciones: [
      'Ingeniera Industrial con honores',
      'Especialista en Logística Integral y Supply Chain',
      'Certificación Black Belt Six Sigma (1999)'
    ],
    disponibilidad: 'Lunes a Viernes para proyectos corporativos y consultorías por horas.',
    whatsappNumber: '',
    isB2BReady: true,
    b2bHeadline: 'Diagnóstico de operaciones, reducción de mermas y mentoría a supervisores de producción.',
    b2bSectors: ['Manufactura', 'Alimentos y Bebidas', 'Distribución y Bodegaje', 'Empaques'],
    portfolio: [
      {
        id: 'p13',
        title: 'Reorganización de Centro de Distribución de 2,400 m²',
        description: 'Reducción del tiempo de alistamiento de pedidos (picking) en un 28% y cero descuadres de inventario.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
        workType: 'Optimización logística'
      },
      {
        id: 'p14',
        title: 'Implementación del programa 5S en taller de ensamble',
        description: 'Capacitación a 45 operarios, estandarización de áreas visuales y mejora en seguridad laboral.',
        image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=80',
        workType: 'Cultura de calidad'
      }
    ]
  },
  {
    id: 'hernando-quintero',
    slug: 'hernando-quintero-mantenimiento',
    name: 'Hernando Quintero',
    title: 'Técnico Especialista en Mantenimiento Eléctrico & Motores',
    category: 'reparacion-mantenimiento',
    categoryName: 'Reparación y mantenimiento',
    yearsExperience: 33,
    location: 'Ate, Lima (cobertura en Lima Metropolitana y zonas industriales)',
    zoneCoverage: 'Ate, Santa Anita, La Victoria, Callao y otras zonas de Lima previa coordinación',
    modality: 'Presencial con taller móvil propio',
    modalityType: 'presencial',
    isVerified: true,
    badgeText: 'Perfil Verificado por Oficios que Valen',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    actionPhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
    shortSummary: '33 años resolviendo fallas complejas en tableros eléctricos residenciales e industriales, plantas de emergencia y motobombas.',
    aboutMe: 'La electricidad exige respeto, conocimiento de la norma y herramientas calibradas. Mi trabajo se enfoca en resolver el origen real de la falla, no en hacer arreglos provisionales. Cada reparación que hago incluye medición con pinza amperimétrica y garantía total de seguridad para la familia o el negocio.',
    services: [
      {
        name: 'Mantenimiento y bobinado de bombas y motores eléctricos',
        desc: 'Cambio de rodamientos, sellos mecánicos y diagnóstico de aislamiento de devanados.'
      },
      {
        name: 'Actualización y balanceo de tableros de distribución',
        desc: 'Reemplazo de breakers antiguos, instalación de barras de tierra y corrección de sobrecargas.'
      },
      {
        name: 'Diagnóstico de fugas de corriente y aumentos anormales en factura',
        desc: 'Rastreo con instrumentación especializada para aislar circuitos defectuosos.'
      }
    ],
    trajectory: [
      'Técnico jefe de mantenimiento eléctrico en planta industrial de Lima (1991-2015).',
      'Más de 900 diagnósticos residenciales e industriales exitosos con cero incidentes de seguridad.',
      'Proveedor de confianza para administraciones de conjuntos cerrados y pequeñas panificadoras.'
    ],
    certificaciones: [
      'Técnico electricista con formación especializada en instalaciones y mantenimiento industrial',
      'Capacitación en seguridad eléctrica, bloqueo y etiquetado de equipos industriales'
    ],
    disponibilidad: 'Lunes a Sábado de 7:30 a.m. a 6:00 p.m. Servicio de urgencias programadas.',
    whatsappNumber: '',
    isB2BReady: true,
    b2bHeadline: 'Planes preventivos de mantenimiento eléctrico, subestaciones y motores para pymes.',
    b2bSectors: ['Talleres mecánicos', 'Conjuntos residenciales', 'Plantas de alimentos', 'Lavanderías'],
    portfolio: [
      {
        id: 'p15',
        title: 'Mantenimiento general de banco de motobombas en edificio de 14 pisos',
        description: 'Reacondicionamiento de impulsores, cambio de sellos y alineación láser de acoples.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80',
        workType: 'Mantenimiento electromecánico'
      },
      {
        id: 'p16',
        title: 'Modernización total de tablero principal de 24 circuitos',
        description: 'Peinado de cables, rotulado normativo y balanceo de cargas por fase.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
        workType: 'Instalaciones eléctricas'
      }
    ]
  }
];

const B2B_SERVICES_DATA = [
  {
    id: 'b2b-capacitaciones',
    title: 'Capacitaciones corporativas prácticas',
    icon: 'graduation-cap',
    shortDesc: 'Talleres diseñados por personas que han ejecutado el trabajo real durante décadas.',
    description: 'Programas de formación técnica y habilidades operativas impartidos por especialistas sénior. Menos teoría abstracta y más criterio práctico aplicable al puesto de trabajo desde el primer día.',
    deliverables: ['Talleres presenciales o híbridos', 'Manuales operativos ilustrados', 'Evaluación de habilidades aplicadas'],
    targetAudience: 'Equipos técnicos, aprendices, operarios y personal de atención directa.'
  },
  {
    id: 'b2b-mentoria',
    title: 'Mentoría para líderes y mandos medios',
    icon: 'compass',
    shortDesc: 'Acompañamiento uno a uno de exdirectivos para nuevos líderes y jefes de área.',
    description: 'Los nuevos líderes enfrentan desafíos humanos, de negociación y manejo de equipos que los libros no enseñan. Nuestros mentores sénior aportan templanza, visión panorámica y escucha empática.',
    deliverables: ['Sesiones quincenales de mentoría', 'Planes de desarrollo de liderazgo', 'Apoyo en situaciones críticas'],
    targetAudience: 'Jefes primerizos, supervisores de área, directores de proyecto y fundadores.'
  },
  {
    id: 'b2b-asesoria',
    title: 'Asesoría especializada por horas o proyectos',
    icon: 'briefcase',
    shortDesc: 'Resuelve problemas puntuales sin comprometer nóminas fijas de consultoría.',
    description: 'Accede al conocimiento de expertos en contabilidad, normatividad, operaciones, compras y mantenimiento industrial para resolver desafíos específicos de manera ágil.',
    deliverables: ['Diagnóstico inicial en 72 horas', 'Plan de acción ejecutable', 'Acompañamiento en implementación'],
    targetAudience: 'Pymes en expansión, gerencias generales y comités de auditoría.'
  },
  {
    id: 'b2b-transferencia',
    title: 'Transferencia y salvaguarda de conocimiento',
    icon: 'repeat',
    shortDesc: 'Evita que el conocimiento crítico de la empresa se pierda cuando el personal rota.',
    description: 'Estructuración de procesos de documentación viva y mentoría cruzada generacional para asegurar que las mejores prácticas queden institucionalizadas en la organización.',
    deliverables: ['Mapeo de conocimiento crítico', 'Documentación de lecciones aprendidas', 'Programas de relevo generacional'],
    targetAudience: 'Empresas familiares, industrias tradicionales y organizaciones en transición.'
  },
  {
    id: 'b2b-proyectos',
    title: 'Gestión y acompañamiento en proyectos',
    icon: 'clipboard-list',
    shortDesc: 'Supervisión experta con disciplina en plazos, costos y mitigación de riesgos.',
    description: 'Directores de proyectos que han gestionado obras, aperturas e implementaciones tecnológicas velando por el estricto cumplimiento sin desviaciones presupuestarias.',
    deliverables: ['Cronogramas de ruta crítica', 'Monitoreo de hitos de entrega', 'Supervisión de contratistas'],
    targetAudience: 'Empresas constructoras, entidades de servicios e iniciativas de modernización.'
  },
  {
    id: 'b2b-operaciones',
    title: 'Acompañamiento en procesos y operaciones',
    icon: 'trending-up',
    shortDesc: 'Presencia en planta para optimizar flujos, inventarios y reducir mermas.',
    description: 'Especialistas que caminan el piso de trabajo con el equipo, identificando pérdidas invisibles y ajustando la rutina diaria con métodos comprobados de orden y calidad.',
    deliverables: ['Auditoría operativa en sitio', 'Implementación de metodologías 5S', 'Estandarización de puestos'],
    targetAudience: 'Plantas de manufactura, bodegas logísticas y cadenas de restaurantes.'
  }
];

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Encuentra al especialista',
    subtitle: 'Por oficio, conocimiento o necesidad específica',
    desc: 'Explora categorías organizadas o usa el buscador. Revisa la trayectoria, ubicación y fotografías reales de sus trabajos previos.',
    icon: 'search'
  },
  {
    step: '02',
    title: 'Conecta con seguridad',
    subtitle: 'Por WhatsApp oficial o solicitud directa asistida',
    desc: 'Inicia la conversación con un mensaje claro y precargado. La plataforma acompaña el contacto para garantizar transparencia y privacidad.',
    icon: 'message-circle'
  },
  {
    step: '03',
    title: 'Recibe un servicio con experiencia',
    subtitle: 'Calidad, puntualidad y respaldo garantizado',
    desc: 'Coordina fecha y detalles con una persona que domina su especialidad y aporta el criterio que solo los años de oficio pueden dar.',
    icon: 'check-circle'
  }
];

const TRUST_PILLARS = [
  {
    title: 'Perfiles Validados',
    description: 'Revisamos trayectoria, experiencia real y evidencias de trabajo de cada especialista antes de su publicación.',
    icon: 'shield-check'
  },
  {
    title: 'Portafolios con Evidencias',
    description: 'Fotos reales de proyectos, restauraciones, clases y obras entregadas. Sin contenidos falsos.',
    icon: 'image'
  },
  {
    title: 'Contacto Asistido y Seguro',
    description: 'Protegemos los datos personales y canalizamos la comunicación de forma clara y trazable.',
    icon: 'lock'
  },
  {
    title: 'Dignidad y Respaldo Humano',
    description: 'Un equipo disponible para resolver dudas de clientes y acompañar a los especialistas mayores.',
    icon: 'heart-handshake'
  }
];

// Compatibilidad universal para carga directa file:/// y soporte ESM
if (typeof window !== 'undefined') {
  window.OQV_DATA = {
    CATEGORIES_DATA,
    SPECIALISTS_DATA,
    B2B_SERVICES_DATA,
    HOW_IT_WORKS_STEPS,
    TRUST_PILLARS
  };
}
