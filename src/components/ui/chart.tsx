"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import type { TooltipContentProps } from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    color?: string;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border [&_.recharts-tooltip-cursor]:stroke-border [&_.recharts-layer]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(
    ([, value]) => value.color,
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `[data-chart=${id}] {${colorConfig
          .map(([key, value]) => `--color-${key}: ${value.color};`)
          .join("")}}`,
      }}
    />
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip;
const ChartLineChart = RechartsPrimitive.LineChart;
const ChartLine = RechartsPrimitive.Line;
const ChartCartesianGrid = RechartsPrimitive.CartesianGrid;
const ChartXAxis = RechartsPrimitive.XAxis;
const ChartYAxis = RechartsPrimitive.YAxis;

function ChartTooltipContent({
  active,
  payload,
  className,
}: Partial<TooltipContentProps> &
  Pick<React.ComponentProps<"div">, "className">) {
  const { config } = useChart();

  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-background px-3 py-2 text-xs shadow-md",
        className,
      )}
    >
      {payload.map((item) => {
        const key = String(item.dataKey || "");
        const label = config[key]?.label || key;
        return (
          <div key={key} className="flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{label}:</span>
            <span className="font-medium">{item.value ?? "--"}</span>
          </div>
        );
      })}
    </div>
  );
}

export {
  ChartCartesianGrid,
  ChartContainer,
  ChartLine,
  ChartLineChart,
  ChartTooltip,
  ChartTooltipContent,
  ChartXAxis,
  ChartYAxis,
};
