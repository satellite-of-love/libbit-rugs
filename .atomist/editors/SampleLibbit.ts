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

        const sourceFiles = ["src/main/java/com/jessitron/exportme/SomeCode.java"];
        const testFiles = ["src/test/java/com/jessitron/exportme/SomeCodeTest.java"];

        const allFiles = sourceFiles.concat(testFiles);

        const alreadyExisting = allFiles.filter((f) => project.fileExists(f));
        if (alreadyExisting.length > 0) {
            console.log(`File ${alreadyExisting.join(" and ")} already exists. Exiting`);
            return;
        }


        allFiles.forEach((f) => {
            project.copyEditorBackingFileOrFail(f);
        });

        // TODO: some atomist config operation to make a link
        // TODO: calculate and move the files to a package (if there's a 'libbit' package put them there?)
    }
}

export const sampleLibbit = new SampleLibbit();
