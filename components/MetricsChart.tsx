import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ClassRoom } from '../types';

interface MetricsChartProps {
  classes: ClassRoom[];
  isDarkMode?: boolean;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({ classes, isDarkMode = false }) => {
  // Logic to determine if we should aggregate by Grade or show individual classes
  // If we have many classes (overview), we group by Grade. 
  // If the user filtered and there are few, we show details.
  const shouldAggregate = classes.length > 12;

  const data = useMemo(() => {
    if (shouldAggregate) {
      // Aggregation Logic: Group by Grade (e.g., "1º Ano")
      const groupedMap = new Map<string, { 
        name: string; 
        Matriculados: number; 
        Vagas: number; 
        Capacity: number;
        turmasCount: number;
      }>();

      classes.forEach(c => {
        if (!groupedMap.has(c.grade)) {
          groupedMap.set(c.grade, {
            name: c.grade,
            Matriculados: 0,
            Vagas: 0,
            Capacity: 0,
            turmasCount: 0
          });
        }
        const entry = groupedMap.get(c.grade)!;
        entry.Matriculados += c.enrolled;
        entry.Vagas += (c.capacity - c.enrolled);
        entry.Capacity += c.capacity;
        entry.turmasCount += 1;
      });

      return Array.from(groupedMap.values());
    } else {
      // Detailed Logic: Show individual classes
      return classes.map(c => {
        const gradeShort = c.grade.length > 10 ? c.grade.substring(0, 10) + '...' : c.grade;
        return {
          name: `${gradeShort} ${c.name}`,
          fullName: `${c.grade} - Turma ${c.name} (${c.shift})`,
          Matriculados: c.enrolled,
          Vagas: c.capacity - c.enrolled,
          Capacity: c.capacity,
          isIndividual: true
        };
      });
    }
  }, [classes, shouldAggregate]);

  const textColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const tooltipText = isDarkMode ? '#F3F4F6' : '#1F2937';

  return (
    <div className="h-72 w-full animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 20, // Increased bottom margin for rotated labels
          }}
          barGap={2}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 11, fill: textColor}} 
            interval={0} 
            angle={shouldAggregate ? -30 : -45} // Rotate labels to avoid overlap
            textAnchor="end"
            height={60}
          />
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 12, fill: textColor}} 
          />
          
          <Tooltip 
            cursor={{fill: isDarkMode ? '#374151' : '#F3F4F6'}}
            contentStyle={{
              backgroundColor: tooltipBg, 
              color: tooltipText,
              borderRadius: '12px', 
              border: isDarkMode ? '1px solid #374151' : 'none', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              padding: '12px'
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                const dataItem = payload[0].payload;
                if (dataItem.isIndividual) return dataItem.fullName;
                return `${label} (Total)`;
              }
              return label;
            }}
            formatter={(value: number, name: string, props: any) => {
               if (name === "Vagas") return [value, "Vagas Disponíveis"];
               if (name === "Matriculados") return [value, "Alunos Matriculados"];
               return [value, name];
            }}
          />
          
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ paddingTop: '0px', paddingBottom: '10px' }} 
          />
          
          <Bar 
            dataKey="Matriculados" 
            stackId="a" 
            fill="#4F46E5" 
            radius={shouldAggregate ? [0, 0, 0, 0] : [0, 0, 4, 4]} 
            barSize={shouldAggregate ? 24 : 12} // Thicker bars when aggregated
            animationDuration={1000}
          />
          
          <Bar 
            dataKey="Vagas" 
            stackId="a" 
            fill={isDarkMode ? '#4B5563' : '#E5E7EB'} 
            radius={[4, 4, 0, 0]} 
            barSize={shouldAggregate ? 24 : 12}
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
