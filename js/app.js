/**
 * KIRMA — Aplicación Principal y Enrutador.
 * Inicialización modular, control de navegación accesible y FAQ acordeón.
 */

import { CatalogService } from "./modules/catalog.js";
import { FinderService } from "./modules/finder.js";
import { ComparatorService } from "./modules/comparator.js";
import { SupportService } from "./modules/support.js";
import { WarrantyService } from "./modules/warranty.js";
import { InternalDocsService } from "./modules/internal_docs.js";
import { WhatsAppService } from "./modules/whatsapp.js";
import { KIRMA_CONFIG } from "./data/inventory.js";

document.addEventListener("DOMContentLoaded", () => {
  // Inicialización de servicios
  CatalogService.init();
  FinderService.init();
  ComparatorService.init();
  SupportService.init();
  WarrantyService.init();
  InternalDocsService.init();

  // Control del Menú Móvil
  const mobileToggle = document.getElementById("btn-mobile-menu");
  const mainNav = document.getElementById("main-nav");
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("mobile-open");
      mobileToggle.setAttribute("aria-expanded", isOpen);
    });

    // Cerrar menú móvil al hacer clic en un enlace
    mainNav.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("mobile-open");
        mobileToggle.setAttribute("aria-expanded", false);
      });
    });
  }

  // Acordeón de Preguntas Frecuentes (FAQ)
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const trigger = item.querySelector(".faq-trigger");
    if (trigger) {
      trigger.addEventListener("click", () => {
        const wasOpen = item.classList.contains("open");
        faqItems.forEach(i => i.classList.remove("open"));
        if (!wasOpen) {
          item.classList.add("open");
        }
      });
    }
  });

  // Tecla Escape para cerrar cualquier modal abierto
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop.open").forEach(modal => {
        modal.classList.remove("open");
      });
    }
  });

  // Cerrar modales haciendo clic en el backdrop exterior
  document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove("open");
      }
    });
  });

  // Enlace global para el botón de WhatsApp principal del Header
  const headerWaBtn = document.getElementById("header-wa-btn");
  if (headerWaBtn) {
    headerWaBtn.href = WhatsAppService.buildUrl("Hola KIRMA. Deseo información sobre los equipos corporativos remanufacturados y asesoría para mi compra.");
  }

  // Actualizar año en el footer
  const yearSpan = document.getElementById("copyright-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  
  // Acceso Administrativo Privado Exclusivo (Ctrl + Shift + K o triple clic en logo)
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === "K" || e.key === "k")) {
      e.preventDefault();
      window.location.href = "admin.html";
    }
  });

  const brandLogo = document.querySelector(".brand-logo");
  if (brandLogo) {
    let clickCount = 0;
    let clickTimer = null;
    brandLogo.addEventListener("click", (e) => {
      clickCount++;
      if (clickCount === 3) {
        e.preventDefault();
        window.location.href = "admin.html";
      }
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { clickCount = 0; }, 800);
    });
  }

  console.log("KIRMA — Tecnología que renace. Plataforma inicializada correctamente.");
});
