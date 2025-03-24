import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

export interface BenchmarkItem {
  indicator: string;
  value: string;
  average: string;
  position: 'top25' | 'median' | 'bottom33';
}

interface BenchmarkTableProps {
  benchmarks: BenchmarkItem[];
  sectors: string[];
}

export function BenchmarkTable({ benchmarks, sectors }: BenchmarkTableProps) {
  const [selectedSector, setSelectedSector] = useState(sectors[0]);

  const getPositionLabel = (position: string) => {
    switch (position) {
      case 'top25':
        return { label: 'Top 25%', class: 'bg-success bg-opacity-10 text-success' };
      case 'median':
        return { label: 'Médiane', class: 'bg-warning bg-opacity-10 text-warning' };
      case 'bottom33':
        return { label: 'Dernier tiers', class: 'bg-red-500 bg-opacity-10 text-red-500' };
      default:
        return { label: 'Non classé', class: 'bg-neutral-200 text-neutral-600' };
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle>Benchmark sectoriel</CardTitle>
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-[180px] h-9 text-sm">
              <SelectValue placeholder="Sélectionner un secteur" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>{sector}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-neutral-50 text-xs font-medium text-neutral-500 uppercase">Indicateur</TableHead>
                <TableHead className="bg-neutral-50 text-xs font-medium text-neutral-500 uppercase">Votre entreprise</TableHead>
                <TableHead className="bg-neutral-50 text-xs font-medium text-neutral-500 uppercase">Moyenne sectorielle</TableHead>
                <TableHead className="bg-neutral-50 text-xs font-medium text-neutral-500 uppercase">Position</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benchmarks.map((benchmark, index) => {
                const position = getPositionLabel(benchmark.position);
                return (
                  <TableRow key={index}>
                    <TableCell className="whitespace-nowrap text-sm text-neutral-800">{benchmark.indicator}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-neutral-800">{benchmark.value}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-neutral-800">{benchmark.average}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium ${position.class} rounded-full`}>
                        {position.label}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-neutral-500">
          <p><i className="fas fa-info-circle mr-1"></i> Les données sont anonymisées et agrégées pour respecter le RGPD. Basé sur 128 entreprises de votre secteur.</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default BenchmarkTable;
