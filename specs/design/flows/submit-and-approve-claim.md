# Submit and approve an expense claim

An employee submits a claim with an agent-suggested category; their manager
reviews it and approves or rejects it, and the employee is notified of the
decision by email.

```mermaid
sequenceDiagram
    actor Employee
    actor Manager
    participant expense-webapp
    participant category-agent
    participant expense-api

    Employee->>expense-webapp: enter claim details (date, amount, description, receipt)
    expense-webapp->>category-agent: suggest category
    category-agent-->>expense-webapp: suggested category
    Employee->>expense-webapp: confirm category and submit
    expense-webapp->>expense-api: create claim
    alt amount over $25 with no receipt
        expense-api-->>expense-webapp: refused
    else
        expense-api-->>expense-webapp: claim created (pending)
    end
    Manager->>expense-webapp: open team's pending claims
    expense-webapp->>expense-api: list team claims
    expense-api-->>expense-webapp: pending claims
    Manager->>expense-webapp: approve, or reject with a reason
    expense-webapp->>expense-api: record decision
    expense-api-->>Employee: email notification of the decision
```