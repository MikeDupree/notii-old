import { getFile } from "./utils";
import { app, dialog } from 'electron';

const errorHandler = (error: Error) => {
  console.log("Error :: ", error);
};

const getFileHandler = async (event, message) => {
  const { path, source, comparison } = message;
  if (!(path || source || comparison)) {
    event.sender.send("error", {
      type: "git",
      message: "expected: path, source, comparison",
    });
    return;
  }

  const sourceFile = await getFile(path, source).catch(errorHandler);
  const comparisonFile = await getFile(path, comparison).catch(errorHandler);

  console.log("Sending message on filesystem:client");
  event.sender.send("git:client", {src: sourceFile, cmp: comparisonFile});
};

const getFileSubscriber = {
  channel: "git:getFile",
  callback: getFileHandler,
};

const openDirectoryHandler = (event) => {
  console.log("Handle git:openDirectory");
  dialog
    .showOpenDialog({
      defaultPath: app.getPath('home'), // set the initial directory to the user's home directory
      properties: ['openDirectory'],
    })
    .then((result) => {
      if (!result.canceled) {
        console.log('results path', result);
        event.sender.send('selected-directory', result.filePaths);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

const openDirectorySubscriber = {
  channel: 'git:openDirectory',
  callback: openDirectoryHandler,
}
export const subscribers = [getFileSubscriber, openDirectorySubscriber];
