import { File, Project } from "@atomist/rug/model/Core";
import { Editor, Parameter, Tags } from "@atomist/rug/operations/Decorators";
import { EditProject } from "@atomist/rug/operations/ProjectEditor";
import { Pattern } from "@atomist/rug/operations/RugOperation";

/**
 * Define a new libbit in your project!
 *
 * Step 1: Identify some code that is useful elsewhere
 * Step 1a: Make sure it's fully contained in one source file
 * Step 1b: Get its tests into one source file over in /src/test/..
 * Step 2: Run this editor! It will create a libbit editor in your current project.
 * Step 2a: `rug publish` in your current project, to make the new libbit editor available
 * Step 3: In the destination project, `rug edit` with this project's editor.
 */
@Editor("DefineLibbit", "make a Rug editor that will copy part of your project into another")
@Tags("documentation")
export class DefineLibbit implements EditProject {

    @Parameter({
        displayName: "Name of this libbit",
        description: "Libbit name. Camel case",
        pattern: Pattern.any,
        validInput: "camelcase",
        minLength: 1,
        maxLength: 100,
    })
    public name: string;

    @Parameter({
        displayName: "Source file that's useful",
        description: "File containing the code you want to export",
        pattern: Pattern.any,
        validInput: "a description of the valid input",
        minLength: 1,
        maxLength: 100,
    })
    public sourceFile: string;

    // TODO: description

    public edit(project: Project) {
        // TODO: make this a rug archive if it is not already

        // TODO: extract this project's group and artifact from package.json

        const libbitFilepath = ".atomist/editors/libbit/" + this.name + ".ts";

        if (!project.fileExists(this.sourceFile)) {
            throw new Error(`The source file ${this.sourceFile} does not exist`);
        }

        project.copyEditorBackingFileOrFailToDestination(".atomist/editors/SampleLibbit.ts",
            libbitFilepath);
        const certainFile = project.findFile(libbitFilepath);
        let newContent = certainFile.content;

        newContent = newContent.
            replace(/FEATURE/g, this.name).
            replace(/Sample/g, this.name);

        // source files
        newContent = newContent.
            replace(/const sourceFiles = \[.*?\]/,
            `const sourceFiles = [ ${this.sourceFile} ]`);

        { // test files
            const testPrefix = this.sourceFile.
                replace(/\/main\//, "/test/").
                replace(/\.[^\.]*$/, ""); // strip the file suffix
            const testFilepathStrings = project.files.
                filter((f) => f.path.indexOf(testPrefix) === 0). // startsWith
                map((f) => `"${f.path}"`);
            const testFilepathArrayString = `[ ${testFilepathStrings.join(", ")} ]`;

            newContent = newContent.
                replace(/const testFiles = \[.*?\]/,
                `const testFiles = [ ${testFilepathStrings.join(", ")} ]`);
        }

        certainFile.setContent(newContent);
    }
}

export const defineLibbit = new DefineLibbit();
