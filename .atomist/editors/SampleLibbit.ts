import { File, Project } from "@atomist/rug/model/Core";
import { Editor, Parameter, Tags } from "@atomist/rug/operations/Decorators";
import { EditProject } from "@atomist/rug/operations/ProjectEditor";
import { Pattern } from "@atomist/rug/operations/RugOperation";

/**
 * Run this to copy FEATURE into your project
 */
@Editor("SampleLibbit", "Run this to copy FEATURE into your project")
@Tags("libbit")
export class SampleLibbit implements EditProject {

    public edit(project: Project) {

        const sourceDir = "/src/main/java/com/jessitron/exportme";
        const testDir = "/src/test/java/com/jessitron/exportme";

        const sourceFilenames = ["SomeCode.java"];
        const testFilenames = ["SomeTest.java"];

        const sourceFiles = sourceFilenames.map((n) =>
            sourceDir + "/" + n);

        const testFiles = testFilenames.map((n) =>
            testDir + "/" + n);

        sourceFiles.concat(testFiles).forEach((f) => {
            if (project.fileExists(f)) {
                console.log("File ${f} already exists. Exiting");
                return;
            }
            project.copyEditorBackingFileOrFail(f);
        });

        // TODO: some atomist config operation to make a link
    }
}

export const sampleLibbit = new SampleLibbit();
