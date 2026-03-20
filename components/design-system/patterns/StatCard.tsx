"use client";
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
    <Card className="hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between border-b border-border-base pb-4 mb-4">
          <h4 className="text-xl font-medium text-content-base">{title}</h4>
          {icon && <div className="h-8 w-8 text-content-base bg-yellow-300 border border-border-base flex items-center justify-center shadow-md">{icon}</div>}
        </div>
        <div className="mt-2 flex flex-col md:flex-row md:items-baseline gap-4">
          <p className="text-5xl font-bold text-content-base tracking-tighter">{value}</p>
          {trend && (
            <div className="flex flex-col">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-1 text-sm font-bold st border border-border-base shadow-md w-fit",
                  trend.isPositive ? "bg-green-400 text-content-base" : "bg-red-400 text-content-base"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <p className="text-sm font-bold text-content-base mt-2">{trend.label}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

