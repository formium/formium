---
'@formium/client': patch
'@formium/docs-data': patch
'@formium/react': patch
'@formium/types': patch
---

Moved TS types to their own package `@formium/types` so that `@formium/react` doesn't need to have `@formium/client` as a peer dependency.
