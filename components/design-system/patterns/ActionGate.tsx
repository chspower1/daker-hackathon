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
    <Card className="max-w-md mx-auto my-8 border-dashed border-2 bg-surface-muted/50">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-content-muted">{description}</p>
        {actionLabel ? (
          <Button onClick={onAction} disabled={!onAction} className="w-full">
            {actionLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
