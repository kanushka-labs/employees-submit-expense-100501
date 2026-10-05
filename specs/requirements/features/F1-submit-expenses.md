# Submit expenses

## Purpose

Employees submit expense claims — amount, category and receipt — for their
manager to review.

## Decisions

- A receipt is required for any claim above $25; claims at or below $25 need
no receipt.
- An agent suggests an expense category from the claim's description or
receipt, which the employee confirms or changes before submitting.

## Out of Scope

- Masking personal data before the category-suggestion agent sees it — the
claim text it reads is not treated as sensitive.