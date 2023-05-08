import { readFileSync, renameSync } from "fs";
import { fchmodSync } from "original-fs";

const STOREPATH = './store/notes';
const STORENAME = 'editor';

export class EditorFile {
  private name: string;
  private author: string;
  private data: string;

  constructor(name: string, author: string, data: string) {
    this.name = name;
    this.author = author;
    this.data = data;
  }

  getName(): string {
    return this.name;
  }

  getAuthor(): string {
    return this.author;
  }

  getData(): string {
    return this.data;
  }

  setName(name: string): void {
    this.name = name;
  }

  setData(data: string): void {
    this.data = data;
  }

  toJson(): string {
    return JSON.stringify({
      name: this.name,
      author: this.author,
      data: this.data,
    });
  }

  /**
   * Load a file
   */
  public loadFile(filename: string, author: string) {
    const filepath = `${filename}.editor.json`;

    let data;
    try {
      data = readFileSync(filepath, {
        encoding: "utf8",
        flag: "r",
      });
    } catch (e) {
      return false;
    }

    if (!data) return false;

    return new EditorFile(data.name, data.author, data.content);
  }
}
