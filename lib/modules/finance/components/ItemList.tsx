import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import { Typography } from "@mui/material";

interface Props {
  items: any[];
}
// {
//     "date": "03/20/2023",
//     "label": "PACKING HOUSE L   _M",
//     "payment": "44.88",
//     "deposit": ""
// }
export default function FolderList({ items }: Props) {
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {items?.map((item) => {
        return (
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={item.label} secondary={<>
              <Typography variant="subtitle2">{item.date}</Typography>
              {item.payment ?? (<Typography variant="subtitle2" sx={{color: 'red'}}>- {item.payment}</Typography>)}
              {item.deposit ?? (<Typography variant="subtitle2" sx={{color: 'green'}}>+ {item.deposit}</Typography>)}
        </>} />
          </ListItem>
        );
      })}
    </List>
  );
}
