"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Cookie as CookieIcon } from "lucide-react";

import { Button } from "@/shared/ui/reusable/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/shared/ui/reusable/card";
import { Label } from "@/shared/ui/reusable/label";
import { Separator } from "@/shared/ui/reusable/separator";
import { Switch } from "@/shared/ui/reusable/switch";
import { useCookieConsent } from "@/shared/hooks/useCookieConsent";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/reusable/sheet";

function PreferencesContent({
  analytics,
  marketing,
  onToggle,
}: {
  analytics: boolean;
  marketing: boolean;
  onToggle: (key: "analytics" | "marketing", value: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium">Necessary</p>
          <p className="text-muted-foreground text-sm">
            Required for core functionality and cannot be disabled.
          </p>
        </div>
        <Switch checked disabled aria-label="Necessary cookies" />
      </div>
      <Separator />
      <div className="flex items-start justify-between gap-4">
        <div>
          <Label className="font-medium">Analytics</Label>
          <p className="text-muted-foreground text-sm">
            Helps us understand usage and improve performance.
          </p>
        </div>
        <Switch
          checked={analytics}
          onCheckedChange={(checked) => onToggle("analytics", checked === true)}
          aria-label="Analytics cookies"
        />
      </div>
      <Separator />
      <div className="flex items-start justify-between gap-4">
        <div>
          <Label className="font-medium">Marketing</Label>
          <p className="text-muted-foreground text-sm">
            Used to personalize content and measure campaigns.
          </p>
        </div>
        <Switch
          checked={marketing}
          onCheckedChange={(checked) => onToggle("marketing", checked === true)}
          aria-label="Marketing cookies"
        />
      </div>
    </div>
  );
}

export function CookieConsent() {
  const {
    preferences,
    shouldShowBanner,
    allowAll,
    rejectNonEssential,
    save,
    updatePreference,
  } = useCookieConsent();
  const [isManaging, setIsManaging] = useState(false);
  const [manageSheetOpen, setManageSheetOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const bannerClasses = useMemo(() => {
    if (isDesktop) {
      return "bg-card text-card-foreground fixed md:right-10 md:bottom-10 md:max-w-2xl max-md:top-1/2 max-md:-translate-y-1/2 max-sm:mx-4 sm:max-md:left-1/2 sm:max-md:-translate-x-1/2 z-40";
    }
    return "bg-card text-card-foreground fixed left-1/2 bottom-4 w-[calc(100%-2rem)] -translate-x-1/2 z-40 shadow-lg";
  }, [isDesktop]);

  const handleAllowAll = () => {
    allowAll();
  };

  const handleSave = () => {
    save();
  };

  const handleReject = () => {
    rejectNonEssential();
  };

  const handleManageToggle = (value: boolean) => {
    setIsManaging(value);
  };

  if (!shouldShowBanner) return null;

  if (!isDesktop) {
    return (
      <Card className={bannerClasses}>
        <CardContent className="flex items-start gap-4 p-4">
          <CookieIcon className="text-primary size-8 shrink-0" />
          <div className="flex flex-col gap-3 text-sm">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">We use cookies</CardTitle>
              <CardDescription className="text-sm">
                Allow all for the best experience. You can manage settings anytime.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={handleAllowAll}>
                Allow all
              </Button>
              <Button size="sm" variant="outline" onClick={handleReject}>
                Reject non-essential
              </Button>
              <Sheet open={manageSheetOpen} onOpenChange={setManageSheetOpen}>
                <SheetTrigger asChild>
                  <Button size="sm" variant="ghost">
                    Manage
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="space-y-4">
                  <SheetHeader>
                    <SheetTitle>Manage cookies</SheetTitle>
                    <SheetDescription>
                      Adjust optional cookies. Necessary remain enabled.
                    </SheetDescription>
                  </SheetHeader>
                  <PreferencesContent
                    analytics={preferences.analytics}
                    marketing={preferences.marketing}
                    onToggle={(key, value) => updatePreference(key, value)}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        handleSave();
                        setManageSheetOpen(false);
                      }}
                    >
                      Save preferences
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setManageSheetOpen(false)}>
                      Back
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={bannerClasses}>
      <CardContent className="flex gap-6 px-6 max-sm:flex-col">
        <CookieIcon className="text-primary size-10 shrink-0 grow" />
        <div className="flex flex-col gap-6">
          {isManaging ? (
            <>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-semibold">Manage cookies</CardTitle>
                <CardDescription className="text-base">
                  Adjust which optional cookies we can use. Necessary cookies stay enabled.
                  Review our{" "}
                  <Link href="#" className="text-primary underline">
                    Cookies Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary underline">
                    Privacy Policy
                  </Link>
                  .
                </CardDescription>
              </div>

              <div className="rounded-lg border bg-muted/40 p-4">
                <PreferencesContent
                  analytics={preferences.analytics}
                  marketing={preferences.marketing}
                  onToggle={(key, value) => updatePreference(key, value)}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={handleSave}>
                  Save preferences
                </Button>
                <Button size="lg" variant="ghost" onClick={() => handleManageToggle(false)}>
                  Back
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-semibold">
                  We use cookies to improve your experience
                </CardTitle>
                <CardDescription className="text-base">
                  By clicking &quot;Allow all&quot;, you agree to our use of cookies for analytics
                  and personalization. See our{" "}
                  <Link href="#" className="text-primary underline">
                    Cookies Policy
                  </Link>{" "}
                  to learn more.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={handleAllowAll}>
                  Allow all
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40"
                  onClick={handleReject}
                >
                  Reject non-essential
                </Button>
                <Button size="lg" variant="ghost" onClick={() => handleManageToggle(true)}>
                  Manage cookies
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
