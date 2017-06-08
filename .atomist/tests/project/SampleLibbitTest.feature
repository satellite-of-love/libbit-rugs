Feature: Lib lib libbits FEATURE
  The Sample libbit editor copies FEATURE into your project.


  Scenario: SampleLibbit should add sample files to the project
    Given an empty project
    When the SampleLibbit is run
    Then changes were made
    Then the new Sample source file exists
    Then the new Sample test files exist

  Scenario: SampleLibbit should do nothing when a file already exists
    Given the new Sample source file already exists
    When the SampleLibbit is run
    Then no changes were made