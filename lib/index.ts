import { readFileSync, existsSync } from "fs";
import inquirer from "inquirer";

function getMissingKeys<T extends object, U extends object>(
    objA: T,
    objB: U
): (keyof T)[] {
    const keysA = Object.keys(objA) as (keyof T)[];
    return keysA.filter((key) => !(key in objB));
}

function removeSpecials(str: string): string {
    return str.replace(/['"\s]/g, "");
}

async function start() {
    console.log("Welcome to the JSON Comparison Service");

    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "file1",
            message: "Please drag and drop JSON file 1 here:",
        },
        {
            type: "input",
            name: "file2",
            message: "Please drag and drop JSON file 2 here:",
        },
    ]);

    const file1 = removeSpecials(answers.file1);
    const file2 = removeSpecials(answers.file2);
    console.log({ file1, file2 });
    // Check if files exist
    if (!existsSync(file1) || !existsSync(file2)) {
        console.error(
            "Error: One or both of the specified files do not exist. Please check the file paths and try again."
        );
        return;
    }

    // Read and parse the JSON files
    let obj1: Record<string, any>;
    let obj2: Record<string, any>;

    try {
        const json1 = readFileSync(file1, { encoding: "utf-8" });
        const json2 = readFileSync(file2, { encoding: "utf-8" });
        obj1 = JSON.parse(json1);
        obj2 = JSON.parse(json2);
    } catch (error) {
        console.error(
            "Error: One or both of the files do not contain valid JSON."
        );
        return;
    }

    const missingKeys = getMissingKeys(obj1, obj2);
    // Display missing keys in a user-friendly way
    if (missingKeys.length > 0) {
        console.log(
            "Missing keys in JSON file 2 compared to file 1:\n",
            missingKeys.join("\n")
        );
    } else {
        console.log(
            "No missing keys found. Both JSON files contain the same keys."
        );
    }
}

start();
