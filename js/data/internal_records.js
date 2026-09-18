/**
 * KIRMA — Tecnología que renace.
 * Arquitectura de registros técnicos y operacionales internos.
 * Preparado para el panel administrativo, control de seriales,
 * trazabilidad de pruebas y seguimiento de casos de garantía.
 */

export const INTERNAL_DOCUMENTATION_TEMPLATES = {
  ficha_condicion: {
    codigo_formato: "FOR-TEC-001",
    nombre: "Ficha de Condición de Ingreso",
    descripcion: "Registro inicial de inspección física y estética de la unidad al ser recibida en laboratorio.",
    campos: [
      { clave: "fecha_ingreso", label: "Fecha de Ingreso", tipo: "date" },
      { clave: "modelo", label: "Modelo de Equipo", tipo: "text" },
      { clave: "serial", label: "Número de Serie (Service Tag / Serial)", tipo: "text" },
      { clave: "estado_general", label: "Estado General", tipo: "select", opciones: ["Grado A", "Grado A-", "Grado B"] },
      { clave: "condicion_estetica", label: "Condición Estética Detallada", tipo: "textarea" },
      { clave: "bateria_salud", label: "Porcentaje de Salud de Batería", tipo: "number" },
      { clave: "cargador_incluido", label: "Cargador Verificado", tipo: "text" },
      { clave: "observaciones", label: "Observaciones Particulares", tipo: "textarea" },
      { clave: "tecnico_responsable", label: "Técnico Responsable", tipo: "text" }
    ],
    ejemplo: {
      fecha_ingreso: "2026-08-12",
      modelo: "Dell Latitude 5420",
      serial: "DEL-LAT-5420-98K2",
      estado_general: "Grado A-",
      condicion_estetica: "Tapa con ligera marca superficial. Teclado y pantalla en excelente estado.",
      bateria_salud: "88%",
      cargador_incluido: "Original Dell 65W USB-C con cable nacional",
      observaciones: "Unidad apta para venta directa con Kirma Check completo aprobado.",
      tecnico_responsable: "Ing. Carlos Mendoza — Laboratorio KIRMA"
    }
  },

  kirma_check: {
    codigo_formato: "FOR-TEC-002",
    nombre: "Protocolo de Comprobación Kirma Check",
    descripcion: "Lista de 10 pruebas técnicas de laboratorio realizadas a cada unidad antes de su publicación.",
    pruebas: [
      { id: "p1", nombre: "Encendido y arranque en frío", metodo: "Test de arranque UEFI en frío y reinicio en caliente", criterio: "POST superado sin demoras ni errores de BIOS" },
      { id: "p2", nombre: "Pantalla y retroiluminación", metodo: "Prueba visual con fondos RGB completos al 100% de brillo", criterio: "Sin pixeles muertos, sin halos ni manchas de presión" },
      { id: "p3", nombre: "Teclado y respuesta táctil", metodo: "Tester de pulsación de matriz completa y retroiluminación", criterio: "100% de teclas operativas sin atoramientos" },
      { id: "p4", nombre: "Touchpad y gestos multitáctiles", metodo: "Validación de precisión de puntero y clics mecánicos", criterio: "Respuesta suave y botones físicos firmes" },
      { id: "p5", nombre: "Puertos físicos e interfaces", metodo: "Conexión en caliente de USB-C, USB-A, HDMI y RJ-45", criterio: "Reconocimiento inmediato de periféricos y transferencia de datos" },
      { id: "p6", nombre: "Conectividad inalámbrica", metodo: "Enlace a red Wi-Fi 5/6 y emparejamiento con dispositivo Bluetooth", criterio: "Señal estable sin pérdida de paquetes" },
      { id: "p7", nombre: "Salud y rendimiento de almacenamiento", metodo: "Análisis SMART de sectores reasignados y prueba de lectura continua", criterio: "Salud superior a 90% y tasas de transferencia óptimas" },
      { id: "p8", nombre: "Memoria RAM bajo carga sostenida", metodo: "Prueba de estrés MemTest durante ciclo de diagnóstico", criterio: "Cero errores de direccionamiento" },
      { id: "p9", nombre: "Cargador y estabilidad eléctrica", metodo: "Medición con multímetro y verificación bajo consumo máximo", criterio: "Voltaje y amperaje dentro de la tolerancia de fábrica" },
      { id: "p10", nombre: "Batería y retención de carga", metodo: "Medición de ciclo completo de carga y curva de descarga", criterio: "Descarga progresiva y salud reportada superior al 80%" }
    ]
  },

  recepcion_garantia: {
    codigo_formato: "FOR-GAR-001",
    nombre: "Recepción de Caso de Garantía",
    descripcion: "Registro formal cuando el cliente reporta una falla cubierta dentro del plazo de 6 meses.",
    campos: [
      { clave: "radicado", label: "Número de Radicado", tipo: "text" },
      { clave: "fecha_recepcion", label: "Fecha de Recepción", tipo: "date" },
      { clave: "nombre_cliente", label: "Nombre del Cliente", tipo: "text" },
      { clave: "numero_contacto", label: "Teléfono / WhatsApp", tipo: "text" },
      { clave: "equipo_id", label: "ID / Modelo KIRMA", tipo: "text" },
      { clave: "serial", label: "Serial del Equipo", tipo: "text" },
      { clave: "falla_reportada", label: "Descripción de la Falla Reportada por el Cliente", tipo: "textarea" },
      { clave: "estado_recepcion_fisica", label: "Estado Físico en que se Recibe", tipo: "textarea" },
      { clave: "accesorios_recibidos", label: "Accesorios Recibidos (Cargador, etc.)", tipo: "text" }
    ],
    ejemplo: {
      radicado: "GAR-2026-041",
      fecha_recepcion: "2026-09-02",
      nombre_cliente: "Juliana Restrepo",
      numero_contacto: "+57 312 456 7890",
      equipo_id: "KIRMA-031 / ThinkPad T490",
      serial: "LEN-T490-PF193K",
      falla_reportada: "El equipo se reinicia intermitentemente al conectar un monitor por HDMI.",
      estado_recepcion_fisica: "Equipo sin marcas de golpes nuevos, pantalla intacta, tornillos originales sellados.",
      accesorios_recibidos: "Cargador original Lenovo 65W USB-C con cable nacional."
    }
  },

  diagnostico_reparacion: {
    codigo_formato: "FOR-GAR-002",
    nombre: "Hoja Técnica de Diagnóstico y Reparación",
    descripcion: "Documentación de las pruebas realizadas, diagnóstico del técnico y piezas intervenidas.",
    campos: [
      { clave: "radicado", label: "Radicado Vinculado", tipo: "text" },
      { clave: "fecha_diagnostico", label: "Fecha de Diagnóstico", tipo: "date" },
      { clave: "pruebas_realizadas", label: "Pruebas de Diagnóstico Ejecutadas", tipo: "textarea" },
      { clave: "diagnostico_final", label: "Causa Raíz / Diagnóstico Técnico", tipo: "textarea" },
      { clave: "accion_tomada", label: "Acción de Reparación Tomada", tipo: "textarea" },
      { clave: "piezas_sustituidas", label: "Piezas Reparadas o Sustituidas", tipo: "text" },
      { clave: "resultado_control_calidad", label: "Kirma Check Post-Reparación", tipo: "text" },
      { clave: "dias_en_taller", label: "Días Privado de Uso (Suspensión de Garantía)", tipo: "number" },
      { clave: "fecha_finalizacion", label: "Fecha de Finalización", tipo: "date" }
    ],
    ejemplo: {
      radicado: "GAR-2026-041",
      fecha_diagnostico: "2026-09-04",
      pruebas_realizadas: "Prueba de esfuerzo con monitor externo HDMI y reemplazo de controlador de video.",
      diagnostico_final: "Falla en soldadura interna del puerto HDMI por fatiga previa de material.",
      accion_tomada: "Sustitución de subplaca de puertos HDMI/USB original por componente OEM certificado.",
      piezas_sustituidas: "Módulo interno HDMI/USB Lenovo original (P/N 01YU012).",
      resultado_control_calidad: "Prueba continua de 8 horas con doble monitor en resolución 4K superada con éxito.",
      dias_en_taller: 4,
      fecha_finalizacion: "2026-09-06"
    }
  },

  acta_entrega: {
    codigo_formato: "FOR-GAR-003",
    nombre: "Acta de Entrega y Suspensión de Garantía",
    descripcion: "Constancia firmada para el cliente con la constancia de reparación y ajuste de fecha de vencimiento.",
    nota_legal: "Conforme a la legislación colombiana (Ley 1480 de 2011), el término de garantía se suspende durante el tiempo en que el consumidor estuvo privado del uso del equipo, extendiéndose la vigencia en igual número de días.",
    campos: [
      { clave: "radicado", label: "Radicado", tipo: "text" },
      { clave: "fecha_entrega", label: "Fecha de Devolución al Cliente", tipo: "date" },
      { clave: "dias_suspendidos", label: "Días de Extensión de Garantía Añadidos", tipo: "number" },
      { clave: "nueva_fecha_vencimiento", label: "Nueva Fecha de Vencimiento de Garantía", tipo: "date" },
      { clave: "firma_tecnico", label: "Firma Responsable KIRMA", tipo: "text" },
      { clave: "firma_cliente", label: "Firma de Recibido a Conformidad", tipo: "text" }
    ],
    ejemplo: {
      radicado: "GAR-2026-041",
      fecha_entrega: "2026-09-07",
      dias_suspendidos: 5,
      nueva_fecha_vencimiento: "2027-02-17 (5 días adicionales sumados al término legal)",
      firma_tecnico: "Ing. Carlos Mendoza — Laboratorio KIRMA",
      firma_cliente: "Juliana Restrepo (Recibido conforme en Bogotá)"
    }
  }
};
