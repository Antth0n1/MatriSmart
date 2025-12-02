import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { ClassRoom, EducationLevel } from '../types';

interface LevelOccupancyChartProps {
  classes: ClassRoom[];
  isDarkMode?: boolean;
}

export const LevelOccupancyChart: React.FC<LevelOccupancyChartProps> = ({ classes, isDarkMode = false }) => {
  const data = useMemo(() => {
    // Initialize stats for all known levels to ensure they appear even if empty
    const stats: Record<string, { capacity: number; enrolled: number; laudados: number; color: string }> = {
      [EducationLevel.INFANTIL]: { capacity: 0, enrolled: 0, laudados: 0, color: '#ec4899' }, // Pink
      [EducationLevel.FUNDAMENTAL_1]: { capacity: 0, enrolled: 0, laudados: 0, color: '#06b6d4' }, // Cyan
      [EducationLevel.FUNDAMENTAL_2]: { capacity: 0, enrolled: 0, laudados: 0, color: '#14b8a6' }, // Teal
      [EducationLevel.ENSINO_MEDIO]: { capacity: 0, enrolled: 0, laudados: 0, color: '#8b5cf6' }, // Violet
    };

    classes.forEach(c => {
      if (stats[c.level]) {
        stats[c.level].capacity += c.capacity;
        stats[c.level].enrolled += c.enrolled;
        stats[c.level].laudados += (c.laudados || 0);
      }
    });

    return Object.entries(stats).map(([level, val]) => ({
      name: level,
      // Abbreviate names for cleaner x-axis and legend
      shortName: level === EducationLevel.ENSINO_MEDIO ? 'Médio' : level.replace('Fundamental', 'Fund.'),
      occupancy: val.capacity > 0 ? Math.round((val.enrolled / val.capacity) * 100) : 0,
      capacity: val.capacity,
      enrolled: val.enrolled,
      laudados: val.laudados,
      color: val.color
    }));
  }, [classes]);

  const textColor = isDarkMode ? '#9CA3AF' : '#4B5563';
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const laudadosColor = isDarkMode ? '#a78bfa' : '#7c3aed';

  // Construct custom legend payload
  const legendPayload = useMemo(() => {
    const items = data.map(item => ({
      value: item.shortName,
      type: 'circle' as const,
      id: item.name,
      color: item.color
    }));

    // Add Laudados entry separately
    items.push({
      value: 'Alunos Laudados',
      type: 'circle' as const,
      id: 'laudados',
      color: laudadosColor
    });

    return items;
  }, [data, laudadosColor]);
  
  return (
    <div className="h-80 w-full animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barGap={4}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
          
          <XAxis type="number" hide />
          
          <YAxis 
            dataKey="shortName" 
            type="category" 
            width={70}
            tick={{fontSize: 11, fill: textColor, fontWeight: 500}} 
            axisLine={false}
            tickLine={false}
          />
          
          <Tooltip 
            cursor={{fill: isDarkMode ? '#374151' : '#F3F4F6'}}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="p-3 border shadow-lg rounded-lg" style={{ backgroundColor: tooltipBg, borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
                    <p className="font-bold mb-2 border-b pb-1" style={{ color: isDarkMode ? '#F9FAFB' : '#1f2937' }}>{data.name}</p>
                    
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: data.color }}></div>
                      <p className="text-sm" style={{ color: isDarkMode ? '#D1D5DB' : '#4b5563' }}>
                        Matriculados: <span className="font-bold">{data.enrolled}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: laudadosColor }}></div>
                      <p className="text-sm" style={{ color: isDarkMode ? '#D1D5DB' : '#4b5563' }}>
                        Laudados: <span className="font-bold">{data.laudados}</span>
                      </p>
                    </div>

                    <p className="text-xs mt-2 pt-1 border-t border-gray-100 dark:border-gray-700" style={{ color: isDarkMode ? '#9CA3AF' : '#6b7280' }}>
                      Capacidade Total: {data.capacity} (Ocupação: {data.occupancy}%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          
          <Legend 
            verticalAlign="top" 
            height={50} 
            content={() => {
              return (
                <div className="flex flex-wrap justify-center gap-4 w-full mb-2" style={{ paddingBottom: '10px' }}>
                  {legendPayload.map((entry, index) => (
                    <div key={`item-${index}`} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span 
                        className="text-[11px] font-semibold"
                        style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
                      >
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              );
            }}
          />

          <Bar 
            dataKey="enrolled" 
            name="Matriculados" 
            radius={[0, 4, 4, 0]} 
            barSize={16}
          >
             {data.map((entry, index) => (
                <Cell key={`cell-enrolled-${index}`} fill={entry.color} />
              ))}
          </Bar>
          
          <Bar 
            dataKey="laudados" 
            name="Laudados" 
            fill={laudadosColor}
            radius={[0, 4, 4, 0]} 
            barSize={16} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};