import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EventIcon from "@mui/icons-material/Event";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

export default function AddActivityPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <>
      <Toolbar />
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2" sx={{ color: "white", textTransform: "uppercase" }}>
          Navigation
        </Typography>
        <Divider sx={{ mt: 1, backgroundColor: "white" }} />
      </Box>
      <List>
        <ListItem button dense component="a" href="/Backoffice/Dashboard">
          <ListItemIcon>
            <HomeIcon fontSize="small" sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" primaryTypographyProps={{ fontSize: 14, color: "white" }} />
        </ListItem>
        <ListItem button dense selected component="a" href="/Backoffice/AddActivityPage">
          <ListItemIcon>
            <AddCircleIcon fontSize="small" sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Ajouter une activité" primaryTypographyProps={{ fontSize: 14, color: "white" }} />
        </ListItem>
        <ListItem button dense component="a" href="/backoffice/AgendaDayView">
          <ListItemIcon>
            <EventIcon fontSize="small" sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Calendrier" primaryTypographyProps={{ fontSize: 14, color: "white" }} />
        </ListItem>
        <ListItem button dense component="a" href="/backoffice/events">
          <ListItemIcon>
            <EventIcon fontSize="small" sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Mes evenements" primaryTypographyProps={{ fontSize: 14, color: "white" }} />
        </ListItem>
        <ListItem button dense component="a" href="/backoffice/ajouter-reservation">
          <ListItemIcon>
            <AddCircleIcon fontSize="small" sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Ajouter une reservation" primaryTypographyProps={{ fontSize: 14, color: "white" }} />
        </ListItem>
      </List>

      <Box sx={{ px: 2, py: 1, mt: 2 }}>
        <Typography variant="subtitle2" sx={{ color: "white", textTransform: "uppercase" }}>
          Mon compte
        </Typography>
        <Divider sx={{ mt: 1, backgroundColor: "white" }} />
      </Box>
      <List>
        <ListItem button dense component="a" href="/Backoffice/EditAccount">
          <ListItemIcon>
            <HomeIcon fontSize="small" sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Editer" primaryTypographyProps={{ fontSize: 14, color: "white" }} />
        </ListItem>
      </List>
    </>
  );

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1201, bgcolor: "#021832" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
            px: isMobile ? 1 : 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: "none" } }}
                aria-label="open drawer"
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box
              component="img"
              src="/logo/wawwhite.png"
              alt="Logo"
              sx={{
                height: 60,
                width: "auto",
                ml: 2,
                mr: 2,
                maxWidth: 100,
              }}
            />
            {!isMobile && (

            <Typography
              variant={isMobile ? "h6" : "h6"}
              noWrap
              component="div"
              sx={{ color: "white", flexShrink: 1 }}
            >
              WHEN AND WHERE
            </Typography>
            )}

          </Box>
            {!isMobile && (

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "default",
              flexGrow: 1,
              justifyContent: isMobile ? "center" : "center",
              minWidth: 0,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              Bienvenue dans Notre plateforme
            </Typography>
          </Box>
          )}


          <Button
            variant="outlined"
            color="white"
            startIcon={<LogoutIcon />}
            sx={{ color: "white", textTransform: "none", flexShrink: 0 }}
          onClick={() => {
              localStorage.removeItem("businessId");
              localStorage.removeItem("businessImage");
              window.location.href = "/"; // redirection après logout
            }}
          >
            Se déconnecter
          </Button>

        </Toolbar>
      </AppBar>

      {/* Drawer responsive */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor: "#021832",
              color: "white",
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#021832",
              color: "white",
              "& .MuiListItemIcon-root, & .MuiListItemText-root, & a": {
                color: "white",
              },
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}

    </>
  );
}
