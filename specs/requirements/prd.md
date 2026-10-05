# Expense Claims &amp; Payroll Export

## Problem Statement

Employees pay for business costs out of pocket and today's process — paper
forms, email threads, spreadsheets — is slow, easy to get wrong, and hard to
audit. Managers lack a single place to see what is waiting on them, and
finance has to manually re-key approved amounts before they can reach
payroll.

## Solution

A system where employees submit expense claims with amount, category and
receipt; managers review and approve or reject their team's claims; and
finance exports approved claims to payroll, replacing the manual, paper-based
process end to end.

## Actors

- **Employee** — submits expense claims and tracks their status.
- **Manager** — reviews their team's submitted claims and approves or rejects
each one.
- **Finance** — exports approved claims to payroll for payment.

## Features

- F1 [Submit expenses](features/F1-submit-expenses.md)
- F2 [Approvals](features/F2-approvals.md)
- F3 [Payroll export](features/F3-payroll-export.md)

## Product-wide

See [Product-wide](product-wide.md) for the rules that apply across features.

## Out of Scope

- Multi-currency support — the product uses a single company currency.
- Integration with a specific payroll system — the export target is chosen
later, when the payroll-export dependency is defined.

## Open Questions

None — the product's frame is settled.