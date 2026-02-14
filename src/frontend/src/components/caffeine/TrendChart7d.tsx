import { useMemo } from 'react';

interface TrendChart7dProps {
  dailyTotals: { date: string; total: number }[];
  dailyLimit: number;
}

export default function TrendChart7d({ dailyTotals, dailyLimit }: TrendChart7dProps) {
  const chartData = useMemo(() => {
    const maxValue = Math.max(...dailyTotals.map(d => d.total), dailyLimit);
    const chartHeight = 200;
    const barWidth = 40;
    const gap = 12;
    const chartWidth = dailyTotals.length * (barWidth + gap);

    return {
      maxValue,
      chartHeight,
      barWidth,
      gap,
      chartWidth,
      bars: dailyTotals.map((day, index) => ({
        ...day,
        height: maxValue > 0 ? (day.total / maxValue) * chartHeight : 0,
        x: index * (barWidth + gap),
      })),
    };
  }, [dailyTotals, dailyLimit]);

  const limitLineY = chartData.maxValue > 0 
    ? chartData.chartHeight - (dailyLimit / chartData.maxValue) * chartData.chartHeight 
    : chartData.chartHeight;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width={Math.max(chartData.chartWidth, 400)}
        height={chartData.chartHeight + 60}
        className="mx-auto"
      >
        {/* Limit line */}
        {dailyLimit > 0 && (
          <>
            <line
              x1="0"
              y1={limitLineY}
              x2={chartData.chartWidth}
              y2={limitLineY}
              stroke="oklch(var(--destructive))"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.5"
            />
            <text
              x={chartData.chartWidth - 5}
              y={limitLineY - 5}
              fill="oklch(var(--destructive))"
              fontSize="12"
              textAnchor="end"
            >
              Limit: {dailyLimit}mg
            </text>
          </>
        )}

        {/* Bars */}
        {chartData.bars.map((bar, index) => {
          const isOverLimit = bar.total > dailyLimit;
          const barColor = isOverLimit 
            ? 'oklch(var(--destructive))' 
            : 'oklch(var(--chart-1))';

          return (
            <g key={index}>
              <rect
                x={bar.x}
                y={chartData.chartHeight - bar.height}
                width={chartData.barWidth}
                height={bar.height}
                fill={barColor}
                rx="4"
                opacity="0.8"
              />
              <text
                x={bar.x + chartData.barWidth / 2}
                y={chartData.chartHeight - bar.height - 5}
                fill="oklch(var(--foreground))"
                fontSize="12"
                textAnchor="middle"
                fontWeight="500"
              >
                {bar.total}
              </text>
              <text
                x={bar.x + chartData.barWidth / 2}
                y={chartData.chartHeight + 20}
                fill="oklch(var(--muted-foreground))"
                fontSize="11"
                textAnchor="middle"
              >
                {bar.date}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
