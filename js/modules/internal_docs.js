/**
 * KIRMA — Visualizador de Documentación Interna y Arquitectura Operativa.
 * Permite explorar los formatos de Ficha de condición, Kirma Check,
 * recepción de garantía, hoja técnica de reparación y acta de entrega.
 */

import { INTERNAL_DOCUMENTATION_TEMPLATES } from "../data/internal_records.js";

export const InternalDocsService = {
  activeDoc: "ficha_condicion",

  init() {
    this.bindTabs();
    this.render();
  },

  bindTabs() {
    const tabButtons = document.querySelectorAll(".internal-doc-tab");
    tabButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        tabButtons.forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        this.activeDoc = e.currentTarget.getAttribute("data-doc");
        this.render();
      });
    });
  },

  render() {
    const container = document.getElementById("internal-doc-viewer");
    if (!container) return;

    const doc = INTERNAL_DOCUMENTATION_TEMPLATES[this.activeDoc];
    if (!doc) return;

    let contentHtml = "";

    if (this.activeDoc === "kirma_check") {
      contentHtml = `
        <div style="margin-bottom: 1.5rem;">
          <span class="asset-tag" style="margin-bottom: 0.5rem;">${doc.codigo_formato}</span>
          <h3 style="font-size: 1.25rem; font-weight: 800; margin-top: 4px;">${doc.nombre}</h3>
          <p style="color: var(--kirma-text-muted); font-size: 0.875rem;">${doc.descripcion}</p>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.8125rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--kirma-border-main); background: var(--kirma-bg-main); text-align: left;">
                <th style="padding: 8px 12px; font-family: var(--font-mono); width: 10%;">ID</th>
                <th style="padding: 8px 12px; width: 25%;">PRUEBA</th>
                <th style="padding: 8px 12px; width: 35%;">MÉTODO DE LABORATORIO</th>
                <th style="padding: 8px 12px; width: 30%;">CRITERIO DE APROBACIÓN</th>
              </tr>
            </thead>
            <tbody>
              ${doc.pruebas.map(p => `
                <tr style="border-bottom: 1px solid var(--kirma-border-subtle);">
                  <td style="padding: 8px 12px; font-family: var(--font-mono); font-weight: bold; color: var(--kirma-green-700);">${p.id.toUpperCase()}</td>
                  <td style="padding: 8px 12px; font-weight: 600;">${p.nombre}</td>
                  <td style="padding: 8px 12px; color: var(--kirma-text-body);">${p.metodo}</td>
                  <td style="padding: 8px 12px; color: var(--kirma-green-800); font-weight: 500;">✓ ${p.criterio}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    } else {
      const ejemplo = doc.ejemplo || {};
      contentHtml = `
        <div style="margin-bottom: 1.5rem;">
          <span class="asset-tag" style="margin-bottom: 0.5rem;">${doc.codigo_formato}</span>
          <h3 style="font-size: 1.25rem; font-weight: 800; margin-top: 4px;">${doc.nombre}</h3>
          <p style="color: var(--kirma-text-muted); font-size: 0.875rem;">${doc.descripcion}</p>
          ${doc.nota_legal ? `<p style="font-size: 0.8125rem; background: var(--kirma-bg-cream); padding: 8px 12px; border-left: 3px solid var(--kirma-green-700); margin-top: 8px;"><strong>Fundamento Legal:</strong> ${doc.nota_legal}</p>` : ''}
        </div>

        <div style="background: var(--kirma-bg-main); border: 1px solid var(--kirma-border-main); border-radius: var(--radius-sm); padding: 1.5rem;">
          <h4 style="font-size: 0.8125rem; font-family: var(--font-mono); text-transform: uppercase; color: var(--kirma-text-muted); margin-bottom: 1rem;">
            REGISTRO TÉCNICO DE MUESTRA (DATOS CONTROLADOS)
          </h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; font-size: 0.8125rem;">
            ${Object.entries(ejemplo).map(([key, val]) => `
              <div style="background: #ffffff; padding: 10px 14px; border: 1px solid var(--kirma-border-subtle); border-radius: var(--radius-xs);">
                <div style="font-family: var(--font-mono); font-size: 0.6875rem; text-transform: uppercase; color: var(--kirma-text-muted); margin-bottom: 2px;">
                  ${key.replace(/_/g, " ")}
                </div>
                <div style="font-weight: 600; color: var(--kirma-text-main);">
                  ${val}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    container.innerHTML = contentHtml;
  }
};
