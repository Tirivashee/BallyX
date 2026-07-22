# BallyX Invoice Generator

A self-contained invoice tool for the BallyX Next.js app. Fill in a form, watch a
live preview, and download a real vector PDF generated on the server. The exact
BallyX invoice theme is shared between the on-screen preview and the PDF.

## What's inside

```
lib/invoice/
  types.ts            Shared TypeScript types (money is always integer cents)
  theme.ts            Colour tokens (single source of truth)
  format.ts           Money/date formatting + totals helpers
  logo.ts             BallyX wordmark, inlined as a base64 data URI
  defaults.ts         Prefilled invoice + invoice-number helper
  sequence.ts         Client-only auto-incrementing invoice number (localStorage)
  InvoiceDocument.tsx @react-pdf/renderer document (server only)

app/api/invoice/
  route.ts            POST endpoint -> streams the PDF (Node runtime)

app/tools/invoice/
  page.tsx                  The tool page (/tools/invoice)
  InvoiceForm.tsx           The input form
  InvoicePreview.tsx        Live HTML preview mirroring the PDF
  invoice-tool.module.css   Styles for the tool chrome

types/
  css-modules.d.ts    Optional; delete in a standard Next.js project
```

## Install

1. Copy the `app/`, `lib/`, and (optionally) `types/` folders into your project
   root, merging with what you already have. The tool lives at
   **`/tools/invoice`** and the API at **`/api/invoice`**.

2. Install the one dependency:

   ```bash
   npm install @react-pdf/renderer
   ```

3. Make sure the `@/*` path alias points at your project root (this is the Next.js
   default). In `tsconfig.json`:

   ```json
   { "compilerOptions": { "paths": { "@/*": ["./*"] } } }
   ```

   If your code lives under `src/`, place these folders under `src/` and use
   `"@/*": ["./src/*"]` instead.

4. Run `npm run dev` and open `/tools/invoice`.

## Notes

- **Money is integer cents everywhere.** The form edits dollars, but state and the
  PDF use cents (`unitCents`, `discountCents`) to avoid floating-point drift.
- **The PDF is the source of truth.** The preview is an HTML mirror using the same
  `THEME` and format helpers; the downloaded file is rendered server-side from
  `InvoiceDocument.tsx`.
- **Runtime.** The API route sets `runtime = "nodejs"` because `@react-pdf/renderer`
  is not Edge-compatible. It works on Vercel Node serverless functions.
- **Swapping the logo.** Replace the data URI in `lib/invoice/logo.ts` with any PNG
  or JPEG data URI. Keep the aspect ratio close to the current wordmark (~4.4:1) or
  adjust `logo` width/height in `InvoiceDocument.tsx` and `InvoicePreview.tsx`.
- **No persistence.** Invoices are generated and downloaded only — nothing is stored.
  To add saving later, POST the same `InvoiceData` JSON to a Supabase table before
  (or alongside) calling `/api/invoice`.
- **Invoice numbering.** `sequence.ts` auto-increments the suggested invoice number
  (`BX-INV-yymmdd-N`) using `localStorage`, advancing once a PDF is actually
  downloaded. It's per-browser/per-device (there's no backend to share a counter
  across devices) and resets daily since the number is date-stamped.

## Extending

- Change the default sender details, payment methods, and notes in
  `lib/invoice/defaults.ts`.
- Add fields (PO number, tax/VAT line, etc.) by extending `InvoiceData` in
  `types.ts`, then rendering them in both `InvoiceDocument.tsx` and
  `InvoicePreview.tsx`. Keeping those two in sync keeps preview and PDF identical.
