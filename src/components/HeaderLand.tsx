import { Box, CssBaseline, AppBar, Toolbar, IconButton, Typography, Drawer, Divider, List, Stack } from "@mui/material"
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import { GoogleButtonLogin } from "./Atomic/GoogleButtonLogin";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  title: string
}

const drawerWidth = 240;

export const HeaderLand = (props: Props) => {
  const { title } = props;

  // const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Stack direction="row" spacing={2}>
        <div>
          <Typography variant="h6" sx={{ my: 2 }}>
            <a href="https://www.glimmind.com">{title}</a>
          </Typography>
        </div>
        <div>
          <List sx={{ display: 'flex', alignItems: 'center', margin: 0, padding: 0 }}>

          </List>
        </div>
      </Stack>
      <Divider />

    </Box>
  );

  const container = () => window.document.body;

  return <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <AppBar component="nav">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          {title}
        </Typography>
        <GoogleButtonLogin></GoogleButtonLogin>
      </Toolbar>
    </AppBar>
    <Box component="nav">
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
    </Box>

  </Box>
}