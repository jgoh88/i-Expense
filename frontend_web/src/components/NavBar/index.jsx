import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserHook } from "../../hooks/userUserHook"

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
import Link from '@mui/material/Link';

export default function NavBar() {
    const userHook = useUserHook()

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    function handleOpenNavMenu(e) {
        setAnchorElNav(e.currentTarget);
    }

    function handleCloseNavMenu() {
        setAnchorElNav(null);
    }

    function handleOpenUserMenu(e) {
        setAnchorElUser(e.currentTarget)
    }
    
    function handleCloseUserMenu() {
        setAnchorElUser(null)
    }

    function handleLogout() {
        userHook.removeToken() 
    }

    return (
        <AppBar position="sticky">
            <Container maxWidth="xl" >
                <Toolbar disableGutters>
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href="/"
                    sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    i-Expense
                </Typography>
                {userHook?.user &&
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                            <MenuItem>
                                <Typography textAlign="center"><Link href="/expense" color="inherit" underline="none">Expense</Link></Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography textAlign="center"><Link href="/admin" color="inherit" underline="none">Admin</Link></Typography>
                            </MenuItem>
                        </Menu>
                    </Box> 
                }
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href="/"
                    sx={{
                        mr: 2,
                        display: { xs: 'flex', md: 'none' },
                        flexGrow: 1,
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    i-Expense
                </Typography>
                
                {userHook?.user 
                ? <>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }}}>
                        <Link href="/expense" color="inherit" underline="none">
                            <Button
                                sx={{ my: 2, mx: 1, color: 'white', display: 'block' }}
                            >
                                Expense
                            </Button>
                        </Link>
                        <Link href="/admin" color="inherit" underline="none">
                            <Button
                                sx={{ my: 2, mx: 1, color: 'white', display: 'block' }}
                            >
                                Admin
                            </Button>
                        </Link>
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open user menu">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt="Remy Sharp" src={userHook?.user?.profileImg} />
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
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography textAlign="center" onClick={handleLogout}>Log out</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </>
                : <>
                    <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' }, marginLeft: 'auto'}}>
                        <Link href="/login" color="inherit" underline="none">
                            <Button
                                sx={{ my: 2, mx: 1, color: 'white', display: 'block' }}
                            >
                                Login
                            </Button>
                        </Link>
                        <Link href="/register" color="inherit" underline="none">
                            <Button
                                sx={{ my: 2, mx: 1, color: 'white', display: 'block' }}
                            >
                                Register
                            </Button>
                        </Link>
                    </Box>
                    <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
                        <Link href="/login" color="inherit" underline="none">
                            <Button
                                sx={{ my: 2, mx: 1, color: 'white', display: 'block' }}
                            >
                                Login/ Register
                            </Button>
                        </Link>
                    </Box>
                </>
                }  
                </Toolbar>
            </Container>
        </AppBar>
    )
}