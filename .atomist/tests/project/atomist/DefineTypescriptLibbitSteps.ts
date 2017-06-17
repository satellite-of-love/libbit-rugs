import { Project } from "@atomist/rug/model/Project";
import {
    Given, ProjectScenarioWorld, Then, When,
} from "@atomist/rug/test/project/Core";

const CERTAIN_INPUT_FILEPATH = ".atomist/whatever/Something.java";

const CERTAIN_FILE_CONTENT_BEFORE = `export function hi() { return "hi"}`;

const TEST_FILEPATH = ".atomist/mocha/SomethingTest.ts";

const TEST_CONTENT_BEFORE = `blah blah test the thing`;


Given("a Rug archive project with a typescript file", (p: Project, world) => {
    p.addFile(CERTAIN_INPUT_FILEPATH, CERTAIN_FILE_CONTENT_BEFORE);
    p.addFile(TEST_FILEPATH, TEST_CONTENT_BEFORE);
});

When("the DefineLibbit is run on this Rug archive with name (.*)", (p: Project, world, name: string) => {
    const w = world as ProjectScenarioWorld;
    const editor = w.editor("DefineLibbit");
    w.editWith(editor, { name, sourceFile: CERTAIN_INPUT_FILEPATH });
});

Then("the (.*)Libbit knows about mocha test files", (p: Project, world, name: string) => {
    const libbitContents = p.findFile(`.atomist/editors/libbit/${name}.ts`).content;
    const passing = libbitContents.indexOf(TEST_FILEPATH) > 0;
    if (!passing) {
        console.log(libbitContents);
    }
    return passing;
});
