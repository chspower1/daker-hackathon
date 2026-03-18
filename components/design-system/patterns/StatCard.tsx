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
    <Card className="hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between border-b-4 border-content-base pb-4 mb-4">
          <h4 className="text-xl font-black uppercase tracking-widest text-content-base">{title}</h4>
          {icon && <div className="h-8 w-8 text-content-base bg-yellow-300 border-2 border-content-base flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{icon}</div>}
        </div>
        <div className="mt-2 flex flex-col md:flex-row md:items-baseline gap-4">
          <p className="text-5xl font-black text-content-base tracking-tighter">{value}</p>
          {trend && (
            <div className="flex flex-col">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-1 text-sm font-black uppercase tracking-widest border-2 border-content-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-fit",
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

