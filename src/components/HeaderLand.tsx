import { Box, CssBaseline, AppBar, Toolbar, IconButton, Typography, Button, Drawer, Divider, List, ListItem, ListItemButton, ListItemText } from "@mui/material"
import { container } from "googleapis/build/src/apis/container/index.js"
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
    title: string
  }

  
const drawerWidth = 240;
const navItems = ['Home', 'About', 'Contact'];

export const HeaderLand = (props: Props) => {
    const { window, title } = props;

    // const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
  

      
    const handleDrawerToggle = () => {
      setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ my: 2 }}>
            <a href="https://www.glimmind.com">{title}</a>
          </Typography>
          <Divider />
          <List>
            {/* <Button onClick={handleGoLoginClick}>Go to Login</Button> */}
            {/* {navItems.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton sx={{ textAlign: 'center' }}>
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))} */}
          </List>
        </Box>
      );

    const container = window !== undefined ? () => window().document.body : undefined;


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
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {/* {navItems.map((item) => (
                        <Button key={item} sx={{ color: '#fff' }}>
                            {item}
                        </Button>
                    ))} */}
                </Box>
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