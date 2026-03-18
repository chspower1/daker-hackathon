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
    <div className="flex flex-col sm:flex-row gap-4 p-6 bg-content-base border-4 border-content-base shadow-[8px_8px_0px_0px_rgba(37,99,235,1)]">
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
          className="bg-white border-none rounded-none text-content-base font-bold placeholder:text-content-subtle"
        />
      </div>
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-4 items-center">
          {filters.map((filter) => (
            <Select 
              key={filter.id} 
              className="w-auto min-w-[120px] bg-white border-none rounded-none text-content-base font-bold"
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
            <Button type="button" variant="brutal" onClick={onClear} className="text-sm h-10 px-4 bg-red-400 hover:bg-red-500">
              Clear
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

