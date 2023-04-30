import { getFile } from "./utils";

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

export const subscribers = [getFileSubscriber];
