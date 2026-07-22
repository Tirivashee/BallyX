"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export function AutoPayToggle() {
  const [autoPay, setAutoPay] = useState(true);
  return (
    <Switch checked={autoPay} onCheckedChange={setAutoPay} aria-label="Auto-pay" />
  );
}
