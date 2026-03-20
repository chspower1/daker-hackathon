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
    <Card className="max-w-md mx-auto my-12  bg-yellow-300 shadow-md rotate-[-1deg]">
      <CardHeader className="bg-content-base text-white border-b border-border-base">
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <p className="text-lg font-bold text-content-base leading-relaxed">{description}</p>
        {actionLabel ? (
          <Button variant="primary" onClick={onAction} disabled={!onAction} className="w-full bg-white text-content-base border border-border-base h-16 text-xl">
            {actionLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

