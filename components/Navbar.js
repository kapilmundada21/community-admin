import * as React from 'react';
import { useEffect } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar({ logout }) {
  const [user, setUser] = React.useState();
  // const pages = ['Login', 'Signup'];
  // const pagesRedirects = ['/login', '/signup'];
  const pages = ['Accounts', 'News'];
  const pagesRedirects = ['/accounts', '/news'];
  const userPages = ['Accounts', 'News'];
  const userPagesRedirects = ['/accounts', '/news'];
  const mobilePages = ['All Users', 'Pending Users', 'Admin/Supervisor', 'All News', 'Pending News']
  const mobilePagesRedirects = ['/accounts/allusersTable', '/accounts/pendingusersTable', '/accounts/adminSupervisorTable', '/news/allNews', '/news/pendingNews']
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
  const settingsRedirects = ['/profile', '/account', '/dashboard', ''];
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  useEffect(() => {
    let myUser = JSON.parse(localStorage.getItem("user"));
    setUser(myUser);
  }, []);

  const extractFirstCharacters = (str) => {
    const words = str.split(' ');
    const firstCharacters = [];
  
    for (let i = 0; i < words.length; i++) {
      if (words[i]) {
        firstCharacters.push(words[i][0].toUpperCase());
      }
    }
  
    return firstCharacters.join('');
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="sticky" sx={{ zIndex: 5 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Image src={'/images/clogo.png'} height={30} width={30} alt='logo' loading="lazy" className='hidden md:block mr-2 w-auto h-auto' />
          <Typography
            variant="h6"
            noWrap
            component="span"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.05rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Link href={'/'}>Community</Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, ml: -2, mr: -1 }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {
                !user &&
                pages.map((page, index) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Link href={pagesRedirects[index]} key={index}>
                      <Typography textAlign="center">{page}</Typography>
                    </Link>
                  </MenuItem>
                ))
              }
              {
                user &&
                mobilePages.map((page, index) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Link href={mobilePagesRedirects[index]} key={index}>
                      <Typography textAlign="center">{page}</Typography>
                    </Link>
                  </MenuItem>
                ))
              }
            </Menu>
          </Box>

          <Image src={'/images/clogo.png'} height={30} width={30} alt='logo' loading="lazy" className='md:hidden mr-2 w-auto h-auto' />
          <Typography
            variant="h5"
            noWrap
            component="span"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 600,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Link href={'/'}>Community</Link>
          </Typography>

          {
            !user &&
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page, index) => (
                <Link href={pagesRedirects[index]} key={index}>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page}
                  </Button>
                </Link>
              ))}
            </Box>
          }
          {
            user &&
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {userPages.map((page, index) => (
                <Link href={userPagesRedirects[index]} key={index}>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page}
                  </Button>
                </Link>
              ))}
            </Box>
          }

          {
            user &&
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar>{extractFirstCharacters(user.name).slice(0,2)}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting, index) => (
                  <MenuItem key={index} onClick={setting === 'Logout' ? logout : handleCloseUserMenu}>
                    <Link href={settingsRedirects[index]}>
                      <Typography textAlign="center">{setting}</Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
}
