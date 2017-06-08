Feature: Make sure the sample TypeScript Editor has some tests
  This is the sample Gherkin feature file for the BDD tests of
  the Run this to copy FEATURE into your project.
  Feel free to modify and extend to suit the needs of your editor.


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