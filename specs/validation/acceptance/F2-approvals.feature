Feature: F2 Approvals

  @story-F2.1
  Rule: A manager sees their team's pending claims, oldest first

    Scenario: A manager opens the pending queue
      Given Priya the employee submitted a claim before Omar the employee submitted his
      And both report to Lee the manager
      When Lee opens his pending claims
      Then Priya's claim is listed before Omar's claim

  @story-F2.2
  Rule: Only a manager may open their team's claims for review

    Scenario: A manager views a team member's claim details
      Given Priya the employee has a pending claim for a $48.00 travel expense
      And Priya reports to Lee the manager
      When Lee opens Priya's claim
      Then he sees its date, amount, category and receipt

  @story-F2.3
  Rule: A manager approves a submitted claim

    Scenario: Approving a pending claim
      Given Priya the employee has a pending claim
      And Priya reports to Lee the manager
      When Lee approves the claim
      Then the claim's status is "approved"

  @story-F2.4
  Rule: Rejecting a claim requires a reason

    Scenario: A manager rejects a claim with a reason
      Given Priya the employee has a pending claim
      And Priya reports to Lee the manager
      When Lee rejects the claim with the reason "Missing itemized receipt"
      Then the claim's status is "rejected"
      And the claim shows the reason "Missing itemized receipt"

    @negative
    Scenario: A rejection without a reason is refused
      Given Priya the employee has a pending claim
      And Priya reports to Lee the manager
      When Lee tries to reject the claim without giving a reason
      Then the claim's status is still "pending"

  @story-F2.5
  Rule: The employee is notified by email when a decision is made

    Scenario: An employee is emailed when their claim is approved
      Given Priya the employee has a pending claim
      And Priya reports to Lee the manager
      When Lee approves the claim
      Then Priya receives an email about the claim's approval

    Scenario: An employee is emailed when their claim is rejected
      Given Priya the employee has a pending claim
      And Priya reports to Lee the manager
      When Lee rejects the claim with the reason "Missing itemized receipt"
      Then Priya receives an email about the claim's rejection
