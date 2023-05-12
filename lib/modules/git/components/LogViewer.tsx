import React from "react";
import { Divider, Typography } from "@mui/material";
type Props = {
  logs: {
    commit: {
      message: string;
      author: { name: string };
      committer: { name: string };
    };
  }[];
};

const LogViewer = ({ logs }: Props) => {
  if (!logs) return null;
  return (
    <div>
      <Typography variant="body2" className="p-2 text-center">
        Logs
      </Typography>

      <ul>
        {logs.map((log) => {
          return (
            <li>
              <Divider />
              <Typography
                variant="subtitle1"
                className="p-2 text-slate-700 dark:text-slate-400"
              >
                {log.commit.message}
              </Typography>
              <Typography variant="caption" className="p-2">
                <b>Author:</b> {log.commit.author.name}
              </Typography>
              <Typography variant="caption" className="p-2">
                <b>Committer:</b> {log.commit.committer.name}
              </Typography>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LogViewer;
