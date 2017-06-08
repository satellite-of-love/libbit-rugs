import { Project } from "@atomist/rug/model/Project";
import {
    Given, ProjectScenarioWorld, Then, When,
} from "@atomist/rug/test/project/Core";

const CERTAIN_INPUT_FILEPATH = "hello.txt";

const CERTAIN_FILE_CONTENT_BEFORE = `I love to say hello

to the world
`;

Given("a project with a source file", (p: Project, world) => {
    p.addFile(CERTAIN_INPUT_FILEPATH, CERTAIN_FILE_CONTENT_BEFORE);
});

When("the DefineLibbit is run with name (.*)", (p: Project, world, name: string) => {
    const w = world as ProjectScenarioWorld;
    const editor = w.editor("DefineLibbit");
    w.editWith(editor, { name, sourceFile: CERTAIN_INPUT_FILEPATH });
});

Then("the (.*)Libbit editor exists", (p: Project, world, name: string) => {
    const w = world as ProjectScenarioWorld;
    console.log(p.files.forEach((f) => console.log("file: " + f.path)))
    return p.fileExists(`.atomist/editors/libbit/${name}.ts`);
});
