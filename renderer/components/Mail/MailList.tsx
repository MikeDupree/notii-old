import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CommentIcon from "@mui/icons-material/Comment";

export default function MailList({ messages }) {
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  function get(key: string, message: any) {
    if (!message.payload.headers) return;

    for (const header of message.payload.headers) {
      if (header.name === key) {
        return header.value;
      }
    }
  }

  return (
    <List sx={{ width: "100%", maxWidth: 1200, bgcolor: "background.paper" }}>
      {messages.map((msg) => {
        const { id } = msg;
        const labelId = `mail-list-label-${id}`;

        return (
          <ListItem
            key={id}
            secondaryAction={
              <IconButton edge="end" aria-label="comments">
                <CommentIcon />
              </IconButton>
            }
            sx={{ borderBottom: "1px solid gray" }}
            disablePadding
          >
            <ListItemButton role={undefined} onClick={handleToggle(id)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>

              <div style={{display: 'flex', flexDirection: 'column' }}>
                <Typography id={labelId}  sx={{fontWeight: '700!important' }}>
                  {get("Subject", msg)}
                </Typography>
              <ListItemText id={`${labelId}-snippet`} primary={msg.snippet} sx={{color: '#868686'}} />
            </div>
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
