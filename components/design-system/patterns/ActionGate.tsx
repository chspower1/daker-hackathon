"use client";
import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/design-system/primitives/Card";
import { Button } from "@/components/design-system/primitives/Button";

interface ActionGateProps {
  isAllowed: boolean;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}

export function ActionGate({
  isAllowed,
  title,
  description,
  actionLabel,
  onAction,
  children
}: ActionGateProps) {
  if (isAllowed) {
    return <>{children}</>;
  }

  return (
    <Card className="max-w-xl mx-auto my-12 border border-border-base/60 bg-surface-base/80 backdrop-blur-xl shadow-xl shadow-slate-200/30 rounded-3xl overflow-hidden transition-all duration-500 ring-1 ring-white/50">
      <CardHeader className="bg-surface-muted/50 border-b border-border-muted/50 pb-6 px-8 pt-8">
        <CardTitle className="text-2xl font-bold tracking-tight text-content-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-8 bg-transparent">
        <p className="text-base text-content-subtle leading-relaxed">{description}</p>
        {actionLabel ? (
          <Button variant="primary" onClick={onAction} disabled={!onAction} className="w-full h-12 text-base font-semibold rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-xl transition-all">
            {actionLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

