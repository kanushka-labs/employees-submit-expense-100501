# Payroll export

## Purpose

Finance exports approved expense claims to payroll for payment. The payroll
system this exports to is not yet chosen; that is settled when the
payroll-export dependency is defined at design time.

Needs: F2.

## User Stories

- F3.1 As finance, I see all approved claims that have not yet been exported.
- F3.2 As finance, I export all approved, not-yet-exported claims to payroll in one batch, on demand.
- F3.3 As finance, an exported claim is marked as exported so it is excluded from future exports.

## Decisions

- Finance triggers the export manually, on demand; there is no automatic or scheduled export.
- An export covers all approved, not-yet-exported claims together, in one batch.
- Once exported, a claim is locked as exported and cannot be exported again, preventing duplicate payment.

