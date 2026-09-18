/**
 * KIRMA — Garantía y Marco Legal (6 Meses).
 * Cobertura conforme a la Ley 1480 de 2011, exclusiones causales,
 * procedimiento de reclamación 01-06 y suspensión de término por privación de uso.
 */

import { WhatsAppService } from "./whatsapp.js";

export const WarrantyService = {
  init() {
    const claimBtn = document.getElementById("btn-start-warranty-claim");
    if (claimBtn) {
      claimBtn.addEventListener("click", () => {
        const serialInput = document.getElementById("warranty-claim-serial");
        const serialVal = serialInput ? serialInput.value.trim() : "";
        window.open(WhatsAppService.forWarranty(serialVal), "_blank");
      });
    }
  }
};
