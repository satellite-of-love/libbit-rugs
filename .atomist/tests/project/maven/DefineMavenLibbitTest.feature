Feature: Make sure the sample TypeScript Editor has some tests
  This is the sample Gherkin feature file for the BDD tests of
  the make a Rug editor that will copy part of your project into another.
  Feel free to modify and extend to suit the needs of your editor.


  Scenario: DefineLibbit should edit a project correctly
    Given a maven project with a source file
    When the DefineLibbit is run on a java file with name Yes
    Then parameters were valid
    Then changes were made
    Then the YesLibbit editor exists
    Then the YesLibbit features file exists
    Then the YesLibbit steps file exists
    Then the YesLibbit knows about test files
