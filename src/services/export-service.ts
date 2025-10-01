/**
 * Service d'export avancé pour CarbonOS
 * Support PDF, Excel, et autres formats
 */

import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { formatDate, formatNumber, formatCarbonValue } from '@/lib/utils';

export interface ExportData {
  companyName: string;
  sector: string;
  period: string;
  emissions: {
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  };
  trends: Array<{
    period: string;
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  }>;
  benchmarks: Array<{
    indicator: string;
    value: string;
    average: string;
    position: string;
  }>;
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  template?: 'standard' | 'detailed' | 'executive' | 'regulatory';
  includeCharts?: boolean;
  includeBenchmarks?: boolean;
  language?: 'fr' | 'en';
  customBranding?: {
    logo?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
  };
}

export class ExportService {
  /**
   * Export principal avec options avancées
   */
  async exportReport(data: ExportData, options: ExportOptions): Promise<Blob> {
    switch (options.format) {
      case 'pdf':
        return this.exportToPDF(data, options);
      case 'excel':
        return this.exportToExcel(data, options);
      case 'csv':
        return this.exportToCSV(data, options);
      case 'json':
        return this.exportToJSON(data, options);
      default:
        throw new Error(`Format d'export non supporté: ${options.format}`);
    }
  }

  /**
   * Export PDF avec template professionnel
   */
  private async exportToPDF(data: ExportData, options: ExportOptions): Promise<Blob> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Configuration selon le template
    const config = this.getTemplateConfig(options.template || 'standard');

    // En-tête du document
    this.addPDFHeader(doc, data, options, yPosition);
    yPosition += 40;

    // Résumé exécutif
    if (config.includeExecutiveSummary) {
      yPosition = this.addPDFExecutiveSummary(doc, data, options, yPosition, pageWidth, margin);
      yPosition += 20;
    }

    // Émissions détaillées
    if (config.includeDetailedEmissions) {
      yPosition = this.addPDFEmissionsDetails(doc, data, options, yPosition, pageWidth, margin);
      yPosition += 20;
    }

    // Tendances
    if (config.includeTrends && data.trends.length > 0) {
      yPosition = this.addPDFTrends(doc, data, options, yPosition, pageWidth, margin);
      yPosition += 20;
    }

    // Benchmarks
    if (config.includeBenchmarks && options.includeBenchmarks && data.benchmarks.length > 0) {
      yPosition = this.addPDFBenchmarks(doc, data, options, yPosition, pageWidth, margin);
      yPosition += 20;
    }

    // Pied de page
    this.addPDFFooter(doc, data, options, pageHeight - 20);

    return doc.output('blob');
  }

  /**
   * Export Excel avec onglets multiples
   */
  private async exportToExcel(data: ExportData, options: ExportOptions): Promise<Blob> {
    const workbook = XLSX.utils.book_new();

    // Feuille de résumé
    const summaryData = [
      ['Rapport Carbone - Résumé'],
      [''],
      ['Entreprise', data.companyName],
      ['Secteur', data.sector],
      ['Période', data.period],
      [''],
      ['Émissions (tCO₂e)', 'Valeur'],
      ['Scope 1', data.emissions.scope1],
      ['Scope 2', data.emissions.scope2],
      ['Scope 3', data.emissions.scope3],
      ['Total', data.emissions.total],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Résumé');

    // Feuille des tendances
    if (data.trends.length > 0) {
      const trendsData = [
        ['Période', 'Scope 1', 'Scope 2', 'Scope 3', 'Total'],
        ...data.trends.map(trend => [
          trend.period,
          trend.scope1,
          trend.scope2,
          trend.scope3,
          trend.total,
        ]),
      ];

      const trendsSheet = XLSX.utils.aoa_to_sheet(trendsData);
      XLSX.utils.book_append_sheet(workbook, trendsSheet, 'Tendances');
    }

    // Feuille des benchmarks
    if (data.benchmarks.length > 0) {
      const benchmarksData = [
        ['Indicateur', 'Valeur', 'Moyenne', 'Position'],
        ...data.benchmarks.map(benchmark => [
          benchmark.indicator,
          benchmark.value,
          benchmark.average,
          benchmark.position,
        ]),
      ];

      const benchmarksSheet = XLSX.utils.aoa_to_sheet(benchmarksData);
      XLSX.utils.book_append_sheet(workbook, benchmarksSheet, 'Benchmarks');
    }

    // Métadonnées du document
    workbook.Props = {
      Title: `Rapport Carbone - ${data.companyName}`,
      Subject: 'Rapport d\'émissions de gaz à effet de serre',
      Author: 'CarbonOS',
      CreatedDate: new Date(),
      Company: data.companyName,
    };

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  }

  /**
   * Export CSV simple
   */
  private async exportToCSV(data: ExportData, options: ExportOptions): Promise<Blob> {
    const csvData = [
      'Rapport Carbone',
      `Entreprise,${data.companyName}`,
      `Secteur,${data.sector}`,
      `Période,${data.period}`,
      '',
      'Émissions,tCO₂e',
      `Scope 1,${data.emissions.scope1}`,
      `Scope 2,${data.emissions.scope2}`,
      `Scope 3,${data.emissions.scope3}`,
      `Total,${data.emissions.total}`,
      '',
      'Tendances',
      'Période,Scope 1,Scope 2,Scope 3,Total',
      ...data.trends.map(trend =>
        `${trend.period},${trend.scope1},${trend.scope2},${trend.scope3},${trend.total}`
      ),
    ].join('\n');

    return new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  }

  /**
   * Export JSON structuré
   */
  private async exportToJSON(data: ExportData, options: ExportOptions): Promise<Blob> {
    const jsonData = {
      metadata: {
        exportDate: new Date().toISOString(),
        format: options.format,
        template: options.template,
        language: options.language,
        generatedBy: 'CarbonOS',
      },
      company: {
        name: data.companyName,
        sector: data.sector,
      },
      report: {
        period: data.period,
        emissions: data.emissions,
        trends: data.trends,
        benchmarks: data.benchmarks,
      },
    };

    return new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json;charset=utf-8;'
    });
  }

  /**
   * Configuration des templates
   */
  private getTemplateConfig(template: string) {
    const configs = {
      standard: {
        includeExecutiveSummary: true,
        includeDetailedEmissions: true,
        includeTrends: true,
        includeBenchmarks: true,
        includeCharts: false,
      },
      detailed: {
        includeExecutiveSummary: true,
        includeDetailedEmissions: true,
        includeTrends: true,
        includeBenchmarks: true,
        includeCharts: true,
      },
      executive: {
        includeExecutiveSummary: true,
        includeDetailedEmissions: false,
        includeTrends: true,
        includeBenchmarks: true,
        includeCharts: false,
      },
      regulatory: {
        includeExecutiveSummary: false,
        includeDetailedEmissions: true,
        includeTrends: true,
        includeBenchmarks: false,
        includeCharts: false,
      },
    };

    return configs[template as keyof typeof configs] || configs.standard;
  }

  /**
   * Ajout de l'en-tête PDF
   */
  private addPDFHeader(doc: jsPDF, data: ExportData, options: ExportOptions, yPosition: number) {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Titre principal
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Rapport Carbone', pageWidth / 2, yPosition, { align: 'center' });

    // Informations entreprise
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(data.companyName, pageWidth / 2, yPosition + 10, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`${data.sector} • ${data.period}`, pageWidth / 2, yPosition + 20, { align: 'center' });

    // Date d'export
    doc.setFontSize(10);
    doc.text(`Exporté le ${formatDate(new Date())}`, pageWidth / 2, yPosition + 30, { align: 'center' });
  }

  /**
   * Ajout du résumé exécutif
   */
  private addPDFExecutiveSummary(
    doc: jsPDF,
    data: ExportData,
    options: ExportOptions,
    yPosition: number,
    pageWidth: number,
    margin: number
  ): number {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Résumé Exécutif', margin, yPosition);

    yPosition += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const summaryText = `L'entreprise ${data.companyName} a émis un total de ${formatCarbonValue(data.emissions.total)} pendant la période ${data.period}. Cette empreinte carbone se répartit en ${formatCarbonValue(data.emissions.scope1)} pour le Scope 1, ${formatCarbonValue(data.emissions.scope2)} pour le Scope 2 et ${formatCarbonValue(data.emissions.scope3)} pour le Scope 3.`;

    const splitText = doc.splitTextToSize(summaryText, pageWidth - 2 * margin);
    doc.text(splitText, margin, yPosition);

    return yPosition + splitText.length * 5 + 10;
  }

  /**
   * Ajout des détails d'émissions
   */
  private addPDFEmissionsDetails(
    doc: jsPDF,
    data: ExportData,
    options: ExportOptions,
    yPosition: number,
    pageWidth: number,
    margin: number
  ): number {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Émissions Détaillées', margin, yPosition);

    yPosition += 15;

    // Tableau des émissions
    const emissionsData = [
      ['Scope', 'Émissions (tCO₂e)', 'Pourcentage'],
      ['Scope 1', formatNumber(data.emissions.scope1), `${((data.emissions.scope1 / data.emissions.total) * 100).toFixed(1)}%`],
      ['Scope 2', formatNumber(data.emissions.scope2), `${((data.emissions.scope2 / data.emissions.total) * 100).toFixed(1)}%`],
      ['Scope 3', formatNumber(data.emissions.scope3), `${((data.emissions.scope3 / data.emissions.total) * 100).toFixed(1)}%`],
      ['Total', formatNumber(data.emissions.total), '100%'],
    ];

    this.addPDFTable(doc, emissionsData, margin, yPosition, pageWidth - 2 * margin);

    return yPosition + emissionsData.length * 8 + 20;
  }

  /**
   * Ajout des tendances
   */
  private addPDFTrends(
    doc: jsPDF,
    data: ExportData,
    options: ExportOptions,
    yPosition: number,
    pageWidth: number,
    margin: number
  ): number {
    if (data.trends.length === 0) return yPosition;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Évolution des Émissions', margin, yPosition);

    yPosition += 15;

    // En-têtes du tableau
    const headers = ['Période', 'Scope 1', 'Scope 2', 'Scope 3', 'Total'];
    const tableData = [
      headers,
      ...data.trends.map(trend => [
        trend.period,
        formatNumber(trend.scope1),
        formatNumber(trend.scope2),
        formatNumber(trend.scope3),
        formatNumber(trend.total),
      ]),
    ];

    this.addPDFTable(doc, tableData, margin, yPosition, pageWidth - 2 * margin);

    return yPosition + tableData.length * 8 + 20;
  }

  /**
   * Ajout des benchmarks
   */
  private addPDFBenchmarks(
    doc: jsPDF,
    data: ExportData,
    options: ExportOptions,
    yPosition: number,
    pageWidth: number,
    margin: number
  ): number {
    if (data.benchmarks.length === 0) return yPosition;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Benchmarks Sectoriels', margin, yPosition);

    yPosition += 15;

    const benchmarksData = [
      ['Indicateur', 'Votre valeur', 'Moyenne secteur', 'Position'],
      ...data.benchmarks.map(benchmark => [
        benchmark.indicator,
        benchmark.value,
        benchmark.average,
        benchmark.position,
      ]),
    ];

    this.addPDFTable(doc, benchmarksData, margin, yPosition, pageWidth - 2 * margin);

    return yPosition + benchmarksData.length * 8 + 20;
  }

  /**
   * Ajout d'un tableau PDF
   */
  private addPDFTable(
    doc: jsPDF,
    data: string[][],
    x: number,
    y: number,
    width: number
  ): void {
    const rowHeight = 8;
    const colWidth = width / data[0].length;

    data.forEach((row, rowIndex) => {
      const currentY = y + rowIndex * rowHeight;

      // En-tête en gras
      if (rowIndex === 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(240, 240, 240);
        doc.rect(x, currentY - 2, width, rowHeight, 'F');
      } else {
        doc.setFont('helvetica', 'normal');
      }

      row.forEach((cell, colIndex) => {
        const cellX = x + colIndex * colWidth;
        doc.text(cell, cellX + 2, currentY + 5);
      });
    });
  }

  /**
   * Ajout du pied de page
   */
  private addPDFFooter(doc: jsPDF, data: ExportData, options: ExportOptions, yPosition: number) {
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Document généré par CarbonOS - Plateforme de gestion carbone', pageWidth / 2, yPosition, { align: 'center' });
    doc.text(`Exporté le ${formatDate(new Date())}`, pageWidth / 2, yPosition + 5, { align: 'center' });
  }
}

/**
 * Service de sauvegarde automatique
 */
export class BackupService {
  private autoSaveInterval: NodeJS.Timeout | null = null;
  private lastBackupTime = 0;
  private backupInterval = 5 * 60 * 1000; // 5 minutes

  /**
   * Démarre la sauvegarde automatique
   */
  startAutoBackup(callback: () => Promise<void>): void {
    if (this.autoSaveInterval) {
      this.stopAutoBackup();
    }

    this.autoSaveInterval = setInterval(async () => {
      try {
        await callback();
        this.lastBackupTime = Date.now();
        console.log('Sauvegarde automatique effectuée');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde automatique:', error);
      }
    }, this.backupInterval);
  }

  /**
   * Arrête la sauvegarde automatique
   */
  stopAutoBackup(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  /**
   * Sauvegarde manuelle
   */
  async manualBackup(data: any, filename?: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const defaultFilename = `carbonos-backup-${timestamp}.json`;
    const finalFilename = filename || defaultFilename;

    try {
      const backupData = {
        timestamp,
        version: '2.0',
        data,
        metadata: {
          userAgent: navigator.userAgent,
          url: window.location.href,
        },
      };

      // Sauvegarde locale
      localStorage.setItem(`carbonos-backup-${timestamp}`, JSON.stringify(backupData));

      // Téléchargement du fichier
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = finalFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return finalFilename;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  }

  /**
   * Restauration depuis un fichier
   */
  async restoreFromFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          resolve(data);
        } catch (error) {
          reject(new Error('Format de fichier invalide'));
        }
      };
      reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
      reader.readAsText(file);
    });
  }

  /**
   * Liste des sauvegardes disponibles
   */
  getAvailableBackups(): Array<{ timestamp: string; size: number }> {
    const backups: Array<{ timestamp: string; size: number }> = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('carbonos-backup-')) {
        const data = localStorage.getItem(key);
        if (data) {
          backups.push({
            timestamp: key.replace('carbonos-backup-', ''),
            size: data.length,
          });
        }
      }
    }

    return backups.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }
}

// Instances singleton
export const exportService = new ExportService();
export const backupService = new BackupService();