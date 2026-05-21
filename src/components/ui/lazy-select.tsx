"use client";

import React, { useRef, useCallback } from "react";
import { ChevronsUpDown, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

export interface LazySelectItem {
    id: string;
    label: string;
    sublabel?: string;
}

interface LazySelectProps {
    /** Currently selected item id */
    value: string;
    /** Callback when selection changes */
    onChange: (value: string) => void;
    /** Items to display in the dropdown */
    items: LazySelectItem[];
    /** Whether more items can be loaded */
    hasMore: boolean;
    /** Whether items are currently being loaded */
    loading: boolean;
    /** Called when the user scrolls to the bottom of the list */
    onLoadMore: () => void;
    /** Called when the user presses Enter in the search input */
    onSearch?: (query: string) => void;
    /** Placeholder text when no item is selected */
    placeholder?: string;
    /** Placeholder text for the search input */
    searchPlaceholder?: string;
    /** Text shown when no items match the search */
    emptyMessage?: string;
    /** Text shown at the bottom while loading more */
    loadingMoreMessage?: string;
    /** Disable the select */
    disabled?: boolean;
    /** Show error border */
    hasError?: boolean;
    /** Optional custom renderer for each item */
    renderItem?: (item: LazySelectItem, isSelected: boolean) => React.ReactNode;
    /** Optional custom renderer for the trigger (selected value display) */
    renderValue?: (item: LazySelectItem) => React.ReactNode;
    className?: string;
}

export default function LazySelect({
    value,
    onChange,
    items,
    hasMore,
    loading,
    onLoadMore,
    onSearch,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    emptyMessage = "No results found",
    loadingMoreMessage = "Loading more...",
    disabled,
    hasError,
    renderItem,
    renderValue,
    className,
}: LazySelectProps) {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const observerRef = useRef<IntersectionObserver | null>(null);

    const selectedItem = items.find((item) => item.id === value);

    // Callback ref — fires when the sentinel DOM node actually mounts/unmounts.
    // This avoids the useRef + useEffect timing issue where the element isn't
    // in the DOM yet when the effect runs.
    const sentinelCallbackRef = useCallback(
        (node: HTMLDivElement | null) => {
            // Disconnect any previous observer
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }

            // If the node unmounted or no more items, stop
            if (!node || !hasMore) return;

            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0]?.isIntersecting && !loading) {
                        onLoadMore();
                    }
                },
                { threshold: 0.1 },
            );

            observerRef.current.observe(node);
        },
        [hasMore, loading, onLoadMore],
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between bg-gray-50 dark:bg-dark-200 border-gray-200 dark:border-gray-700 h-12 rounded-xl font-normal",
                        !value && "text-muted-foreground",
                        hasError && "border-red-400",
                        className,
                    )}
                >
                    {selectedItem ? (
                        renderValue ? renderValue(selectedItem) : (
                            <span className="truncate">{selectedItem.label}</span>
                        )
                    ) : (
                        <span>{placeholder}</span>
                    )}
                    <ChevronsUpDown className="ml-2 rtl:ml-0 rtl:mr-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
                onWheel={(e) => e.stopPropagation()}
            >
                <Command shouldFilter={!onSearch}>
                    <CommandInput
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onValueChange={(nextValue) => {
                            setSearchQuery(nextValue);
                            if (onSearch && nextValue.trim() === "") {
                                onSearch("");
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && onSearch) {
                                e.preventDefault();
                                onSearch(searchQuery);
                            }
                        }}
                    />
                    <CommandList className="max-h-[200px] overscroll-contain">
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => {
                                const isSelected = value === item.id;
                                return (
                                    <CommandItem
                                        key={item.id}
                                        value={item.label}
                                        onSelect={() => {
                                            onChange(item.id);
                                            setOpen(false);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        {renderItem ? (
                                            renderItem(item, isSelected)
                                        ) : (
                                            <>
                                                <div className="flex flex-col flex-1">
                                                    <span className="text-sm font-medium">{item.label}</span>
                                                    {item.sublabel && (
                                                        <span className="text-xs text-muted-foreground">{item.sublabel}</span>
                                                    )}
                                                </div>
                                                <Check
                                                    className={cn(
                                                        "h-4 w-4 ml-auto",
                                                        isSelected ? "opacity-100" : "opacity-0",
                                                    )}
                                                />
                                            </>
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>

                        {/* Sentinel — OUTSIDE CommandGroup so cmdk doesn't filter/hide it.
                            Uses a callback ref so the observer attaches when the node actually
                            mounts to the DOM, not before. */}
                        {hasMore && (
                            <div ref={sentinelCallbackRef} className="py-2 flex items-center justify-center">
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                ) : (
                                    <span className="text-xs text-muted-foreground">⋯</span>
                                )}
                            </div>
                        )}

                        {/* Loading indicator when first page is loading */}
                        {loading && items.length === 0 && (
                            <div className="py-4 flex items-center justify-center">
                                <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
                                <span className="text-xs text-muted-foreground">{loadingMoreMessage}</span>
                            </div>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
