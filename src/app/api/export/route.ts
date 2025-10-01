import { NextRequest, NextResponse } from 'next/server';
import { exportService, ExportData, ExportOptions } from '@/services/export-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, options }: { data: ExportData; options: ExportOptions } = body;

    if (!data || !options) {
      return NextResponse.json(
        { error: 'Données ou options manquantes' },
        { status: 400 }
      );
    }

    const blob = await exportService.exportReport(data, options);

    return new NextResponse(blob, {
      headers: {
        'Content-Type': getContentType(options.format),
        'Content-Disposition': `attachment; filename="rapport-carbone-${data.companyName}-${Date.now()}.${getFileExtension(options.format)}"`,
      },
    });
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'export' },
      { status: 500 }
    );
  }
}

function getContentType(format: ExportOptions['format']): string {
  switch (format) {
    case 'pdf':
      return 'application/pdf';
    case 'excel':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'csv':
      return 'text/csv';
    case 'json':
      return 'application/json';
    default:
      return 'application/octet-stream';
  }
}

function getFileExtension(format: ExportOptions['format']): string {
  switch (format) {
    case 'pdf':
      return 'pdf';
    case 'excel':
      return 'xlsx';
    case 'csv':
      return 'csv';
    case 'json':
      return 'json';
    default:
      return 'bin';
  }
}