/**
 * KIRMA — Tecnología que renace.
 * Inventario estructurado de equipos corporativos remanufacturados.
 * Todos los datos reflejan especificaciones reales y comprobables de fabricantes empresariales.
 */

export const INVENTORY = [
  {
    id: "KIRMA-024",
    tag: "KIRMA / 024",
    marca: "Dell",
    modelo: "Latitude 5420",
    categoria: "Portátil Corporativo",
    linea: "Latitude 5000 Series (Empresarial)",
    procesador: "Intel Core i5-1135G7",
    procesador_detalle: "4 núcleos, 8 hilos, 2.40 GHz hasta 4.20 GHz Turbo, 8 MB Caché",
    generacion: "11ª Generación",
    ram: "16 GB DDR4",
    ram_gb: 16,
    ram_detalle: "2x 8 GB 3200 MHz en doble canal (ampliable hasta 64 GB)",
    almacenamiento: "512 GB SSD NVMe M.2",
    almacenamiento_gb: 512,
    almacenamiento_detalle: "Unidad de estado sólido PCIe NVMe Clase 35 de alta velocidad",
    pantalla: "14.0\" FHD (1920 x 1080)",
    pantalla_pulgadas: 14.0,
    pantalla_detalle: "Panel Antirreflejo IPS, 250 nits, resolución Full HD 16:9",
    gpu: "Intel Iris Xe Graphics",
    sistema_operativo: "Windows 11 Pro 64 bits (Licencia digital OEM vinculada a placa)",
    estado: "Remanufacturado",
    condicion_estetica: {
      grado: "Grado A-",
      resumen: "Muy buen estado físico general con mínimos signos normales de uso anterior.",
      detalles: "Chasis firme de policarbonato reforzado con fibra de carbono. Tapa exterior con marcas superficiales leves por fricción en maletín corporativo. Teclado en español sin brillo de desgaste y touchpad con respuesta precisa. Pantalla limpia sin manchas, raspaduras ni píxeles defectuosos.",
      marcas_visibles: [
        "Fricción superficial leve en esquina derecha de la cubierta exterior",
        "Base inferior con ligeras marcas de apoyo en escritorio"
      ]
    },
    particularidades: "Teclado resistente a salpicaduras, cámara web HD con tapa física de privacidad Dell Privacy Shutter comprobada.",
    bateria: {
      salud: "88% de capacidad de diseño original",
      porcentaje: 88,
      estado_general: "Batería original de 4 celdas (63 Wh) con retención de carga estable.",
      observacion: "Verificada con prueba de diagnóstico BatteryReport de Windows. Al ser un equipo remanufacturado, no se promete una cantidad arbitraria de horas; el consumo depende de las aplicaciones en ejecución."
    },
    cargador: "Cargador Dell original de 65W con conector USB-C y cable de alimentación nacional.",
    cargador_tipo: "Original Dell 65W USB-C",
    incluye: [
      "Portátil corporativo Dell Latitude 5420 remanufacturado",
      "Cargador original Dell 65W USB-C con cable de poder para Colombia",
      "Ficha de entrega física con Kirma Check de inspección firmado",
      "Constancia de garantía por 6 meses conforme a legislación colombiana"
    ],
    garantia: "6 meses de garantía legal conforme a la Ley 1480 de 2011",
    precio_cop: 1890000,
    precio_formato: "$1.890.000 COP",
    disponibilidad: "DISPONIBLE",
    unidades_disponibles: 4,
    ideal_para: [
      "Trabajo remoto y productividad diaria",
      "Estudio universitario y redacción",
      "Oficina contable, administrativa y ERPs",
      "Desarrollo web y programación"
    ],
    perfiles_compatibles: ["trabajar", "estudiar", "oficina", "programar"],
    peso: "1.37 kg",
    material: "Chasis reforzado con fibra de carbono y biomateriales reciclados",
    puertos: [
      "2x Thunderbolt 4 / USB Type-C con DisplayPort y Power Delivery",
      "2x USB 3.2 Gen 1 Tipo A (uno con PowerShare)",
      "1x HDMI 2.0",
      "1x Puerto de red RJ-45 Gigabit Ethernet",
      "1x Conector combinado audio/micrófono 3.5 mm",
      "1x Lector de tarjetas de memoria MicroSD"
    ],
    kirma_check: {
      encendido: { ok: true, etiqueta: "Encendido", nota: "Arranque en frío en 9 segundos y reinicio sin alertas" },
      pantalla: { ok: true, etiqueta: "Pantalla", nota: "Inspección 100% brillo: sin pixeles muertos ni sangrado" },
      teclado: { ok: true, etiqueta: "Teclado", nota: "100% de teclas probadas y operativas con tester de matriz" },
      touchpad: { ok: true, etiqueta: "Touchpad", nota: "Desplazamiento multitáctil y clics mecánicos verificados" },
      puertos: { ok: true, etiqueta: "Puertos", nota: "USB-C, USB-A, HDMI y RJ-45 probados con periféricos reales" },
      conectividad: { ok: true, etiqueta: "Conectividad", nota: "Wi-Fi 6 Intel AX201 y Bluetooth 5.1 con enlace estable" },
      almacenamiento: { ok: true, etiqueta: "Almacenamiento", nota: "Salud SMART del SSD al 97%, sin sectores reasignados" },
      memoria: { ok: true, etiqueta: "Memoria RAM", nota: "Prueba de esfuerzo MemTest completada con 0 errores" },
      cargador: { ok: true, etiqueta: "Cargador", nota: "Voltaje de salida continuo de 20V/3.25A comprobado" },
      bateria: { ok: true, etiqueta: "Batería", nota: "Curva de descarga lineal sin caídas abruptas de voltaje" }
    },
    badge: "RECOMENDADO PRODUCTIVIDAD & OFICINA"
  },
  {
    id: "KIRMA-031",
    tag: "KIRMA / 031",
    marca: "Lenovo",
    modelo: "ThinkPad T490",
    categoria: "Portátil Corporativo",
    linea: "ThinkPad Serie T (Alta durabilidad empresarial)",
    procesador: "Intel Core i7-8665U",
    procesador_detalle: "4 núcleos, 8 hilos, 1.90 GHz hasta 4.80 GHz Turbo, 8 MB Caché con Intel vPro",
    generacion: "8ª Generación",
    ram: "16 GB DDR4",
    ram_gb: 16,
    ram_detalle: "8 GB soldados + 8 GB en módulo SO-DIMM 2666 MHz",
    almacenamiento: "512 GB SSD NVMe M.2",
    almacenamiento_gb: 512,
    almacenamiento_detalle: "Unidad SSD de alta resistencia PCIe 3.0 x4",
    pantalla: "14.0\" FHD (1920 x 1080)",
    pantalla_pulgadas: 14.0,
    pantalla_detalle: "Panel Antirreflejo IPS, 250 nits con excelente contraste de texto",
    gpu: "Intel UHD Graphics 620",
    sistema_operativo: "Windows 11 Pro 64 bits (Licencia digital original vinculada a BIOS)",
    estado: "Remanufacturado",
    condicion_estetica: {
      grado: "Grado A",
      resumen: "Excelente condición estética con acabado mate clásico ThinkPad.",
      detalles: "El reconocido recubrimiento aterciopelado de polímero reforzado de Lenovo se conserva en óptimo estado. Teclado ergonómico legendario ThinkPad con TrackPoint rojo central totalmente calibrado. Bisagras de acero resistentes a 180 grados sin holgura.",
      marcas_visibles: [
        "Mínima marca de brillo en la barra espaciadora por pulsación normal",
        "Pequeño roce casi imperceptible en el contorno del puerto de carga USB-C"
      ]
    },
    particularidades: "Certificación militar MIL-STD-810G contra golpes y temperatura. Sistema de drenaje de líquidos en teclado ThinkPad.",
    bateria: {
      salud: "85% de capacidad de diseño original",
      porcentaje: 85,
      estado_general: "Batería interna de 50 Wh probada en ciclo continuo de trabajo de oficina.",
      observacion: "Comprobada con herramienta Lenovo Vantage y diagnósticos de Windows. Desgaste normal por uso anterior."
    },
    cargador: "Cargador Lenovo original de 65W USB-C con tecnología de carga rápida.",
    cargador_tipo: "Original Lenovo 65W USB-C",
    incluye: [
      "Portátil corporativo Lenovo ThinkPad T490 remanufacturado",
      "Cargador Lenovo original 65W USB-C con cable nacional",
      "Ficha técnica KIRMA con reporte de inspección",
      "Póliza de garantía por 6 meses en Colombia"
    ],
    garantia: "6 meses de garantía legal conforme a la Ley 1480 de 2011",
    precio_cop: 1650000,
    precio_formato: "$1.650.000 COP",
    disponibilidad: "DISPONIBLE",
    unidades_disponibles: 3,
    ideal_para: [
      "Redacción intensiva y trabajo de oficina",
      "Programación de software y administración de servidores",
      "Profesionales independientes y consultoría",
      "Estudiantes de ingeniería y administración"
    ],
    perfiles_compatibles: ["trabajar", "programar", "oficina", "estudiar"],
    peso: "1.46 kg",
    material: "Plástico reforzado con fibra de vidrio (PPS) y bisagras de aleación metálica",
    puertos: [
      "1x USB-C (USB 3.1 Gen 1 con soporte de carga y DisplayPort)",
      "1x Thunderbolt 3 / USB-C de alta transferencia",
      "2x USB 3.1 Gen 1 Tipo A (uno siempre activo)",
      "1x HDMI 1.4b",
      "1x Conector RJ-45 Gigabit nativo con palanca retráctil",
      "1x Lector de tarjetas MicroSD",
      "1x Conector combinado auricular/micrófono 3.5 mm"
    ],
    kirma_check: {
      encendido: { ok: true, etiqueta: "Encendido", nota: "Post de BIOS sin demoras; TPM 2.0 activo para seguridad corporativa" },
      pantalla: { ok: true, etiqueta: "Pantalla", nota: "Sin marcas de teclado en la pantalla, panel uniforme" },
      teclado: { ok: true, etiqueta: "Teclado", nota: "Teclado ergonómico ThinkPad 100% funcional y probado tecla a tecla" },
      touchpad: { ok: true, etiqueta: "Touchpad", nota: "Touchpad + botones físicos dedicados para TrackPoint verificados" },
      puertos: { ok: true, etiqueta: "Puertos", nota: "Doble puerto USB-C y USB-A comprobados con transferencia de datos" },
      conectividad: { ok: true, etiqueta: "Conectividad", nota: "Intel Wireless-AC 9560 y Bluetooth 5.0 funcionando correctamente" },
      almacenamiento: { ok: true, etiqueta: "Almacenamiento", nota: "SSD testeado sin errores de lectura/escritura" },
      memoria: { ok: true, etiqueta: "Memoria RAM", nota: "16 GB reconocidos y testeados en prueba de estrés sintético" },
      cargador: { ok: true, etiqueta: "Cargador", nota: "Cargador Lenovo 65W probado con multímetro y carga estable" },
      bateria: { ok: true, etiqueta: "Batería", nota: "Batería testeada con carga al 100% y descarga controlada" }
    },
    badge: "LEGENDARIO TECLADO & DURABILIDAD"
  },
  {
    id: "KIRMA-042",
    tag: "KIRMA / 042",
    marca: "HP",
    modelo: "EliteBook 840 G6",
    categoria: "Portátil Corporativo",
    linea: "EliteBook 800 Series (Chasis unibody de aluminio)",
    procesador: "Intel Core i5-8365U",
    procesador_detalle: "4 núcleos, 8 hilos, 1.60 GHz hasta 4.10 GHz Turbo, 6 MB Caché Intel vPro",
    generacion: "8ª Generación",
    ram: "16 GB DDR4",
    ram_gb: 16,
    ram_detalle: "2 ranuras accesibles ocupadas con 2x 8 GB 2400 MHz",
    almacenamiento: "256 GB SSD NVMe M.2",
    almacenamiento_gb: 256,
    almacenamiento_detalle: "Unidad PCIe M.2 (opción de ampliación a 512 GB o 1 TB disponible)",
    pantalla: "14.0\" FHD (1920 x 1080)",
    pantalla_pulgadas: 14.0,
    pantalla_detalle: "IPS eDP antirreflejo con bisel ultra estrecho, 250 nits",
    gpu: "Intel UHD Graphics 620",
    sistema_operativo: "Windows 11 Pro 64 bits (Licencia OEM vinculada a placa madre)",
    estado: "Remanufacturado",
    condicion_estetica: {
      grado: "Grado A",
      resumen: "Excelente aspecto profesional en aluminio plateado satinado.",
      detalles: "Estructura unibody de aluminio mecanizado CNC. Muy pocos signos de desgaste externo. Teclado premium retroiluminado HP Collaboration con botones dedicados para llamadas. Excelente acústica y altavoces sintonizados por Bang & Olufsen.",
      marcas_visibles: [
        "Diminuta raspadura de 2 mm en la arista izquierda inferior de la base",
        "Gomas de apoyo de la base limpias y con apoyo nivelado"
      ]
    },
    particularidades: "Cámara HD con obturador de privacidad HP Privacy Camera. Altavoces estéreo Bang & Olufsen frontales.",
    bateria: {
      salud: "89% de capacidad de diseño original",
      porcentaje: 89,
      estado_general: "Batería HP de polímero de 3 celdas (50 Wh) de larga duración.",
      observacion: "Evaluada con software de diagnóstico HP Hardware Diagnostics UEFI. Autonomía real depende de tareas y brillo."
    },
    cargador: "Cargador HP original de 65W punta azul de alta resistencia.",
    cargador_tipo: "Original HP 65W punta azul",
    incluye: [
      "Portátil HP EliteBook 840 G6 remanufacturado",
      "Cargador original HP 65W punta azul con cable nacional",
      "Ficha técnica KIRMA y acta de revisión",
      "Garantía escrita de 6 meses"
    ],
    garantia: "6 meses de garantía legal conforme a la Ley 1480 de 2011",
    precio_cop: 1490000,
    precio_formato: "$1.490.000 COP",
    disponibilidad: "DISPONIBLE",
    unidades_disponibles: 5,
    ideal_para: [
      "Reuniones virtuales y videollamadas corporativas",
      "Trabajo de oficina, contabilidad y navegación comercial",
      "Estudiantes de bachillerato y pregrado",
      "Uso móvil por peso ligero y chasis de aluminio"
    ],
    perfiles_compatibles: ["trabajar", "oficina", "estudiar"],
    peso: "1.48 kg",
    material: "Aluminio anodizado plateado mecanizado CNC de alta resistencia",
    puertos: [
      "1x Thunderbolt (conector USB Type-C)",
      "2x USB 3.1 Gen 1 Tipo A (uno de carga)",
      "1x HDMI 1.4b",
      "1x Conector de acoplamiento lateral HP Docking",
      "1x RJ-45 Ethernet Gigabit",
      "1x Conector combinado estéreo para auriculares/micrófono",
      "1x Conector de alimentación de CA"
    ],
    kirma_check: {
      encendido: { ok: true, etiqueta: "Encendido", nota: "Encendido instantáneo con prueba de hardware HP aprobada" },
      pantalla: { ok: true, etiqueta: "Pantalla", nota: "Panel FHD nítido con colores calibrados" },
      teclado: { ok: true, etiqueta: "Teclado", nota: "Retroiluminación LED y todas las teclas funcionando" },
      touchpad: { ok: true, etiqueta: "Touchpad", nota: "Touchpad de cristal con controladores Windows Precision" },
      puertos: { ok: true, etiqueta: "Puertos", nota: "HDMI, USB-A y USB-C testeados con pantallas y unidades externas" },
      conectividad: { ok: true, etiqueta: "Conectividad", nota: "Intel Dual Band Wireless-AC 9560 y Bluetooth 5 probado" },
      almacenamiento: { ok: true, etiqueta: "Almacenamiento", nota: "SSD de 256 GB con 99% de vida útil según CrystalDisk/SMART" },
      memoria: { ok: true, etiqueta: "Memoria RAM", nota: "16 GB verificados sin fallas de direccionamiento" },
      cargador: { ok: true, etiqueta: "Cargador", nota: "Cargador original HP con cable flexible sin cortes ni fisuras" },
      bateria: { ok: true, etiqueta: "Batería", nota: "Salud del 89% verificada en diagnósticos BIOS HP" }
    },
    badge: "CHASIS DE ALUMINIO & AUDIO BANG & OLUFSEN"
  },
  {
    id: "KIRMA-018",
    tag: "KIRMA / 018",
    marca: "Dell",
    modelo: "Latitude 7400",
    categoria: "Portátil Corporativo Ultraligero",
    linea: "Latitude 7000 Series (Gama alta corporativa)",
    procesador: "Intel Core i7-8665U",
    procesador_detalle: "4 núcleos, 8 hilos, 1.90 GHz hasta 4.80 GHz Turbo, 8 MB Caché",
    generacion: "8ª Generación",
    ram: "16 GB DDR4",
    ram_gb: 16,
    ram_detalle: "2 módulos DDR4 2666 MHz de baja latencia",
    almacenamiento: "512 GB SSD NVMe M.2",
    almacenamiento_gb: 512,
    almacenamiento_detalle: "Unidad sólida ultrarrápida NVMe PCIe 3.0",
    pantalla: "14.0\" FHD (1920 x 1080)",
    pantalla_pulgadas: 14.0,
    pantalla_detalle: "Pantalla Super Low Power de 300 nits, panel IPS mate antideslumbrante",
    gpu: "Intel UHD Graphics 620",
    sistema_operativo: "Windows 11 Pro 64 bits",
    estado: "Remanufacturado",
    condicion_estetica: {
      grado: "Grado A",
      resumen: "Excelente presentación con chasis premium de aluminio cepillado.",
      detalles: "La serie Latitude 7000 se caracteriza por acabados de nivel directivo. Bisagras anodizadas firmes, teclado retroiluminado con tacto suave. Pantalla impecable sin rayones.",
      marcas_visibles: [
        "Leves signos de manipulación en el contorno del conector USB",
        "Tapa superior en estado prácticamente impecable"
      ]
    },
    particularidades: "Sensor de proximidad Dell ExpressSign-in y cámara web infrarroja para Windows Hello.",
    bateria: {
      salud: "87% de capacidad original",
      porcentaje: 87,
      estado_general: "Batería de 60 Wh con tecnología ExpressCharge.",
      observacion: "Rendimiento térmico y de retención verificado. Consumo optimizado por pantalla de bajo consumo."
    },
    cargador: "Cargador Dell original de 65W USB-C.",
    cargador_tipo: "Original Dell 65W USB-C",
    incluye: [
      "Portátil Dell Latitude 7400 remanufacturado",
      "Cargador Dell original 65W USB-C",
      "Ficha técnica con Kirma Check",
      "Documento de póliza de garantía (6 meses)"
    ],
    garantia: "6 meses de garantía legal conforme a la Ley 1480 de 2011",
    precio_cop: 1750000,
    precio_formato: "$1.750.000 COP",
    disponibilidad: "ÚLTIMAS UNIDADES",
    unidades_disponibles: 2,
    ideal_para: [
      "Profesionales que viajan o trabajan en movimiento",
      "Gestión empresarial, presentaciones y consultoría",
      "Productividad de oficina avanzada y análisis de datos en Excel",
      "Trabajadores remotos que valoran pantalla brillante y peso pluma"
    ],
    perfiles_compatibles: ["trabajar", "oficina", "estudiar"],
    peso: "1.35 kg",
    material: "Aluminio cepillado de precisión mecanizado",
    puertos: [
      "1x Thunderbolt 3 con entrega de alimentación y DisplayPort",
      "2x USB 3.1 Gen 1 Tipo A (uno con PowerShare)",
      "1x HDMI 1.4a",
      "1x Lector de tarjetas de memoria uSD 4.0",
      "1x Conector universal para audio"
    ],
    kirma_check: {
      encendido: { ok: true, etiqueta: "Encendido", nota: "Inicio ultra rápido y autenticación por infrarrojos verificada" },
      pantalla: { ok: true, etiqueta: "Pantalla", nota: "Panel 300 nits de alta luminosidad con colores vivos" },
      teclado: { ok: true, etiqueta: "Teclado", nota: "Retroiluminación blanca de 2 niveles totalmente operativa" },
      touchpad: { ok: true, etiqueta: "Touchpad", nota: "Panel multitáctil suave sin marcas de fricción" },
      puertos: { ok: true, etiqueta: "Puertos", nota: "Thunderbolt 3 testeado con transferencias de alta velocidad" },
      conectividad: { ok: true, etiqueta: "Conectividad", nota: "Intel Dual Band Wireless-AC 9560 y Bluetooth 5 probados" },
      almacenamiento: { ok: true, etiqueta: "Almacenamiento", nota: "SSD testeado en lectura secuencial a más de 2000 MB/s" },
      memoria: { ok: true, etiqueta: "Memoria RAM", nota: "16 GB trabajando en canal doble sin anomalías" },
      cargador: { ok: true, etiqueta: "Cargador", nota: "Cargador Dell USB-C certificado por KIRMA" },
      bateria: { ok: true, etiqueta: "Batería", nota: "Salud al 87% con balance de celdas equilibrado" }
    },
    badge: "SERIE 7000 GAMA ALTA EJECUTIVA"
  },
  {
    id: "KIRMA-055",
    tag: "KIRMA / 055",
    marca: "Lenovo",
    modelo: "ThinkPad T14 Gen 1",
    categoria: "Portátil Corporativo de Alto Rendimiento",
    linea: "ThinkPad Serie T (Nueva generación)",
    procesador: "AMD Ryzen 5 PRO 4650U",
    procesador_detalle: "6 núcleos físicos, 12 hilos, 2.10 GHz hasta 4.0 GHz Turbo, 8 MB Caché L3 con seguridad AMD PRO",
    generacion: "Ryzen Serie 4000 PRO",
    ram: "16 GB DDR4",
    ram_gb: 16,
    ram_detalle: "16 GB DDR4 3200 MHz en canal doble (ampliable a 32 GB)",
    almacenamiento: "512 GB SSD NVMe M.2",
    almacenamiento_gb: 512,
    almacenamiento_detalle: "SSD NVMe M.2 PCIe 3.0 x4 de respuesta inmediata",
    pantalla: "14.0\" FHD (1920 x 1080)",
    pantalla_pulgadas: 14.0,
    pantalla_detalle: "IPS Antirreflejo, 250 nits con excelente ángulo de visión de 178°",
    gpu: "AMD Radeon Vega 6 Graphics (Excelente para multitarea pesada y diseño 2D)",
    sistema_operativo: "Windows 11 Pro 64 bits",
    estado: "Remanufacturado",
    condicion_estetica: {
      grado: "Grado A",
      resumen: "Aspecto corporativo sobrio casi idéntico al nuevo.",
      detalles: "Chasis probado en 12 métodos de certificación militar. Tapa en fibra híbrida sin rayaduras profundas. Teclado en español con textura mate perfecta. Bisagras sólidas.",
      marcas_visibles: [
        "Micromarca superficial de 1 cm en la esquina posterior del chasis inferior"
      ]
    },
    particularidades: "Potente procesador de 6 núcleos / 12 hilos ideal para compilación de código y máquinas virtuales.",
    bateria: {
      salud: "91% de capacidad de diseño original",
      porcentaje: 91,
      estado_general: "Batería de 50 Wh con retención de carga óptima comprobada.",
      observacion: "Excelente eficiencia energética gracias a la arquitectura AMD Renoir de 7 nanómetros."
    },
    cargador: "Cargador Lenovo original de 65W USB-C con enchufe colombiano.",
    cargador_tipo: "Original Lenovo 65W USB-C",
    incluye: [
      "Portátil corporativo Lenovo ThinkPad T14 Gen 1 remanufacturado",
      "Cargador Lenovo 65W original USB-C",
      "Ficha técnica KIRMA y comprobante Kirma Check",
      "Póliza de garantía por 6 meses"
    ],
    garantia: "6 meses de garantía legal conforme a la Ley 1480 de 2011",
    precio_cop: 2150000,
    precio_formato: "$2.150.000 COP",
    disponibilidad: "DISPONIBLE",
    unidades_disponibles: 4,
    ideal_para: [
      "Programación pesada, contenedores Docker y desarrollo backend",
      "Análisis de datos, bases de datos locales y cálculos complejos",
      "Diseño gráfico 2D (Photoshop, Illustrator, Figma con múltiples capas)",
      "Profesionales que necesitan 6 núcleos reales para multitarea exigente"
    ],
    perfiles_compatibles: ["programar", "diseño", "alto_rendimiento", "trabajar"],
    peso: "1.46 kg",
    material: "Polímero reforzado con fibra de vidrio y magnesio",
    puertos: [
      "2x USB-C 3.2 Gen 2 (con función DisplayPort 1.4 y Power Delivery)",
      "2x USB 3.2 Gen 1 Tipo A (uno siempre encendido)",
      "1x HDMI 2.0",
      "1x Puerto Ethernet Gigabit RJ-45",
      "1x Lector de tarjetas MicroSD",
      "1x Combo jack auriculares/micrófono 3.5 mm"
    ],
    kirma_check: {
      encendido: { ok: true, etiqueta: "Encendido", nota: "Arranque veloz, BIOS UEFI actualizada y TPM 2.0 activo" },
      pantalla: { ok: true, etiqueta: "Pantalla", nota: "Panel FHD IPS nítido sin parpadeos ni deformaciones cromáticas" },
      teclado: { ok: true, etiqueta: "Teclado", nota: "Teclado ergonómico ThinkPad probado en cada pulsación" },
      touchpad: { ok: true, etiqueta: "Touchpad", nota: "Touchpad y botones TrackPoint verificados con respuesta táctil exacta" },
      puertos: { ok: true, etiqueta: "Puertos", nota: "Todos los puertos probados con salidas de video y discos externos" },
      conectividad: { ok: true, etiqueta: "Conectividad", nota: "Wi-Fi 6 Intel AX200 y Bluetooth 5.1 funcionando con señal alta" },
      almacenamiento: { ok: true, etiqueta: "Almacenamiento", nota: "SSD al 98% de vida útil verificado por SMART" },
      memoria: { ok: true, etiqueta: "Memoria RAM", nota: "16 GB DDR4 3200 MHz superaron prueba de estrés de 2 horas sin fallos" },
      cargador: { ok: true, etiqueta: "Cargador", nota: "Cargador Lenovo 65W entrega potencia estable" },
      bateria: { ok: true, etiqueta: "Batería", nota: "91% de salud comprobada con descarga homogénea" }
    },
    badge: "6 NÚCLEOS / 12 HILOS RYZEN PRO"
  },
  {
    id: "KIRMA-067",
    tag: "KIRMA / 067",
    marca: "Dell",
    modelo: "Latitude 5510",
    categoria: "Portátil Corporativo con Teclado Numérico",
    linea: "Latitude 5000 Series (Pantalla amplia 15.6\")",
    procesador: "Intel Core i5-10310U",
    procesador_detalle: "4 núcleos, 8 hilos, 1.70 GHz hasta 4.40 GHz Turbo, 6 MB Caché vPro",
    generacion: "10ª Generación",
    ram: "16 GB DDR4",
    ram_gb: 16,
    ram_detalle: "2 módulos de 8 GB 2666 MHz (ampliable hasta 32 GB)",
    almacenamiento: "512 GB SSD NVMe M.2",
    almacenamiento_gb: 512,
    almacenamiento_detalle: "SSD M.2 PCIe de alta capacidad",
    pantalla: "15.6\" FHD (1920 x 1080)",
    pantalla_pulgadas: 15.6,
    pantalla_detalle: "Pantalla amplia antirreflejo WVA/IPS de 220 nits con teclado numérico integrado",
    gpu: "Intel UHD Graphics 620",
    sistema_operativo: "Windows 11 Pro 64 bits",
    estado: "Remanufacturado",
    condicion_estetica: {
      grado: "Grado A-",
      resumen: "Buen estado corporativo, chasis robusto de 15 pulgadas.",
      detalles: "Estructura sólida pensada para trabajo pesado de escritorio. Teclado numérico completo ideal para contadores y digitación de planillas. Leve desgaste estético superficial en la carcasa inferior.",
      marcas_visibles: [
        "Marcas leves de roce en esquinas de la base plástica",
        "Tapa superior con micro-marcas superficiales casi invisibles a contraluz"
      ]
    },
    particularidades: "Teclado numérico físico dedicado de 10 teclas incorporado. Gran espacio térmico y ventilación silenciosa.",
    bateria: {
      salud: "84% de capacidad original",
      porcentaje: 84,
      estado_general: "Batería Dell de 4 celdas (68 Wh).",
      observacion: "Capacidad testeada adecuada para trabajo mixto de oficina."
    },
    cargador: "Cargador Dell original de 65W.",
    cargador_tipo: "Original Dell 65W",
    incluye: [
      "Portátil corporativo Dell Latitude 5510 remanufacturado",
      "Cargador original Dell 65W",
      "Ficha KIRMA con reporte de verificación",
      "Constancia de garantía 6 meses"
    ],
    garantia: "6 meses de garantía legal conforme a la Ley 1480 de 2011",
    precio_cop: 1780000,
    precio_formato: "$1.780.000 COP",
    disponibilidad: "DISPONIBLE",
    unidades_disponibles: 3,
    ideal_para: [
      "Contadores públicos y digitadores (teclado numérico independiente)",
      "Gestión de inventarios, facturación electrónica y planillas Excel",
      "Usuarios que prefieren una pantalla amplia de 15.6 pulgadas para evitar fatiga visual",
      "Puestos fijos de trabajo en oficinas y locales comerciales"
    ],
    perfiles_compatibles: ["oficina", "trabajar", "estudiar"],
    peso: "1.82 kg",
    material: "Policarbonato industrial reforzado",
    puertos: [
      "1x USB Type-C 3.2 Gen 2 con Power Delivery y DisplayPort",
      "3x USB 3.2 Gen 1 Tipo A (uno con PowerShare)",
      "1x HDMI 1.4b",
      "1x RJ-45 Gigabit Ethernet",
      "1x Lector de tarjetas MicroSD",
      "1x Jack 3.5 mm audio combo"
    ],
    kirma_check: {
      encendido: { ok: true, etiqueta: "Encendido", nota: "Arranque correcto y BIOS Dell configurada en modo seguro UEFI" },
      pantalla: { ok: true, etiqueta: "Pantalla", nota: "Panel 15.6\" uniforme, sin líneas ni zonas descoloridas" },
      teclado: { ok: true, etiqueta: "Teclado", nota: "Teclado alfanumérico + bloque numérico probado tecla por tecla" },
      touchpad: { ok: true, etiqueta: "Touchpad", nota: "Deslizamiento fluido con botones físicos integrados" },
      puertos: { ok: true, etiqueta: "Puertos", nota: "3 puertos USB-A y USB-C comprobados con carga y datos" },
      conectividad: { ok: true, etiqueta: "Conectividad", nota: "Wi-Fi 6 AX201 y Bluetooth con excelente recepción" },
      almacenamiento: { ok: true, etiqueta: "Almacenamiento", nota: "SSD de 512 GB testeado y formateado con instalación limpia" },
      memoria: { ok: true, etiqueta: "Memoria RAM", nota: "16 GB testeados en carga con cero errores" },
      cargador: { ok: true, etiqueta: "Cargador", nota: "Cargador original Dell testeado con carga activa" },
      bateria: { ok: true, etiqueta: "Batería", nota: "Salud del 84% con descarga uniforme y sin calentamiento" }
    },
    badge: "TECLADO NUMÉRICO INTEGRADO (15.6\")"
  },
  {
    id: "KIRMA-078",
    tag: "KIRMA / 078",
    marca: "HP",
    modelo: "EliteBook 850 G7",
    categoria: "Portátil Corporativo Ejecutivo de 15.6\"",
    linea: "EliteBook 800 Series (Gama alta en aluminio)",
    procesador: "Intel Core i7-10610U",
    procesador_detalle: "4 núcleos, 8 hilos, 1.80 GHz hasta 4.90 GHz Turbo, 8 MB Caché con Intel vPro",
    generacion: "10ª Generación",
    ram: "32 GB DDR4",
    ram_gb: 32,
    ram_detalle: "2 módulos de 16 GB 3200 MHz en doble canal (configuración máxima para trabajo pesado)",
    almacenamiento: "512 GB SSD NVMe M.2",
    almacenamiento_gb: 512,
    almacenamiento_detalle: "SSD PCIe NVMe TLC de alta tasa de transferencia",
    pantalla: "15.6\" FHD (1920 x 1080)",
    pantalla_pulgadas: 15.6,
    pantalla_detalle: "IPS Antirreflejo, 400 nits de alta luminosidad, 72% NTSC para reproducción de color superior",
    gpu: "Intel UHD Graphics para procesadores de 10ª generación",
    sistema_operativo: "Windows 11 Pro 64 bits",
    estado: "Remanufacturado",
    condicion_estetica: {
      grado: "Grado A",
      resumen: "Excelente condición estética ejecutiva en chasis plateado.",
      detalles: "Cuerpo de aluminio cepillado de gran prestancia y rigidez estructural. Teclado retroiluminado HP Premium con teclado numérico lateral. Pantalla de 400 nits con excelente nitidez en exteriores e interiores iluminados.",
      marcas_visibles: [
        "Mínima marca milimétrica en el borde inferior cerca al lector de tarjetas inteligentes",
        "Sin abolladuras ni rayaduras en la cubierta de aluminio"
      ]
    },
    particularidades: "32 GB de memoria RAM instalados y pantalla de 400 nits (mucho más brillante que el estándar de 250 nits). Audio Bang & Olufsen con 4 altavoces.",
    bateria: {
      salud: "92% de capacidad de diseño original",
      porcentaje: 92,
      estado_general: "Batería HP Long Life de 3 celdas (56 Wh) con excelente salud.",
      observacion: "Verificada con el sistema de diagnóstico HP oficial."
    },
    cargador: "Cargador HP original de 65W USB-C de carga rápida.",
    cargador_tipo: "Original HP 65W USB-C",
    incluye: [
      "Portátil HP EliteBook 850 G7 remanufacturado",
      "Cargador HP original 65W USB-C con cable nacional",
      "Ficha KIRMA con reporte técnico de inspección",
      "Póliza de garantía 6 meses"
    ],
    garantia: "6 meses de garantía legal conforme a la Ley 1480 de 2011",
    precio_cop: 2450000,
    precio_formato: "$2.450.000 COP",
    disponibilidad: "DISPONIBLE",
    unidades_disponibles: 2,
    ideal_para: [
      "Uso profesional avanzado y multitarea masiva con 32 GB de RAM",
      "Diseño gráfico 2D, maquetación editorial y edición fotográfica",
      "Finanzas avanzadas, modelado en hojas de cálculo pesadas y ERPs",
      "Desarrolladores que ejecutan múltiples entornos virtuales y bases de datos"
    ],
    perfiles_compatibles: ["alto_rendimiento", "diseño", "programar", "trabajar"],
    peso: "1.75 kg",
    material: "Aluminio plateado de alta densidad",
    puertos: [
      "2x USB Type-C con Thunderbolt 3 (entrega de energía, DisplayPort 1.2)",
      "2x USB 3.1 Gen 1 Tipo A (uno de carga)",
      "1x HDMI 1.4b",
      "1x Conector de audio estéreo 3.5 mm",
      "1x Ranura para cable de seguridad Nano"
    ],
    kirma_check: {
      encendido: { ok: true, etiqueta: "Encendido", nota: "Prueba de encendido y test integral de componentes HP superado" },
      pantalla: { ok: true, etiqueta: "Pantalla", nota: "Panel de 400 nits con brillo y uniformidad de color sobresaliente" },
      teclado: { ok: true, etiqueta: "Teclado", nota: "Teclado completo con retroiluminación comprobado al 100%" },
      touchpad: { ok: true, etiqueta: "Touchpad", nota: "Touchpad de cristal de amplia área probado con precisión milimétrica" },
      puertos: { ok: true, etiqueta: "Puertos", nota: "Doble Thunderbolt 3 y puertos USB probados con discos externos" },
      conectividad: { ok: true, etiqueta: "Conectividad", nota: "Intel Wi-Fi 6 AX201 y Bluetooth 5.0 con alta tasa de transferencia" },
      almacenamiento: { ok: true, etiqueta: "Almacenamiento", nota: "SSD de 512 GB testeado con lectura a 2400 MB/s" },
      memoria: { ok: true, etiqueta: "Memoria RAM", nota: "32 GB DDR4 en canal dual con 0 errores en prueba de carga continua" },
      cargador: { ok: true, etiqueta: "Cargador", nota: "Cargador USB-C HP de 65W probado y certificado" },
      bateria: { ok: true, etiqueta: "Batería", nota: "Salud al 92% con retención de carga estable" }
    },
    badge: "POTENCIA MÁXIMA: 32 GB RAM & 400 NITS"
  },
  {
    id: "KIRMA-089",
    tag: "KIRMA / 089",
    marca: "Lenovo",
    modelo: "ThinkPad X1 Carbon Gen 7",
    categoria: "Ultrabook Corporativo Premium",
    linea: "ThinkPad X1 (Buque insignia corporativo ultraligero)",
    procesador: "Intel Core i7-8565U",
    procesador_detalle: "4 núcleos, 8 hilos, 1.80 GHz hasta 4.60 GHz Turbo, 8 MB Caché",
    generacion: "8ª Generación",
    ram: "16 GB LPDDR3",
    ram_gb: 16,
    ram_detalle: "16 GB 2133 MHz soldados de bajo consumo energético",
    almacenamiento: "512 GB SSD NVMe M.2",
    almacenamiento_gb: 512,
    almacenamiento_detalle: "SSD PCIe NVMe de alto rendimiento",
    pantalla: "14.0\" FHD (1920 x 1080)",
    pantalla_pulgadas: 14.0,
    pantalla_detalle: "Panel IPS Antirreflejo de 400 nits con tecnología Low Power",
    gpu: "Intel UHD Graphics 620",
    sistema_operativo: "Windows 11 Pro 64 bits",
    estado: "Remanufacturado",
    condicion_estetica: {
      grado: "Grado A",
      resumen: "Excelente condición estética. Ultraligero de solo 1.09 kg.",
      detalles: "Construcción en fibra de carbono de cuatro capas y aleación de magnesio. Extremadamente liviano y delgado. Teclado ThinkPad con excelente respuesta. Pantalla de 400 nits impecable.",
      marcas_visibles: [
        "Leves signos de roce sutil en las esquinas del borde posterior",
        "Teclado y reposamuñecas limpios sin marcas de uso intensivo"
      ]
    },
    particularidades: "Peso de solo 1.09 kg. 4 altavoces Dolby Atmos (2 de agudos frontales y 2 de graves inferiores). 4 micrófonos de largo alcance.",
    bateria: {
      salud: "86% de capacidad de diseño original",
      porcentaje: 86,
      estado_general: "Batería de 51 Wh con tecnología Rapid Charge.",
      observacion: "Autonomía sobresaliente gracias al panel de bajo consumo de 400 nits y procesador optimizado."
    },
    cargador: "Cargador Lenovo original de 65W USB-C con enchufe nacional.",
    cargador_tipo: "Original Lenovo 65W USB-C",
    incluye: [
      "Ultrabook corporativo Lenovo ThinkPad X1 Carbon Gen 7 remanufacturado",
      "Cargador Lenovo 65W original USB-C",
      "Ficha técnica KIRMA con reporte de inspección",
      "Póliza de garantía 6 meses"
    ],
    garantia: "6 meses de garantía legal conforme a la Ley 1480 de 2011",
    precio_cop: 2290000,
    precio_formato: "$2.290.000 COP",
    disponibilidad: "ÚLTIMAS UNIDADES",
    unidades_disponibles: 1,
    ideal_para: [
      "Ejecutivos, directores y profesionales que viajan continuamente",
      "Trabajadores remotos que priorizan el mínimo peso (1.09 kg)",
      "Videoconferencias de alta calidad con sistema Dolby Atmos y 4 micrófonos",
      "Uso corporativo de oficina y productividad de alto nivel"
    ],
    perfiles_compatibles: ["trabajar", "oficina", "estudiar"],
    peso: "1.09 kg",
    material: "Fibra de carbono de grado aeroespacial y aleación de magnesio",
    puertos: [
      "2x Intel Thunderbolt 3 (conector USB-C)",
      "2x USB 3.1 Gen 1 Tipo A (uno de carga siempre activo)",
      "1x HDMI 1.4b",
      "1x Conector de extensión de red Ethernet nativo",
      "1x Conector combinado de audio 3.5 mm"
    ],
    kirma_check: {
      encendido: { ok: true, etiqueta: "Encendido", nota: "Arranque veloz, certificación ThinkPad superada sin demoras" },
      pantalla: { ok: true, etiqueta: "Pantalla", nota: "Panel 400 nits de alta gama con colores profundos y sin fugas" },
      teclado: { ok: true, etiqueta: "Teclado", nota: "Teclado probado al 100% con tacto característico ThinkPad X1" },
      touchpad: { ok: true, etiqueta: "Touchpad", nota: "Touchpad de cristal y botones TrackPoint funcionando de forma fluida" },
      puertos: { ok: true, etiqueta: "Puertos", nota: "Doble puerto Thunderbolt 3 probado con salida 4K y periféricos" },
      conectividad: { ok: true, etiqueta: "Conectividad", nota: "Intel Wireless-AC 9560 y Bluetooth 5.0 comprobados" },
      almacenamiento: { ok: true, etiqueta: "Almacenamiento", nota: "SSD NVMe testeado sin errores y con lectura óptima" },
      memoria: { ok: true, etiqueta: "Memoria RAM", nota: "16 GB en canal doble verificados con pruebas de estabilidad" },
      cargador: { ok: true, etiqueta: "Cargador", nota: "Cargador Lenovo 65W probado con ciclo de carga rápida" },
      bateria: { ok: true, etiqueta: "Batería", nota: "Salud al 86% verificada con descarga gradual y estable" }
    },
    badge: "SOLO 1.09 KG & FIBRA DE CARBONO"
  }
];

export const KIRMA_CONFIG = {
  nombre_marca: "KIRMA",
  concepto_oficial: "Tecnología que renace.",
  eje_comercial: "Equipos corporativos remanufacturados, seleccionados para volver a trabajar.",
  hero_titulo: "EQUIPOS CORPORATIVOS. LISTOS PARA TRABAJAR.",
  hero_subtitulo: "Tecnología que renace. Equipos corporativos remanufacturados, soporte técnico y acompañamiento real.",
  telefono_whatsapp: "573212257107",
  telefono_whatsapp_formateado: "+57 321 225 7107",
  correo_soporte: "kirmatechquindio@gmail.com",
  correo_ventas: "kirmatechquindio@gmail.com",
  ciudad_base: "Armenia, Quindío, Colombia",
  horario_atencion: "Horario de oficina",
  linkedin_url: "https://www.linkedin.com/in/jmtechquindio/",
  cobertura_envios: "Despachos a nivel nacional coordinados desde Armenia, Quindío hacia toda Colombia.",
  garantia_meses: 6,
  garantia_ley: "Ley 1480 de 2011 (Estatuto del Consumidor de Colombia)",
  herramientas_soporte_oficiales: {
    anydesk: {
      nombre: "AnyDesk",
      url_oficial: "https://anydesk.com/es/downloads",
      nota: "Descargar únicamente desde la página web oficial del proveedor."
    },
    teamviewer: {
      nombre: "TeamViewer",
      url_oficial: "https://www.teamviewer.com/es/descarga/",
      nota: "Descargar únicamente desde la página web oficial del proveedor."
    }
  }
};

export function getLiveInventory() {
  if (typeof window !== "undefined" && window.localStorage) {
    const saved = localStorage.getItem("kirma_custom_inventory");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn("Error leyendo inventario personalizado:", e);
      }
    }
  }
  return INVENTORY;
}
