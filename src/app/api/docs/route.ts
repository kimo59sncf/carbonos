import { NextResponse } from 'next/server';
import { generateAPIDocs, generateTestSchema, openAPISpec } from '@/lib/openapi';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');

  switch (format) {
    case 'openapi':
      return NextResponse.json(openAPISpec);

    case 'tests':
      const testSchema = generateTestSchema();
      return new NextResponse(testSchema, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="carbonos-api-tests.json"',
        },
      });

    case 'html':
    default:
      const htmlDocs = generateAPIDocs();
      return new NextResponse(htmlDocs, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
  }
}