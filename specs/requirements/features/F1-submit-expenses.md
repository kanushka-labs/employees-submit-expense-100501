# Submit expenses

## Purpose

Employees submit expense claims — amount, category and receipt — for their
manager to review.

## User Stories

- F1.1 As an employee, I submit an expense claim with a date, amount, category and receipt (when required).
- F1.2 As an employee, I pick a category for my claim from a fixed list, with the agent's suggested category pre-filled.
- F1.3 As an employee, I see my submitted claims and their status (pending, approved, rejected).
- F1.4 As an employee, I edit or withdraw a claim while it is still pending.

## Decisions

- A claim covers a single expense: one amount, date, category and receipt.
- A receipt is required for any claim above $25; claims at or below $25 need
no receipt.
- Categories come from a fixed, predefined list.
- An agent suggests an expense category from the claim's description or
receipt, which the employee confirms or changes before submitting.
- An employee may edit or withdraw a claim only while it is still pending —
once a manager decides, the claim is locked.

## Out of Scope

- Masking personal data before the category-suggestion agent sees it — the
claim text it reads is not treated as sensitive.

