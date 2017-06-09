import { Project } from "@atomist/rug/model/Project";
import {
    Given, ProjectScenarioWorld, Then, When,
} from "@atomist/rug/test/project/Core";

const sourceFiles = ["src/main/java/com/jessitron/exportme/SomeCode.java"];
const testFiles = ["src/test/java/com/jessitron/exportme/SomeCodeTest.java"];

When("the SampleLibbit is run", (p: Project, world) => {
    const w = world as ProjectScenarioWorld;
    const editor = w.editor("SampleLibbit");
    w.editWith(editor);
});

Then("the new Sample source file exists", (p: Project, world) => {
    return sourceFiles.every((f) => p.fileExists(f));
});

Then("the new Sample test files exist", (p: Project, world) => {
    return testFiles.every((f) => p.fileExists(f));
});

Given("the new Sample source file already exists", (p: Project) => {
    p.addFile(sourceFiles[0], "stuff");
});
