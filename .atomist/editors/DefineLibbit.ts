import {File, Project} from "@atomist/rug/model/Core";
import {Editor, Parameter, Tags} from "@atomist/rug/operations/Decorators";
import {EditProject} from "@atomist/rug/operations/ProjectEditor";
import {Pattern} from "@atomist/rug/operations/RugOperation";

type SupportedProjectStructure = "maven" | "atomist" | "arbitrary";

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

        // TODO: Print a message about how to use the libbit
        // TODO: wrap running this (plus npm install and rug install) in a shell script

        if (!project.fileExists(this.sourceFile)) {
            throw new Error(`The source file ${this.sourceFile} does not exist`);
        }

        const projectStructure = this.categorize(this.sourceFile);
        const testFiles = this.detectTests(projectStructure, project, this.sourceFile);

        const libbitFile = this.copySampleLibbit(project, this.name);
        this.modifySampleLibbit(libbitFile, this.name, this.sourceFile, testFiles);

        const featuresFile = this.copySampleFeaturesFile(project, this.name);
        this.modifySampleLibbit(featuresFile, this.name, this.sourceFile, testFiles);

        const stepsFile = this.copySampleStepsFile(project, this.name);
        this.modifySampleLibbit(stepsFile, this.name, this.sourceFile, testFiles);

    }

    private categorize(sourceFile: string): SupportedProjectStructure {
        if (sourceFile.match(/^\/?src\/main/)) return "maven";
        if (sourceFile.match(/^\/?.atomist/)) return "atomist";
        else return "arbitrary";
    }

    private detectTests(projectStructure: SupportedProjectStructure, project: Project, sourceFile: string): string[] {
        if (projectStructure === "maven") {
            return detectMavenTests(project, sourceFile)
        } else if (projectStructure === "atomist") {
            return detectRugArchiveTypeScriptTests(project, sourceFile)
        } else if (projectStructure === "arbitrary") {
            return [];
        }
    }

    private copySampleLibbit(project: Project, name: string) {

        const libbitFilepath = ".atomist/editors/libbit/" + name + ".ts";

        project.copyEditorBackingFileOrFailToDestination(".atomist/editors/SampleLibbit.ts",
            libbitFilepath);

        return project.findFile(libbitFilepath);
    }

    private copySampleFeaturesFile(project: Project, name: string) {
        const destination = ".atomist/tests/project/libbit/" + name + "Test.feature";
        const source = ".atomist/tests/project/SampleLibbitTest.feature";

        project.copyEditorBackingFileOrFailToDestination(
            source,
            destination);

        return project.findFile(destination);
    }

    private copySampleStepsFile(project: Project, name: string) {
        const destination = ".atomist/tests/project/libbit/" + name + "Steps.ts";
        const source = ".atomist/tests/project/SampleLibbitSteps.ts";

        project.copyEditorBackingFileOrFailToDestination(
            source,
            destination);

        return project.findFile(destination);
    }

    private modifySampleLibbit(certainFile: File, name: string, sourceFile: string, testFiles: string[]) {

        let newContent = certainFile.content;

        newContent = newContent.replace(/FEATURE/g, name).replace(/Sample/g, name);

        // source files
        newContent = newContent.replace(/const sourceFiles = \[.*?\]/,
            `const sourceFiles = [ "${sourceFile}" ]`);

        { // test files
            const testFilepathStrings = testFiles.map((f) => `"${f}"`);
            const testFilepathArrayString = testFilepathStrings.length > 0 ?
                `[ ${testFilepathStrings.join(", ")} ]`
                : `[]`;

            newContent = newContent.replace(/const testFiles = \[.*?\]/,
                `const testFiles = ${testFilepathArrayString}`);
        }

        certainFile.setContent(newContent);
    }
}

function detectMavenTests(project: Project, sourceFile: string): string[] {
    const testPrefix = sourceFile.replace(/\/main\//, "/test/").replace(/\.[^\.]*$/, ""); // strip the file suffix
    const testFilepaths = project.files.filter((f) => f.path.indexOf(testPrefix) === 0).// startsWith
    map((f) => f.path);
    return testFilepaths;
}


function detectRugArchiveTypeScriptTests(project: Project, sourceFile: string): string[] {
    const testPrefix = sourceFile.replace(/.*\//, "").// strip the directories
    replace(/\.[^\.]*$/, ""); // strip the file suffix
    const testFiles = project.context.pathExpressionEngine.evaluate<Project, File>(
        project, "/Directory()[@name='.atomist']/mocha/File()");

    const testFilepaths =
        testFiles.matches.filter((f) => f.name.indexOf(testPrefix) === 0). // startsWith
        map((f) => f.path);
    return testFilepaths;
}
export const defineLibbit = new DefineLibbit();
