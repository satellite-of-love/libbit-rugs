Feature: Make sure the sample TypeScript Editor has some tests
  This is the sample Gherkin feature file for the BDD tests of
  the make a Rug editor that will copy part of your project into another.
  Feel free to modify and extend to suit the needs of your editor.


  Scenario: DefineLibbit should edit a project correctly
    Given a project with a certain file
    When the DefineLibbit is run
    Then parameters were valid
    Then changes were made
    Then that certain file looks different