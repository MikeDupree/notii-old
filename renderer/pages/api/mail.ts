import type { NextApiHandler } from "next";
import { getServerSession } from "next-auth/next";
import { getSession } from "next-auth/react";
import authOptions from "./auth/[...nextauth]";
import { google } from "googleapis";

const TestHandler: NextApiHandler = async (req, res) => {
  // const session = await getServerSession(req, res, authOptions);
  const session = await getSession({ req });
  /*
session {
  expires: '2023-05-02T17:43:05.181Z',
  token: {
    token: {
      token: [Object],
      iat: 1680457227,
      exp: 1683049227,
      jti: 'b6206919-d7f7-44ac-ad43-4cd6f3be573e'
    },
    iat: 1680457355,
    exp: 1683049355,
    jti: 'fd67e644-742a-4311-9dd1-6d5e31f312a5'
  }
*/
  console.log("session", session);
  console.log("session.token.token.token", session.token.token.token);
  console.log("account", session.token.token.account);
  if (!session) {
    res.status(401);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const accessToken = session?.token?.token?.account?.access_token;
  const refreshToken = session?.token?.token?.account?.refresh_token;

  console.log({
    clientId,
    clientSecret,
    accessToken,
    refreshToken,
  });

  const auth = new google.auth.OAuth2({
    clientId,
    clientSecret,
  });
  auth.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const mail = google.gmail({ version: "v1", auth });
  const result = await mail.users.messages.list({
    userId: "mikerdupree@gmail.com",
    maxResults: 10,
  });
  const messages = [];
  for (const msg of result.data.messages) {

    console.log("msg", msg);

    const message = await mail.users.messages.get({userId: "me", id: msg.id });
    console.log("Message", message);
    messages.push(message.data);

  }
  console.log('messages', messages);

  res.status(200).json({messages});

};

export default TestHandler;
