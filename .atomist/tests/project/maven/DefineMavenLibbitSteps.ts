import { Project } from "@atomist/rug/model/Project";
import {
    Given, ProjectScenarioWorld, Then, When,
} from "@atomist/rug/test/project/Core";

const CERTAIN_INPUT_FILEPATH = "src/main/java/hoo/de/hoo/Something.java";

const CERTAIN_FILE_CONTENT_BEFORE = `package hoo.de.hoo;

class Something {
}`;

const TEST_FILEPATH = "src/test/java/hoo/de/hoo/SomethingTest.java";

const TEST_CONTENT_BEFORE = `package hoo.de.hoo;

class Something {
}`;


Given("a maven project with a source file", (p: Project, world) => {
    p.addFile(CERTAIN_INPUT_FILEPATH, CERTAIN_FILE_CONTENT_BEFORE);
    p.addFile(TEST_FILEPATH, TEST_CONTENT_BEFORE);
});

When("the DefineLibbit is run on a java file with name (.*)", (p: Project, world, name: string) => {
    const w = world as ProjectScenarioWorld;
    const editor = w.editor("DefineLibbit");
    w.editWith(editor, { name, sourceFile: CERTAIN_INPUT_FILEPATH });
});

Then("the (.*)Libbit editor exists", (p: Project, world, name: string) => {
    return p.fileExists(`.atomist/editors/libbit/${name}.ts`);
});

Then("the (.*)Libbit features file exists", (p: Project, world, name: string) => {
    return p.fileExists(`.atomist/tests/project/libbit/${name}Test.feature`);
});

Then("the (.*)Libbit knows about test files", (p: Project, world, name: string) => {
    const libbitContents = p.findFile(`.atomist/editors/libbit/${name}.ts`).content;
    const passing = libbitContents.indexOf(TEST_FILEPATH) > 0;
    if (!passing) {
        console.log(libbitContents);
    }
    return passing;
});
