import { useEffect, useState } from 'react';
import { useUserHook } from '../../hooks/userUserHook';
import axiosBackend from '../../configs/axiosBackend';
import UserTable from '../UserTable';
import UserAddModal from '../UserAddModal';

import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function Admin() {
    const userHook = useUserHook()
    const [users, setUsers] = useState([])
    const [usersUpdated, setUsersUpdated] = useState(false)

    useEffect(() => {
        if (userHook.token) {
            axiosBackend.get('/user/all', {
                headers: {
                    authorization: `Bearer ${userHook.token}`
                }
            })
                .then(res => {
                    setUsers(res.data.users)
                })
                .catch(err => console.log(err))
        }
        if (usersUpdated) {
            setUsersUpdated(false)
        }
    }, [userHook.token, usersUpdated])

    function handleUserTableUpdate() {
        setUsersUpdated(true)
    }

    return (
        <Container component="main" maxWidth="xl">
            <CssBaseline />
            <Grid container>
                <Grid 
                    container 
                    item 
                    mt={3}
                    justifyContent="space-between"
                >
                    <Typography variant={'h5'} fontWeight={600} >
                        Manage users
                    </Typography>
                    <UserAddModal users={users} token={userHook.token} onUserAdd={handleUserTableUpdate} />
                </Grid>
            </Grid>
            <Grid container mt={3}>
                <UserTable users={users} onUserEdit={handleUserTableUpdate} token={userHook.token}/>
            </Grid>
        </Container>
    )
}