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
    <Card className="max-w-md mx-auto my-12 border-8 border-content-base bg-yellow-300 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg]">
      <CardHeader className="bg-content-base text-white border-b-4 border-content-base">
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <p className="text-lg font-bold text-content-base leading-relaxed">{description}</p>
        {actionLabel ? (
          <Button variant="brutal" onClick={onAction} disabled={!onAction} className="w-full bg-white text-content-base border-4 border-content-base h-16 text-xl">
            {actionLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

