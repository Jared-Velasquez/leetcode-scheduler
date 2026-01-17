"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  PATTERNS,
  getPatternById,
  isValidPatternId,
  isValidSubpattern,
  type PatternIdType,
  type SubpatternIdType,
} from "@/lib/constants/patterns";

export function PatternCombobox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);

  // Get and validate current selection from URL
  const patternParam = searchParams.get("pattern");
  const subpatternParam = searchParams.get("subpattern");

  // Validate and get current selections
  const selectedPattern = React.useMemo(() => {
    if (patternParam && isValidPatternId(patternParam)) {
      return patternParam as PatternIdType;
    }
    return null;
  }, [patternParam]);

  const selectedSubpattern = React.useMemo(() => {
    if (
      selectedPattern &&
      subpatternParam &&
      isValidSubpattern(selectedPattern, subpatternParam)
    ) {
      return subpatternParam as SubpatternIdType;
    }
    return null;
  }, [selectedPattern, subpatternParam]);

  // Redirect to base path if invalid pattern-subpattern relationship
  React.useEffect(() => {
    const hasInvalidPattern = patternParam && !isValidPatternId(patternParam);
    const hasInvalidSubpattern =
      subpatternParam &&
      (!selectedPattern || !isValidSubpattern(selectedPattern, subpatternParam));

    if (hasInvalidPattern || hasInvalidSubpattern) {
      router.replace("/problems");
    }
  }, [patternParam, subpatternParam, selectedPattern, router]);

  // Get display labels
  const patternLabel = selectedPattern
    ? getPatternById(selectedPattern)?.label
    : null;
  const subpatternLabel = selectedSubpattern
    ? getPatternById(selectedPattern!)?.subpatterns.find(
        (s) => s.id === selectedSubpattern
      )?.label
    : null;

  // Update URL with new selection
  const updateSelection = React.useCallback(
    (pattern: PatternIdType | null, subpattern: SubpatternIdType | null) => {
      const params = new URLSearchParams();
      if (pattern) {
        params.set("pattern", pattern);
        if (subpattern) {
          params.set("subpattern", subpattern);
        }
      }
      const queryString = params.toString();
      router.push(queryString ? `/problems?${queryString}` : "/problems");
    },
    [router]
  );

  // Handle pattern selection
  const handlePatternSelect = (patternId: PatternIdType) => {
    if (patternId === selectedPattern) {
      // Deselect if clicking the same pattern
      updateSelection(null, null);
    } else {
      // Select new pattern, clear subpattern
      updateSelection(patternId, null);
    }
    // Don't close if pattern has subpatterns
    const pattern = getPatternById(patternId);
    if (!pattern?.subpatterns.length) {
      setOpen(false);
    }
  };

  // Handle subpattern selection
  const handleSubpatternSelect = (subpatternId: SubpatternIdType) => {
    if (!selectedPattern) return;

    if (subpatternId === selectedSubpattern) {
      // Deselect subpattern but keep pattern
      updateSelection(selectedPattern, null);
    } else {
      updateSelection(selectedPattern, subpatternId);
    }
    setOpen(false);
  };

  // Clear all selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateSelection(null, null);
  };

  // Get display text for button
  const getDisplayText = () => {
    if (!patternLabel) return "Select pattern...";
    if (subpatternLabel) return `${patternLabel} > ${subpatternLabel}`;
    return patternLabel;
  };

  // Get subpatterns for currently selected pattern
  const currentSubpatterns = selectedPattern
    ? getPatternById(selectedPattern)?.subpatterns ?? []
    : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between md:w-[300px]"
        >
          <span className="truncate">{getDisplayText()}</span>
          <div className="flex items-center gap-1">
            {selectedPattern && (
              <X
                className="size-4 shrink-0 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search patterns..." />
          <CommandList>
            <CommandEmpty>No pattern found.</CommandEmpty>
            <CommandGroup heading="Patterns">
              {PATTERNS.map((pattern) => (
                <CommandItem
                  key={pattern.id}
                  value={pattern.label}
                  onSelect={() => handlePatternSelect(pattern.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      selectedPattern === pattern.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {pattern.label}
                  {pattern.subpatterns.length > 0 && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {pattern.subpatterns.length} sub
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            {selectedPattern && currentSubpatterns.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Subpatterns">
                  {currentSubpatterns.map((subpattern) => (
                    <CommandItem
                      key={subpattern.id}
                      value={subpattern.label}
                      onSelect={() => handleSubpatternSelect(subpattern.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          selectedSubpattern === subpattern.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {subpattern.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
