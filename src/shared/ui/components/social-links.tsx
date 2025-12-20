"use client";

import { Mail } from "lucide-react";

import { Button } from "@/shared/ui/reusable/button";

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Button variant="outline" size="icon" aria-label="Email">
        <Mail className="size-4" />
      </Button>
    </div>
  );
}
