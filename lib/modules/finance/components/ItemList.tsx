import React, { useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import { Checkbox, Typography } from "@mui/material";
import Toolbar from "./Toolbar";

interface Props {
  items: any[];
  onSelect?: (selected: string[]) => void;
}
// {
//     "date": "03/20/2023",
//     "label": "PACKING HOUSE L   _M",
//     "payment": "44.88",
//     "deposit": ""
// }
export default function ItemList({ items, onSelect }: Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  console.log("selectedItems", selectedItems);
  const handleCheckboxInput = (item) => {
    console.log(item);
    if (selectedItems.includes(item.label)) return;

    setSelectedItems([...selectedItems, item.label]);
    onSelect?.([...selectedItems, item.label]);
  };

  return (
    <div className="finance-list-container">
      <Toolbar />
      <List sx={{ width: "100%", maxWidth: 960, bgcolor: "background.paper" }}>
        {items?.map((item) => {
          return (
            <ListItem>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ margin: "0 10px 0" }}>
                  <Checkbox onClick={() => handleCheckboxInput(item)} />
                </Box>
                <Box sx={{ margin: "0 10px 0" }}>
                  <ListItemAvatar>
                    <Avatar>
                      <ImageIcon />
                    </Avatar>
                  </ListItemAvatar>
                </Box>
                <Box sx={{ margin: "0 10px 0" }}>
                  <Typography variant="subtitle2">{item.date}</Typography>
                </Box>
                <Box sx={{ margin: "0 10px 0" }}>
                  <Typography variant="subtitle2">{item.label}</Typography>
                </Box>
                {item.payment ? (
                  <Box sx={{ margin: "0 10px 0" }}>
                    <Typography variant="subtitle2">
                      - {item.payment}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ margin: "0 10px 0" }}>
                    <Typography variant="subtitle2">
                      + {item.deposit}
                    </Typography>
                  </Box>
                )}
              </Box>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
