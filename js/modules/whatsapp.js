/**
 * KIRMA — Integración Contextual con WhatsApp.
 * Mensajes humanos, directos y sin lenguaje robótico ni exageraciones.
 */

import { KIRMA_CONFIG } from "../data/inventory.js";

export const WhatsAppService = {
  /**
   * Genera enlace oficial de WhatsApp con mensaje codificado
   */
  buildUrl(messageText) {
    const cleanPhone = KIRMA_CONFIG.telefono_whatsapp.replace(/[^0-9]/g, "");
    const encoded = encodeURIComponent(messageText);
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  },

  /**
   * Mensaje para consultar un equipo específico desde su Ficha KIRMA
   */
  forProduct(product) {
    const text = `Hola KIRMA. Me interesa el equipo ${product.marca} ${product.modelo} (${product.tag}) con precio de ${product.precio_formato}. ¿Sigue disponible para compra? Quisiera consultar detalles de entrega y pago.`;
    return this.buildUrl(text);
  },

  /**
   * Mensaje para solicitar ayuda en la elección según necesidad
   */
  forNeed(needKey, needLabel) {
    const text = `Hola KIRMA. Estoy buscando un computador corporativo remanufacturado para ${needLabel || "trabajar y estudiar"}. ¿Podrían orientarme sobre las opciones disponibles y sus características?`;
    return this.buildUrl(text);
  },

  /**
   * Mensaje para comparar equipos seleccionados
   */
  forComparison(products) {
    const names = products.map(p => `${p.marca} ${p.modelo} (${p.tag})`).join(" y ");
    const text = `Hola KIRMA. Estuve revisando el comparador y tengo dudas entre estos equipos: ${names}. ¿Cuál me recomendarían para mi tipo de uso?`;
    return this.buildUrl(text);
  },

  /**
   * Mensaje para soporte técnico o posventa
   */
  forSupport(topic) {
    const text = `Hola soporte KIRMA. Tengo una consulta técnica respecto a un equipo corporativo (${topic || "soporte postventa / configuración"}). Agradezco su orientación.`;
    return this.buildUrl(text);
  },

  /**
   * Mensaje para trámite o consulta de garantía
   */
  forWarranty(serialOrModel) {
    const ref = serialOrModel ? ` para el equipo ${serialOrModel}` : "";
    const text = `Hola KIRMA. Me comunico para reportar una novedad técnica cubierta por la garantía de 6 meses${ref}. Deseo registrar el caso para diagnóstico.`;
    return this.buildUrl(text);
  }
};
