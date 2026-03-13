import { AppShell } from "@/components/design-system/patterns/AppShell";
import { PageHeader } from "@/components/design-system/patterns/PageHeader";
import { StatCard } from "@/components/design-system/patterns/StatCard";
import { Button } from "@/components/design-system/primitives/Button";
import { Input } from "@/components/design-system/primitives/Input";
import { Badge } from "@/components/design-system/primitives/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/design-system/primitives/Card";
import { Alert } from "@/components/design-system/primitives/Alert";

// New Component Imports
import { Textarea } from "@/components/design-system/primitives/Textarea";
import { Select } from "@/components/design-system/primitives/Select";
import { Checkbox } from "@/components/design-system/primitives/Checkbox";
import { DataTable, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/design-system/primitives/DataTable";
import { LoadingState } from "@/components/design-system/patterns/LoadingState";
import { ErrorState } from "@/components/design-system/patterns/ErrorState";
import { FormField } from "@/components/design-system/patterns/FormField";
import { FilterBar } from "@/components/design-system/patterns/FilterBar";
import { SectionNav } from "@/components/design-system/patterns/SectionNav";
import { KeyValueList } from "@/components/design-system/patterns/KeyValueList";
import { ActionGate } from "@/components/design-system/patterns/ActionGate";

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
                  <label htmlFor="notes-input" className="block text-sm font-medium text-content-base">Notes</label>
                  <Textarea id="notes-input" placeholder="Enter notes..." />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="role-select" className="block text-sm font-medium text-content-base">Role</label>
                  <Select id="role-select">
                    <option>Admin</option>
                    <option>Editor</option>
                    <option>Viewer</option>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="terms" />
                  <label htmlFor="terms" className="text-sm font-medium leading-none text-content-base">
                    Accept terms and conditions
                  </label>
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
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Data Table</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">1</TableCell>
                      <TableCell>Alpha Squad</TableCell>
                      <TableCell>98.5</TableCell>
                      <TableCell><Badge variant="success">Active</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">2</TableCell>
                      <TableCell>Beta Boys</TableCell>
                      <TableCell>94.2</TableCell>
                      <TableCell><Badge variant="info">Reviewing</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">3</TableCell>
                      <TableCell>Charlie Ops</TableCell>
                      <TableCell>88.0</TableCell>
                      <TableCell><Badge variant="warning">Pending</Badge></TableCell>
                    </TableRow>
                  </TableBody>
                </DataTable>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Patterns Section */}
        <section className="space-y-6 animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
          <h2 className="text-2xl font-semibold tracking-tight text-content-base border-b border-border-base pb-2">Patterns (Composed)</h2>
          
          <SectionNav 
            items={[
              { id: "overview", label: "Overview", active: true },
              { id: "analytics", label: "Analytics" },
              { id: "reports", label: "Reports" },
              { id: "settings", label: "Settings" }
            ]} 
            className="mb-6"
          />

          <FilterBar 
            searchId="pattern-filter-search"
            searchLabel="Filter showcase items"
            filters={[
              { id: "status", label: "Status", options: [{ value: "active", label: "Active" }, { value: "archived", label: "Archived" }] },
              { id: "role", label: "Role", options: [{ value: "admin", label: "Admin" }, { value: "user", label: "User" }] }
            ]}
          />

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
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
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Rich Form Composition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField 
                  htmlFor="project-name"
                  label="Project Name" 
                  description="This will be publicly visible."
                  required
                >
                  <Input id="project-name" placeholder="Enter project name" />
                </FormField>
                <FormField 
                  htmlFor="project-description"
                  label="Description" 
                  error="Description is too short."
                >
                  <Textarea id="project-description" placeholder="Describe your project" error aria-invalid="true" />
                </FormField>
                <Button className="w-full">Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Value List</CardTitle>
              </CardHeader>
              <CardContent>
                <KeyValueList 
                  items={[
                    { id: "deployment", label: "Deployment", value: "Production" },
                    { id: "region", label: "Region", value: "us-east-1" },
                    { id: "version", label: "Version", value: "v2.4.1" },
                    { id: "updated-at", label: "Last Updated", value: "2 hours ago" },
                    { id: "status", label: "Status", value: <Badge variant="success">Healthy</Badge> }
                  ]}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Loading State</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <LoadingState />
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Error State</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <ErrorState />
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <ActionGate 
              isAllowed={false} 
              title="Authentication Required" 
              description="You must create a profile before you can submit a project."
              actionLabel="Create Profile"
            >
              <div>Hidden Content</div>
            </ActionGate>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
