import { useEffect, useState } from 'react';
import { useUserHook } from '../../hooks/userUserHook';
import axiosBackend from '../../configs/axiosBackend';
import ExpenseTable from '../ExpenseTable';

import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function Expense() {
    const userHook = useUserHook()
    const [expenses, setExpenses] = useState([])
    const [expensesUpdated, setExpensesUpdated] = useState(false)

    useEffect(() => {
        if (userHook.token) {
            axiosBackend.get('/expense/all', {
                headers: {
                    authorization: `Bearer ${userHook.token}`
                }
            })
                .then(res => {
                    setExpenses(res.data.expenses)
                })
                .catch(err => console.log(err))
        }
        if (expensesUpdated) {
            setExpensesUpdated(false)
        }
    }, [userHook.token, expensesUpdated])

    function handleExpenseTableUpdate() {
        setExpensesUpdated(true)
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
                        Expense Claims
                    </Typography>
                </Grid>
            </Grid>
            <Grid container mt={3}>
                <ExpenseTable expenses={expenses} onExpenseUpdate={handleExpenseTableUpdate} token={userHook.token}/>
            </Grid>
        </Container>
    )
}