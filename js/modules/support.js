/**
 * KIRMA — Centro de Soporte Técnico.
 * Protocolo de soporte remoto seguro, enlaces oficiales de AnyDesk/TeamViewer
 * y advertencia crítica de copia de seguridad (backup) antes de formateos.
 */

import { KIRMA_CONFIG } from "../data/inventory.js";
import { WhatsAppService } from "./whatsapp.js";

export const SupportService = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    const waSupportBtn = document.getElementById("btn-wa-support-channel");
    if (waSupportBtn) {
      waSupportBtn.href = WhatsAppService.forSupport("Soporte Técnico Especializado");
    }

    const waFormatBtn = document.getElementById("btn-wa-format-help");
    if (waFormatBtn) {
      waFormatBtn.href = WhatsAppService.forSupport("Orientación para Restauración / Formateo de Windows");
    }
  }
};
