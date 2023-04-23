import React, { MouseEvent, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import MuiMenu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
// Next-auth
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

// TODO find the proper type, or create a type for session.
const getRoute = (id: string, user: any) => {
  switch (id) {
    case "account":
      return `account/${user.sub}`;
  }

  return id;
};

export const AccountMenu = () => {
  const session = useSession();
  const router = useRouter();
  console.log("session", session);
  console.log("router", router);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLinkClick = (event: MouseEvent<HTMLElement>) => {
    const element = event.target as HTMLElement;
    router.push(getRoute(element.id, session.data.user));
    handleClose();
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  if (!session.data) {
    return null;
  }
  return (
    <>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            src={(session?.data?.user as { picture: string })?.picture}
            sx={{ width: 32, height: 32 }}
          />
        </IconButton>
      </Tooltip>
      <MuiMenu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem id="account" onClick={handleLinkClick}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem id="add" onClick={handleLinkClick}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem id="mail" onClick={handleLinkClick}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Mail
        </MenuItem>

        <MenuItem id="calendar" onClick={handleLinkClick}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Calendar
        </MenuItem>
        <MenuItem id="settings" onClick={handleLinkClick}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            signOut();
            handleClose();
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </MuiMenu>
    </>
  );
};

export default function Menu() {
  const session = useSession();
  if (!session.data) {
    return null;
  }
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Link href="/">
          <Typography sx={{ minWidth: 100 }}>Dashboard</Typography>
        </Link>
        <div style={{ flexGrow: 1 }} />
        <AccountMenu />
      </Box>
    </React.Fragment>
  );
}
