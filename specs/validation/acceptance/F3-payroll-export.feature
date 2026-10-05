Feature: F3 Payroll export

  @story-F3.1
  Rule: Finance sees every approved claim not yet exported

    Scenario: Finance opens the export screen
      Given an approved claim for Priya the employee has never been exported
      When Dana from finance opens the payroll export screen
      Then she sees Priya's claim in the list

  @story-F3.2
  Rule: Finance exports all approved, unexported claims together, on demand

    Scenario: Exporting a batch of approved claims
      Given two approved, unexported claims exist for Priya and Omar
      When Dana from finance triggers the export
      Then both claims are included in the same export

  @story-F3.3
  Rule: An exported claim is excluded from every future export

    Scenario: A previously exported claim does not reappear
      Given Priya's claim was included in yesterday's export
      When Dana from finance opens the payroll export screen today
      Then Priya's claim is not in the list

    @negative
    Scenario: Finance cannot export the same claim twice
      Given Priya's claim was included in yesterday's export
      When Dana from finance triggers a new export
      Then yesterday's export count for Priya's claim is unaffected
