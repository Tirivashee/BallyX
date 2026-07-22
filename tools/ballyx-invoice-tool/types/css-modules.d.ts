// Optional: Next.js already types `*.module.css` imports out of the box, so you
// can delete this file in a standard Next.js project. It's included only so the
// module also typechecks in stricter or non-Next setups.
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
