import * as React from "react";
import { cn } from "@/lib/cn";
import { Card, CardContent } from "../primitives/Card";

export interface StatCardProps {
  title: string;
  value: string;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  icon?: React.ReactNode;
}

export function StatCard({ title, value, trend, icon }: StatCardProps) {
  return (
    <Card className="hover:-translate-y-0.5 transition-transform duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-content-subtle">{title}</h4>
          {icon && <div className="h-4 w-4 text-content-muted">{icon}</div>}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-3xl font-semibold text-content-base tracking-tight">{value}</p>
          {trend && (
            <span
              className={cn(
                "flex items-center text-sm font-medium",
                trend.isPositive ? "text-success-content" : "text-danger-content"
              )}
            >
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
          )}
        </div>
        {trend && <p className="text-xs text-content-subtle mt-1">{trend.label}</p>}
      </CardContent>
    </Card>
  );
}
