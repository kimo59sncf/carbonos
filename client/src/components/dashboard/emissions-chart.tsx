import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { useState } from "react";

export interface EmissionDataPoint {
  name: string;
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
}

interface EmissionsChartProps {
  data: EmissionDataPoint[];
}

export function EmissionsChart({ data }: EmissionsChartProps) {
  const [timeFrame, setTimeFrame] = useState<'month' | 'quarter' | 'year'>('month');
  
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-neutral-200 shadow-md rounded-md">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center text-sm">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="mr-2">{entry.name}:</span>
              <span className="font-medium">{entry.value} tCO₂e</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle>Évolution des émissions</CardTitle>
          <div className="flex space-x-2">
            <button 
              className={`text-sm px-3 py-1 rounded-full font-medium ${timeFrame === 'month' ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-100'}`}
              onClick={() => setTimeFrame('month')}
            >
              Mois
            </button>
            <button 
              className={`text-sm px-3 py-1 rounded-full font-medium ${timeFrame === 'quarter' ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-100'}`}
              onClick={() => setTimeFrame('quarter')}
            >
              Trimestre
            </button>
            <button 
              className={`text-sm px-3 py-1 rounded-full font-medium ${timeFrame === 'year' ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-100'}`}
              onClick={() => setTimeFrame('year')}
            >
              Année
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="scope1" name="Scope 1" stroke="#3b82f6" strokeWidth={2} dot={{ strokeWidth: 2 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="scope2" name="Scope 2" stroke="#22c55e" strokeWidth={2} dot={{ strokeWidth: 2 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="scope3" name="Scope 3" stroke="#a855f7" strokeWidth={2} dot={{ strokeWidth: 2 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-center space-x-6">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            <span className="text-sm text-neutral-600">Scope 1</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm text-neutral-600">Scope 2</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
            <span className="text-sm text-neutral-600">Scope 3</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default EmissionsChart;
