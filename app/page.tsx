import * as React from "react";
import { AppShell } from "@/components/design-system/patterns/AppShell";
import { PageHeader } from "@/components/design-system/patterns/PageHeader";
import { StatCard } from "@/components/design-system/patterns/StatCard";
import { EmptyState } from "@/components/design-system/patterns/EmptyState";
import { Button } from "@/components/design-system/primitives/Button";
import { Input } from "@/components/design-system/primitives/Input";
import { Badge } from "@/components/design-system/primitives/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/design-system/primitives/Card";
import { Alert } from "@/components/design-system/primitives/Alert";

export default function Home() {
  return (
    <AppShell>
      <PageHeader
        title="Design System Foundation"
        description="A cohesive component preview grounded in semantic tokens for a refined enterprise SaaS."
        actions={
          <>
            <Button variant="outline">View Source</Button>
            <Button>Documentation</Button>
          </>
        }
      />

      <div className="space-y-16 pb-16">
        
        {/* Foundations Section */}
        <div className="space-y-8 animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
          <h2 className="text-2xl font-semibold tracking-tight text-content-base border-b border-border-base pb-2">Foundations</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Color Tokens */}
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-content-base">Color Tokens</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-12 w-full bg-primary-base rounded-md border border-border-base shadow-sm" />
                  <p className="text-xs font-medium text-content-muted">Primary Base</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 w-full bg-surface-base rounded-md border border-border-base shadow-sm" />
                  <p className="text-xs font-medium text-content-muted">Surface Base</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 w-full bg-content-base rounded-md border border-border-base shadow-sm" />
                  <p className="text-xs font-medium text-content-muted">Content Base</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 w-full bg-surface-muted rounded-md border border-border-base shadow-sm" />
                  <p className="text-xs font-medium text-content-muted">Surface Muted</p>
                </div>
              </div>
            </section>

            {/* Typography */}
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-content-base">Typography</h3>
              <div className="space-y-4 p-6 border border-border-base rounded-xl bg-surface-base shadow-sm">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-content-base">Heading 1</h1>
                  <p className="text-xs text-content-subtle mt-1">3xl / Bold / Tight Tracking</p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-content-base">Heading 2</h2>
                  <p className="text-xs text-content-subtle mt-1">2xl / Semibold / Tight Tracking</p>
                </div>
                <div>
                  <p className="text-base text-content-base">Body Base: The quick brown fox jumps over the lazy dog. Enterprise interfaces prioritize readability.</p>
                  <p className="text-xs text-content-subtle mt-1">Base / Normal</p>
                </div>
                <div>
                  <p className="text-sm text-content-muted">Body Small: Used for secondary information, helper text, and metadata.</p>
                  <p className="text-xs text-content-subtle mt-1">Small / Muted</p>
                </div>
              </div>
            </section>

            {/* Spacing & Radius */}
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-content-base">Spacing & Radius</h3>
              <div className="flex flex-wrap gap-4 items-end p-6 border border-border-base rounded-xl bg-surface-base shadow-sm">
                <div className="space-y-2 text-center">
                  <div className="w-8 h-8 bg-primary-subtle border border-primary-base/20 rounded-sm mx-auto" />
                  <p className="text-xs text-content-subtle">SM (2)</p>
                </div>
                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 bg-primary-subtle border border-primary-base/20 rounded-md mx-auto" />
                  <p className="text-xs text-content-subtle">MD (3)</p>
                </div>
                <div className="space-y-2 text-center">
                  <div className="w-16 h-16 bg-primary-subtle border border-primary-base/20 rounded-lg mx-auto" />
                  <p className="text-xs text-content-subtle">LG (4)</p>
                </div>
                <div className="space-y-2 text-center">
                  <div className="w-20 h-20 bg-primary-subtle border border-primary-base/20 rounded-xl mx-auto" />
                  <p className="text-xs text-content-subtle">XL (5)</p>
                </div>
              </div>
            </section>

            {/* Motion */}
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-content-base">Motion & Interaction</h3>
              <div className="p-6 border border-border-base rounded-xl bg-surface-base shadow-sm flex items-center gap-6">
                <Card className="w-32 h-32 flex flex-col items-center justify-center cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                  <span className="text-sm font-medium text-content-base">Hover me</span>
                  <span className="text-xs text-content-subtle mt-1 text-center">translate-y-1<br/>shadow-md</span>
                </Card>
                <div className="space-y-2">
                  <p className="text-sm text-content-base font-medium">Subtle Transitions</p>
                  <p className="text-sm text-content-muted max-w-xs">Components use duration-200 for standard state changes and translate-y for lift effects. Reduced motion is respected.</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Primitives Section */}
        <section className="space-y-6 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
          <h2 className="text-2xl font-semibold tracking-tight text-content-base border-b border-border-base pb-2">Primitives</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4 items-center">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inputs & Forms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email-input" className="block text-sm font-medium text-content-base">Email address</label>
                  <Input id="email-input" placeholder="Enter your email" type="email" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="error-input" className="block text-sm font-medium text-content-base">Username</label>
                  <Input id="error-input" placeholder="Error state" error defaultValue="invalid@email" aria-invalid="true" aria-describedby="error-message" />
                  <p id="error-message" className="text-xs text-danger-content font-medium">This username is already taken.</p>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="disabled-input" className="block text-sm font-medium text-content-muted">Workspace (Disabled)</label>
                  <Input id="disabled-input" placeholder="Disabled state" disabled value="Acme Corp" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert title="Update available" variant="default">
                  A new software update is ready to install.
                </Alert>
                <Alert title="Payment failed" variant="danger">
                  Please update your payment method to continue.
                </Alert>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Patterns Section */}
        <section className="space-y-6 animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
          <h2 className="text-2xl font-semibold tracking-tight text-content-base border-b border-border-base pb-2">Patterns (Composed)</h2>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard 
              title="Total Revenue" 
              value="$45,231.89" 
              trend={{ value: 20.1, label: "from last month", isPositive: true }} 
            />
            <StatCard 
              title="Active Users" 
              value="2,350" 
              trend={{ value: 4.5, label: "from last month", isPositive: false }} 
            />
            <StatCard 
              title="Pending Tickets" 
              value="12" 
            />
          </div>

          <Card className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-border-base gap-4">
              <h3 className="text-sm font-semibold text-content-base">Users List</h3>
              <div className="flex items-center gap-2">
                <label htmlFor="filter-input" className="sr-only">Filter users</label>
                <Input id="filter-input" placeholder="Filter users..." className="max-w-[200px] h-8 text-xs" />
                <Button size="sm" variant="outline">Filter</Button>
              </div>
            </div>
            <div className="p-8">
              <EmptyState 
                title="No users found"
                description="Get started by creating a new user or adjusting your filters."
                actionLabel="Create User"
              />
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
