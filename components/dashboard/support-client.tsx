"use client";

import { useState, type FormEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BrandName } from "@/components/ui/brand-name";
import type { Ticket } from "@/lib/dashboard-data";

export function SupportClient({ initialTickets }: { initialTickets: Ticket[] }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const ticket: Ticket = {
      id: `TCK-DEMO-${Date.now().toString().slice(-4)}`,
      subject: subject.trim(),
      status: "Open",
      createdAt: "Just now",
      lastUpdate: "Just now",
      messages: [{ from: "You", body: message.trim(), at: "Just now" }],
    };
    setTickets((prev) => [ticket, ...prev]);
    setSubject("");
    setMessage("");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
          Support
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          <BrandName text="Illustrative demo data — submitting a ticket here doesn't send anything to BallyX." />{" "}
          For real support, use{" "}
          <a href="/contact" className="underline underline-offset-4">
            Contact
          </a>
          .
        </p>
      </div>

      <div className="rounded-lg border border-ink/10 bg-paper-soft p-6">
        <h2 className="font-heading text-lg font-medium tracking-tight text-ink">
          New ticket
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ticket-subject">Subject</Label>
            <Input
              id="ticket-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ticket-message">Message</Label>
            <Textarea
              id="ticket-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Submit ticket (demo)</Button>
        </form>
      </div>

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <details
            key={ticket.id}
            className="rounded-lg border border-ink/10 bg-paper-soft p-4"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <span>
                <span className="text-sm font-medium text-ink">
                  {ticket.subject}
                </span>
                <span className="ml-2 text-xs text-ink-soft">
                  {ticket.id}
                </span>
              </span>
              <Badge variant={ticket.status === "Open" ? "teal" : "outline"}>
                {ticket.status}
              </Badge>
            </summary>
            <div className="mt-4 space-y-3 border-t border-ink/10 pt-4">
              {ticket.messages.map((m, i) => (
                <div key={i} className="text-sm">
                  <p className="font-medium text-ink">
                    <BrandName text={m.from} />
                    <span className="ml-2 text-xs font-normal text-ink-soft">
                      {m.at}
                    </span>
                  </p>
                  <p className="text-ink-soft">{m.body}</p>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
