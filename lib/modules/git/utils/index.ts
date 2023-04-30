import git from "isomorphic-git";
import fs from "fs";
import http from "isomorphic-git/http/node";

export const getFile = async (filename, branch) => {
  console.log('getFile cwd', process.cwd());
  // Get the contents of 'README.md' in the main branch.
  let commitOid = await git.resolveRef({ fs, dir: "./", ref: "main" });
  console.log('git :: getFile :: commitid:', commitOid);
  let { blob } = await git.readBlob({
    fs,
    dir: process.cwd(),
    oid: commitOid,
    filepath: "README.md",
  });
  let result = Buffer.from(blob).toString("utf8");
  console.log(result);
  return result;
};

export async function getFileStateChanges(commitHash1, commitHash2, dir) {
  return git.walk({
    fs,
    dir,
    trees: [git.TREE({ ref: commitHash1 }), git.TREE({ ref: commitHash2 })],
    map: async function(filepath, [A, B]) {
      // ignore directories
      if (filepath === ".") {
        return;
      }
      if ((await A.type()) === "tree" || (await B.type()) === "tree") {
        return;
      }

      // generate ids
      const Aoid = await A.oid();
      const Boid = await B.oid();

      // determine modification type
      let type = "equal";
      if (Aoid !== Boid) {
        type = "modify";
      }
      if (Aoid === undefined) {
        type = "add";
      }
      if (Boid === undefined) {
        type = "remove";
      }
      if (Aoid === undefined && Boid === undefined) {
        console.log("Something weird happened:");
        console.log(A);
        console.log(B);
      }

      return {
        path: `/${filepath}`,
        type: type,
      };
    },
  });
}
