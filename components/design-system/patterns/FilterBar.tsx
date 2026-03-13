"use client";
import * as React from "react";
import { Input } from "@/components/design-system/primitives/Input";
import { Button } from "@/components/design-system/primitives/Button";
import { Select } from "@/components/design-system/primitives/Select";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

interface FilterBarProps {
  searchId?: string;
  searchLabel?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  filters?: FilterGroup[];
  onFilterChange?: (groupId: string, value: string) => void;
  onClear?: () => void;
}

export function FilterBar({
  searchId,
  searchLabel = "Search items",
  searchPlaceholder = "Search...",
  onSearchChange,
  filters = [],
  onFilterChange,
  onClear,
}: FilterBarProps) {
  const generatedSearchId = React.useId();
  const resolvedSearchId = searchId ?? generatedSearchId;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-surface-muted rounded-md border border-border-base">
      <div className="flex-1">
        <label htmlFor={resolvedSearchId} className="sr-only">
          {searchLabel}
        </label>
        <Input 
          id={resolvedSearchId}
          type="search" 
          placeholder={searchPlaceholder}
          aria-label={searchLabel}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="bg-surface-base"
        />
      </div>
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          {filters.map((filter) => (
            <Select 
              key={filter.id} 
              className="w-auto min-w-[120px]"
              aria-label={filter.label}
              onChange={(e) => onFilterChange?.(filter.id, e.target.value)}
            >
              <option value="">{filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          ))}
          {onClear && (
            <Button type="button" variant="ghost" onClick={onClear} className="text-sm h-10">
              Clear
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
