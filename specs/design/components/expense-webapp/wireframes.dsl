screen EmployeeClaims "An employee's submitted claims and their status"
  navbar "Expense Claims"
  sidebar "My Claims -> EmployeeClaims | New Claim -> NewClaim"
  row
    heading "My Claims"
    right
    button "New Claim" primary -> NewClaim
  table "Date | Category | Amount | Status"
    row "2026-09-02 | Travel | $48.00 | Pending"
    row "2026-08-28 | Meals | $19.50 | Approved"
    row "2026-08-20 | Office Supplies | $64.00 | Rejected"

screen NewClaim "An employee submits a new expense claim"
  navbar "Expense Claims"
  sidebar "My Claims -> EmployeeClaims | New Claim -> NewClaim"
  heading "New Claim"
  input "Expense date"
  input "Amount"
  textarea "Description"
  card "Suggested category: Meals" ai
    text "Based on your description, this looks like a meal expense."
  select "Category"
  input "Receipt (required above $25)"
  row
    right
    button "Cancel" -> EmployeeClaims
    button "Submit Claim" primary -> EmployeeClaims

screen ManagerQueue "A manager's team's pending claims, oldest first"
  navbar "Expense Claims"
  sidebar "Pending Claims -> ManagerQueue"
  heading "Pending Claims"
  table "Employee | Date | Category | Amount" -> ClaimReview
    row "J. Rivera | 2026-09-02 | Travel | $48.00"
    row "A. Chen | 2026-08-30 | Meals | $22.00"

screen ClaimReview "A manager reviews one claim and decides"
  navbar "Expense Claims"
  sidebar "Pending Claims -> ManagerQueue"
  heading "Claim from J. Rivera"
  text "Date: 2026-09-02"
  text "Category: Travel"
  text "Amount: $48.00"
  image "Receipt"
  textarea "Rejection reason (required to reject)"
  row
    right
    button "Reject" danger -> ManagerQueue
    button "Approve" primary -> ManagerQueue

screen FinanceExport "Finance reviews and exports approved, unexported claims"
  navbar "Expense Claims"
  sidebar "Payroll Export -> FinanceExport"
  row
    heading "Approved Claims Ready for Export"
    right
    button "Export Batch" primary -> FinanceExport
  table "Employee | Date | Category | Amount"
    row "J. Rivera | 2026-08-15 | Travel | $120.00"
    row "A. Chen | 2026-08-18 | Meals | $22.00"

flow "Submit expenses"
  role "Employee"
  description "An employee submits a claim and tracks its status"
  EmployeeClaims
  NewClaim

flow "Approvals"
  role "Manager"
  description "A manager reviews and decides on their team's claims"
  ManagerQueue
  ClaimReview

flow "Payroll export"
  role "PayrollExporter"
  description "Finance exports approved, unexported claims to payroll"
  FinanceExport
