import { useFormik } from 'formik'
import { useState, useEffect } from 'react';
import { useUserHook } from '../../hooks/userUserHook';
import { useNavigate } from 'react-router-dom';
import axiosBackend from '../../configs/axiosBackend';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

function validate(values) {
    const errors = {};
 
    if (!values.tenantName) {
        errors.tenantName = 'Required';
    } else if (!/^[A-Z0-9-]*$/i.test(values.tenantName)) {
        errors.tenantName = 'Must only contain aphabet, numbers and hyphen';
    } else if (values.tenantName.length <= 4) {
        errors.tenantName = 'Length must be more than 4 characters';
    } else if (values.tenantName.length > 20) {
        errors.tenantName = 'Length must be between 5 to 20 characters';
    }

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length < 6) {
        errors.password = 'Length must be 6 or more characters';
    }

    return errors
}

export default function Login() {
    const [preCheckCompletedOnAccount, setPreCheckCompletedOnAccount] = useState(false)
    const [verifiedAccount, setVerifiedAccount] = useState(true)
    const userHook = useUserHook()
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            tenantName: '',
            email: '',
            password: '',
        },
        validate,
        onSubmit: values => {
            onSubmitLoginFormHandler(values);
        },
    });

    useEffect(() => {
        if (userHook.user) {
            navigate('/')
        }
    }, [userHook.user])

    async function onClickNextHandler() {
        if(formik.errors.tenantName || formik.errors.email) {
            formik.setTouched({
                tenantName: true,
                email: true,
            })
            return
        }
        try {
            const res = await axiosBackend.get('/user/login', {params: {tenantName: formik.values.tenantName, email: formik.values.email}})
            const user = res.data.user
            if (user.role !== 'admin') {
                formik.setFieldError('email', 'User with this email is not an admin')
                return
            }
            if (!user.isVerified) {
                setVerifiedAccount(false)
            }
            setPreCheckCompletedOnAccount(true)
        } catch (err) {
            if (err.response.status === 404 && err.response.data.message === 'Tenant not found') {
                formik.setFieldError('tenantName', err.response.data.message)
            } else if (err.response.status === 404 && err.response.data.message === 'User with the email not found') {
                formik.setFieldError('email', err.response.data.message)
            }
            console.log(err)
        }
    }

    async function onSubmitLoginFormHandler(formValues) {
        if (!verifiedAccount) {
            try {
                await axiosBackend.put('/user/login', formValues)
            } catch (err) {
                console.log(err)
            }
        }
        try {
            const res = await axiosBackend.post('/user/login', formValues)
            userHook.storeToken(res.data.token)
            navigate('/')
        } catch (err) {
            if (err.response.status === 400 && err.response.data.message === 'Password is incorrect') {
                formik.setFieldError('password', err.response.data.message)
            }
            console.log(err)
        }
    }

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Log in account
                </Typography>
                <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3, width: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="tenantName"
                                required
                                fullWidth
                                id="tenantName"
                                label="Tenant Name"
                                autoFocus
                                disabled={preCheckCompletedOnAccount}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.tenantName}
                                error={formik.touched.tenantName && formik.errors.tenantName ? true : false}
                                helperText={formik.touched.tenantName && formik.errors.tenantName ? formik.errors.tenantName : null}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                disabled={preCheckCompletedOnAccount}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                error={formik.touched.email && formik.errors.email ? true : false}
                                helperText={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                            />
                        </Grid>
                        {preCheckCompletedOnAccount && <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                error={formik.touched.password && formik.errors.password ? true : false}
                                helperText={formik.touched.password && formik.errors.password ? formik.errors.password : 
                                    !verifiedAccount ? 'This is your first login, please set your password' : null}
                            />
                        </Grid>}
                    </Grid>
                    {!preCheckCompletedOnAccount ? <>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick = {onClickNextHandler}
                        >
                            Next
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/register" variant="body2">
                                    Don't have an account? Register
                                </Link>
                            </Grid>
                        </Grid>
                    </>
                    : <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Log in
                    </Button>}       
                </Box>
            </Box>
        </Container>
    )
}