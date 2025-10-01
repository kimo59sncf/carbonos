import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportData {
  title: string;
  type: string;
  companyName: string;
  period: string;
  generatedAt: string;
  sections: any[];
  totals?: {
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  };
}

export class ReportGenerator {
  private doc: jsPDF;

  constructor() {
    this.doc = new jsPDF();
  }

  generateCSRDReport(data: ReportData): void {
    const { width } = this.doc.internal.pageSize;
    let yPosition = 20;

    // En-tête du rapport
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RAPPORT CSRD', width / 2, yPosition, { align: 'center' });

    yPosition += 15;
    this.doc.setFontSize(16);
    this.doc.text(data.title, width / 2, yPosition, { align: 'center' });

    yPosition += 20;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Entreprise: ${data.companyName}`, 20, yPosition);

    yPosition += 7;
    this.doc.text(`Période: ${data.period}`, 20, yPosition);

    yPosition += 7;
    this.doc.text(`Date de génération: ${new Date(data.generatedAt).toLocaleDateString('fr-FR')}`, 20, yPosition);

    yPosition += 20;

    // Résumé des émissions
    if (data.totals) {
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('RÉSUMÉ DES ÉMISSIONS', 20, yPosition);

      yPosition += 15;

      const tableData = [
        ['Scope', 'Émissions (kgCO₂e)', 'Pourcentage'],
        ['Scope 1', data.totals.scope1.toFixed(2), `${((data.totals.scope1 / data.totals.total) * 100).toFixed(1)}%`],
        ['Scope 2', data.totals.scope2.toFixed(2), `${((data.totals.scope2 / data.totals.total) * 100).toFixed(1)}%`],
        ['Scope 3', data.totals.scope3.toFixed(2), `${((data.totals.scope3 / data.totals.total) * 100).toFixed(1)}%`],
        ['Total', data.totals.total.toFixed(2), '100%']
      ];

      (this.doc as any).autoTable({
        head: [tableData[0]],
        body: tableData.slice(1),
        startY: yPosition,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });

      yPosition = (this.doc as any).lastAutoTable.finalY + 20;
    }

    // Ajouter une nouvelle page si nécessaire
    if (yPosition > 250) {
      this.doc.addPage();
      yPosition = 20;
    }

    // Méthodologie
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('MÉTHODOLOGIE', 20, yPosition);

    yPosition += 15;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Ce rapport a été généré conformément aux exigences de la directive CSRD (Corporate Sustainability Reporting Directive) et utilise la méthodologie GHG Protocol pour le calcul des émissions.', 20, yPosition, { maxWidth: width - 40 });

    yPosition += 20;

    // Pied de page
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.text(`Page ${i} sur ${pageCount}`, width - 30, this.doc.internal.pageSize.height - 10);
      this.doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, this.doc.internal.pageSize.height - 10);
    }
  }

  generateBEGESReport(data: ReportData): void {
    const { width } = this.doc.internal.pageSize;
    let yPosition = 20;

    // En-tête du rapport BEGES
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('BILAN BEGES', width / 2, yPosition, { align: 'center' });

    yPosition += 15;
    this.doc.setFontSize(16);
    this.doc.text(data.title, width / 2, yPosition, { align: 'center' });

    yPosition += 20;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Entreprise: ${data.companyName}`, 20, yPosition);

    yPosition += 7;
    this.doc.text(`Année de reporting: ${data.period}`, 20, yPosition);

    yPosition += 7;
    this.doc.text(`Conforme au décret n°2011-829 du 11 juillet 2011`, 20, yPosition);

    yPosition += 20;

    // Informations réglementaires
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('INFORMATIONS RÉGLEMENTAIRES', 20, yPosition);

    yPosition += 15;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');

    const regulatoryInfo = [
      '• Bilan des émissions de gaz à effet de serre (GES)',
      '• Périmètre : Scopes 1 et 2 obligatoires, Scope 3 recommandé',
      '• Méthodologie : Conformément à la norme ISO 14064',
      '• Unité de mesure : kgCO₂e (équivalent CO₂)',
      '• Période de reporting : Année civile'
    ];

    regulatoryInfo.forEach((info) => {
      this.doc.text(info, 20, yPosition);
      yPosition += 7;
    });

    yPosition += 10;

    // Résumé des émissions
    if (data.totals) {
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('RÉSUMÉ DES ÉMISSIONS', 20, yPosition);

      yPosition += 15;

      const tableData = [
        ['Poste d\'émission', 'Émissions (kgCO₂e)', 'Part (%)'],
        ['Émissions directes (Scope 1)', data.totals.scope1.toFixed(2), `${((data.totals.scope1 / data.totals.total) * 100).toFixed(1)}%`],
        ['Émissions énergie (Scope 2)', data.totals.scope2.toFixed(2), `${((data.totals.scope2 / data.totals.total) * 100).toFixed(1)}%`],
        ['Autres émissions indirectes (Scope 3)', data.totals.scope3.toFixed(2), `${((data.totals.scope3 / data.totals.total) * 100).toFixed(1)}%`],
        ['TOTAL', data.totals.total.toFixed(2), '100%']
      ];

      (this.doc as any).autoTable({
        head: [tableData[0]],
        body: tableData.slice(1),
        startY: yPosition,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [34, 197, 94] },
        alternateRowStyles: { fillColor: [240, 253, 244] }
      });

      yPosition = (this.doc as any).lastAutoTable.finalY + 20;
    }

    // Pied de page
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.text(`Page ${i} sur ${pageCount}`, width - 30, this.doc.internal.pageSize.height - 10);
      this.doc.text(`Conforme BEGES - Généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, this.doc.internal.pageSize.height - 10);
    }
  }

  generateInternalReport(data: ReportData): void {
    const { width } = this.doc.internal.pageSize;
    let yPosition = 20;

    // En-tête du rapport interne
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RAPPORT INTERNE', width / 2, yPosition, { align: 'center' });

    yPosition += 12;
    this.doc.setFontSize(14);
    this.doc.text(data.title, width / 2, yPosition, { align: 'center' });

    yPosition += 20;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Période: ${data.period}`, 20, yPosition);

    yPosition += 7;
    this.doc.text(`Date de génération: ${new Date(data.generatedAt).toLocaleDateString('fr-FR')}`, 20, yPosition);

    yPosition += 20;

    // Objectifs du rapport
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('OBJECTIFS DU RAPPORT', 20, yPosition);

    yPosition += 12;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Ce rapport interne a pour objectifs de :', 20, yPosition);

    yPosition += 7;
    this.doc.text('• Suivre les émissions de gaz à effet de serre', 25, yPosition);

    yPosition += 7;
    this.doc.text('• Identifier les axes d\'amélioration', 25, yPosition);

    yPosition += 7;
    this.doc.text('• Faciliter la prise de décision', 25, yPosition);

    yPosition += 15;

    // Données d'émissions
    if (data.totals) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('DONNÉES D\'ÉMISSIONS', 20, yPosition);

      yPosition += 15;

      const chartData = [
        ['Catégorie', 'Émissions (kgCO₂e)'],
        ['Scope 1', data.totals.scope1.toFixed(2)],
        ['Scope 2', data.totals.scope2.toFixed(2)],
        ['Scope 3', data.totals.scope3.toFixed(2)]
      ];

      (this.doc as any).autoTable({
        head: [chartData[0]],
        body: chartData.slice(1),
        startY: yPosition,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [147, 51, 234] }
      });

      yPosition = (this.doc as any).lastAutoTable.finalY + 20;
    }

    // Pied de page
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.text(`Page ${i} sur ${pageCount}`, width - 30, this.doc.internal.pageSize.height - 10);
      this.doc.text(`Rapport interne - ${new Date().toLocaleDateString('fr-FR')}`, 20, this.doc.internal.pageSize.height - 10);
    }
  }

  generateCustomReport(data: ReportData): void {
    const { width } = this.doc.internal.pageSize;
    let yPosition = 20;

    // En-tête du rapport personnalisé
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RAPPORT PERSONNALISÉ', width / 2, yPosition, { align: 'center' });

    yPosition += 12;
    this.doc.setFontSize(14);
    this.doc.text(data.title, width / 2, yPosition, { align: 'center' });

    yPosition += 20;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Généré le: ${new Date(data.generatedAt).toLocaleDateString('fr-FR')}`, 20, yPosition);

    yPosition += 15;

    // Sections personnalisées
    data.sections.forEach((section, index) => {
      // Nouvelle page si nécessaire
      if (yPosition > 200) {
        this.doc.addPage();
        yPosition = 20;
      }

      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${index + 1}. ${section.title}`, 20, yPosition);

      yPosition += 12;
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');

      if (section.description) {
        this.doc.text(section.description, 20, yPosition, { maxWidth: width - 40 });
        yPosition += 15;
      }

      // Contenu selon le type de section
      if (section.type === 'emissions' && data.totals) {
        const emissionsText = `Émissions totales : ${data.totals.total.toFixed(2)} kgCO₂e`;
        this.doc.text(emissionsText, 20, yPosition);
        yPosition += 10;
      }

      yPosition += 10;
    });

    // Pied de page
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.text(`Page ${i} sur ${pageCount}`, width - 30, this.doc.internal.pageSize.height - 10);
      this.doc.text(`Rapport personnalisé - ${new Date().toLocaleDateString('fr-FR')}`, 20, this.doc.internal.pageSize.height - 10);
    }
  }

  save(filename: string): void {
    this.doc.save(filename);
  }

  getBlob(): Blob {
    return this.doc.output('blob');
  }

  getBase64(): string {
    return this.doc.output('datauristring');
  }
}

// Fonction utilitaire pour télécharger le rapport
export function downloadReport(data: ReportData, type: 'csrd' | 'beges' | 'internal' | 'custom'): void {
  const generator = new ReportGenerator();

  switch (type) {
    case 'csrd':
      generator.generateCSRDReport(data);
      break;
    case 'beges':
      generator.generateBEGESReport(data);
      break;
    case 'internal':
      generator.generateInternalReport(data);
      break;
    case 'custom':
      generator.generateCustomReport(data);
      break;
  }

  const filename = `rapport-${type}-${data.companyName}-${new Date().toISOString().split('T')[0]}.pdf`;
  generator.save(filename);
}