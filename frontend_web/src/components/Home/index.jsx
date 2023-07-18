import { useUserHook } from "../../hooks/userUserHook"

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function Home() {
    const userHook = useUserHook()

    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 35,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {userHook?.user && <Typography 
                    fontWeight={700}
                    align={"center"}
                    variant={'h1'}
                >
                    Welcome, {userHook.user.firstName} {userHook.user.lastName}!
                </Typography>}
                
            </Box>
        </Container>
    )
}