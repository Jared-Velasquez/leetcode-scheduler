import { PATTERNS } from "@/lib/constants/patterns";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import React from "react";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

export function Patterns() {
  return (
    <div className="flex w-full max-w-md xl:max-w-xl flex-col gap-6 mx-auto">
      <ItemGroup>
        {PATTERNS.map((pattern, index) => (
          <React.Fragment key={pattern.id}>
            <Link href={`/problems?pattern=${pattern.id}`}>
              <Item className="cursor-pointer hover:bg-muted/50 transition-colors">
                <ItemContent className="gap-1">
                  <ItemTitle className="text-lg font-semibold">
                    {pattern.label}
                  </ItemTitle>
                  {/* If item has subpatterns, include them in the ItemDescription */}
                  {pattern.subpatterns.length > 0 && (
                    <ItemDescription>
                      Sub:{" "}
                      {pattern.subpatterns.map((sub) => sub.label).join(", ")}
                    </ItemDescription>
                  )}
                </ItemContent>
                <ItemActions>
                  <ChevronRightIcon className="size-4" />
                </ItemActions>
              </Item>
            </Link>
            {index !== PATTERNS.length - 1 && <ItemSeparator />}
          </React.Fragment>
        ))}
      </ItemGroup>
    </div>
  );
}
