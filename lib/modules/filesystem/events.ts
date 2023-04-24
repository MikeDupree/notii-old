import axios from "axios";

const getHandler = (event, message) => {
  if (!message.path) {
    event.sender.send("error", {
      type: "filesystem",
      message: "missing arg: path",
    });
    return;
  }
  axios
    .get("http://localhost:8080/files?path=/")
    .then((res) => {
      event.sender.send("filesystem:client", res.data);
    })
    .catch(console.log);
  console.log("Sending message on filesystem:client");
};

const getSubscriber = {
  channel: "todo:get",
  callback: getHandler,
};

export const subscribers = [getSubscriber];
