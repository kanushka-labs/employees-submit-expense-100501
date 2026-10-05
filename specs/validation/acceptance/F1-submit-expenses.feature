Feature: F1 Submit expenses

  @story-F1.1
  Rule: A claim above $25 requires a receipt

    Scenario: A claim over $25 with a receipt is accepted
      Given Priya the employee has a $48.00 taxi expense from "2026-09-02" with a receipt attached
      When Priya submits the claim
      Then the claim appears in her claims as "pending"

    @negative
    Scenario: A claim over $25 without a receipt is refused
      Given Priya the employee has a $48.00 taxi expense from "2026-09-02" with no receipt attached
      When Priya submits the claim
      Then the claim is not added to her claims

  @story-F1.1
  Rule: A claim at or below $25 needs no receipt

    Scenario: A small claim is accepted without a receipt
      Given Priya the employee has a $12.00 coffee expense from "2026-09-02" with no receipt attached
      When Priya submits the claim
      Then the claim appears in her claims as "pending"

  @story-F1.2
  Rule: Categories come from a fixed list

    Scenario: An employee picks a category from the fixed list
      Given Priya the employee is entering a new claim
      When she opens the category selector
      Then only categories from the product's fixed list are offered

  @story-F1.3
  Rule: An employee sees their own submitted claims and status

    Scenario: An employee reviews their claim history
      Given Priya the employee has claims that are pending, approved and rejected
      When she opens her claims list
      Then she sees each claim with its current status

  @story-F1.4
  Rule: Only the submitting employee may edit or withdraw their own pending claim

    Scenario: An employee edits a pending claim
      Given Priya the employee has a pending claim for a $30.00 expense
      When she changes the amount to $35.00
      Then the claim shows an amount of $35.00

    Scenario: An employee withdraws a pending claim
      Given Priya the employee has a pending claim for a $30.00 expense
      When she withdraws the claim
      Then the claim no longer appears in her claims

    @negative
    Scenario: A decided claim can no longer be edited
      Given Priya the employee has a claim that has already been approved
      When she tries to edit the claim's amount
      Then the claim's amount is unchanged
