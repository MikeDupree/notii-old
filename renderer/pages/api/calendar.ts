import type { NextApiHandler } from "next";
import { getServerSession } from "next-auth/next";
import { getSession } from "next-auth/react";
import authOptions from "./auth/[...nextauth]";
import { google } from "googleapis";
import { log } from "console";

const CalendarHandler: NextApiHandler = async (req, res) => {
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
  if (!session || !session.user?.accessToken) {
    res.status(401);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const accessToken = session?.user?.access_token;
  const refreshToken = session?.user?.refresh_token;

  console.log({
    clientId,
    clientSecret,
    accessToken,
    refreshToken,
  });

  if (!accessToken) {
    res.status(401);
  }

  const auth = new google.auth.OAuth2({
    clientId,
    clientSecret,
  });
  auth.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const calendar = google.calendar({ version: "v3", auth });

  let d = new Date();
  d.setDate(d.getDate() - 3);
  const timeMin = d.toJSON()
  d.setDate(d.getDate() + 6);
  const timeMax = d.toJSON();
  console.log("timeMin", timeMin);
  console.log("timeMax", timeMax);
  // const result = await calendar.events.list();
  let eventsResult;
  try {
    eventsResult = await calendar.events.list({
      calendarId: "mikerdupree@gmail.com",
      timeMax,
      timeMin,
    });
  } catch (e) {
    console.log(e);
  }

  if (!eventsResult.data.items) {
    return res.status(400);
  }

  console.log("Event Data", eventsResult?.data);
  // console.log("events.list", eventsResult.data);

  const result = await calendar.calendarList.list();
  const { items, ...rest } = eventsResult.data
  const calendarResponse = {
    ...rest,
    events: items || [],
    calendars: result.data.items,
  };

  res.status(200).json(calendarResponse);
};

export default CalendarHandler;
