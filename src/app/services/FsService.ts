import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import os from "os";
import path from "path";

export default abstract class FsService {
    public static createFolderIfNotExists(folder: string) {
        if (!existsSync(`${os.homedir()}/images/${folder}`)) {
            console.log(`Creating folder ${os.homedir()}/images/${folder}`);
            mkdirSync(`${os.homedir()}/images/${folder}`, { recursive: true });
        }
    }

    public static writeFiles(files: File[], folder: string, errors: string[]): Promise<void[]> {
        return Promise.all(files.map(async file => {
            try {
                writeFileSync(`${os.homedir()}/images/${folder}/${file.name}`, Buffer.from(await file.arrayBuffer()), { flag: 'wx' });
            } catch (err) {
                if (err instanceof Error) {
                    errors.push(err?.message as string);
                } else {
                    errors.push(err as string);
                }
            }
        }));
    }

    public static moveFile(oldPath: string, newPath: string) {
        console.log(`Moving ${oldPath} to ${newPath}`);
        if (oldPath === newPath) {
            return;
        }
        this.createFolderIfNotExists(path.dirname(newPath));
        console.log("Done creating folder");
        writeFileSync(`${os.homedir()}/images/${newPath}`, readFileSync(`${os.homedir()}/images/${oldPath}`), { flag: 'wx' });
    }
}