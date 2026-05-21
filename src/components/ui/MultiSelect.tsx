'use client';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import React from "react";

/* -------------------- Types -------------------- */
type Option = {
    label: string;
    value: string;
};

/* -------------------- Multi Select Component -------------------- */
export function MultiSelect({
    options,
    placeholder,
    value,
    onChange,
}: {
    options: Option[];
    placeholder: string;
    value: string[];
    onChange: (value: string[]) => void;
}) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >
                    {value.length
                        ? `${value.length} selected`
                        : placeholder}
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandEmpty>No results found</CommandEmpty>

                    <CommandGroup>
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                onSelect={() => {
                                    if (value.includes(option.value)) {
                                        onChange(
                                            value.filter(
                                                (v) => v !== option.value
                                            )
                                        );
                                    } else {
                                        onChange([...value, option.value]);
                                    }
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value.includes(option.value)
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}