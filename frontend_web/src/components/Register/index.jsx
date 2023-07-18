import { useFormik } from 'formik'
import { useEffect, useState } from 'react';
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
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';


async function validate(values) {
    const errors = {};
 
    if (!values.firstName) {
      errors.firstName = 'Required';
    } 

    if (!values.lastName) {
        errors.lastName = 'Required';
    }

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    if (!values.contactNo) {
        errors.contactNo = 'Required';
    } else if (!/^\+?[0-9-]*$/i.test(values.contactNo)) {
        errors.contactNo = 'Must contain only number and hyphen';
    }

    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length < 6) {
        errors.password = 'Length must be 6 or more characters';
    }

    // if (!values.tenantName) {
    //     errors.tenantName = 'Required';
    // } else if (values.tenantName.length <= 4) {
    //     errors.tenantName = 'Length must be more than 4 characters';
    // } else if (values.tenantName.length > 20) {
    //     errors.tenantName = 'Length must be between 5 to 20 characters';
    // } else if (tenantNameUpdated) {
    //     setTenantNameUpdated(false)
    //     let tempTenantName
    //     if (/\s/i.test(values.tenantName)) {
    //         tempTenantName = formik.values.tenantName.replace(/\s/g, '-')
    //         console.log('executed')
    //     } else {
    //         tempTenantName = values.tenantName
    //     }
    //     console.log(tempTenantName)
    //     const res = await axiosBackend.get('/tenant', {params: {tenantName: tempTenantName}})
    //     if (res.data.message === 'unavailable') {
    //         errors.tenantName = `The name ${tempTenantName} is already taken`
    //     } else {
    //         if (/\s/g.test(values.tenantName)) {
    //             setFormattedTenantName(tempTenantName)
    //         } else {
    //             setFormattedTenantName('')
    //         }               
    //     }
    // }

    if (!values.companyName) {
        errors.companyName = 'Required';
    }

    if (!values.companyContactNo) {
        errors.companyContactNo = 'Required';
    } else if (!/^\+?[0-9-]*$/i.test(values.companyContactNo)) {
        errors.companyContactNo = 'Must contain only number and hyphen';
    }

    if (!values.address) {
        errors.address = 'Required';
    }

    return errors
}

export default function Register() {
    const [nextFormPage, setNextFormPage] = useState(false)
    const [tenantNameError, setTenantNameError] = useState({})
    const [formattedTenantName, setFormattedTenantName] = useState('')
    const [checkingTenantName, setCheckingTenantName] = useState(false)
    const userHook = useUserHook()
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            contactNo: '',
            password: '',
            tenantName: '',
            companyName: '',
            address: '', 
            companyContactNo: '',
        },
        validate,
        onSubmit: values => {
            onSubmitRegisterFormHandler(values);
        },
    });

    useEffect(() => {
        const errors = {}
        if (!formik.values.tenantName) {
            errors.tenantName = 'Required';
        } else if (formik.values.tenantName.length <= 4) {
            errors.tenantName = 'Length must be more than 4 characters';
        } else if (formik.values.tenantName.length > 20) {
            errors.tenantName = 'Length must be between 5 to 20 characters';
        } else {
            setCheckingTenantName(true)
            let tempTenantName
            if (!/^[A-Z0-9-]$/i.test(formik.values.tenantName)) {
                tempTenantName = formik.values.tenantName.replace(/[^\w ]|_|\s/g, '-')
            } else {
                tempTenantName = formik.values.tenantName
            }
            axiosBackend.get('/tenant', {params: {tenantName: tempTenantName}})
                .then(res => {
                    if (res.data.message === 'unavailable') {
                        errors.tenantName = `The name ${tempTenantName} is already taken`
                    } else {
                        if (!/^[A-Z0-9-]$/i.test(formik.values.tenantName)) {
                            setFormattedTenantName(tempTenantName)
                        } else {
                            setFormattedTenantName('')
                        }               
                    }
                    setCheckingTenantName(false)
                })
        }
        setTenantNameError(errors)
    }, [formik.values.tenantName])

    useEffect(() => {
        if (userHook.user) {
            navigate('/')
        }
    }, [userHook.user])

    function onClickNextPageHandler() {
        if(formik.errors.firstName || formik.errors.lastName || formik.errors.email || formik.errors.contactNo || formik.errors.password) {
            formik.setTouched({
                firstName: true,
                lastName: true,
                email: true,
                contactNo: true,
                password: true,
            })
            return
        }
        setNextFormPage(true)
    }

    function onClickBackPageHandler() {
        setNextFormPage(false)
    }

    async function onSubmitRegisterFormHandler(formValues) {
        if (Object.keys(tenantNameError).length !== 0) {
            return
        }
        const formData = {
            tenantName: formattedTenantName ?? formValues.tenantName,
            companyName: formValues.companyName,
            address: formValues.address,
            companyContactNo: formValues.companyContactNo,
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            email: formValues.email,
            password: formValues.password,
            contactNo: formValues.contactNo,
        }
        try {
            const res = await axiosBackend.post('/tenant', formData)
            userHook.storeToken(res.data.token)
            navigate('/')
        } catch (err) {
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
                    <AppRegistrationIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register account
                </Typography>
                <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3, width: '100%' }}>
                    {
                        !nextFormPage 
                        ? <>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="firstName"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.firstName}
                                        error={formik.touched.firstName && formik.errors.firstName ? true : false}
                                        helperText={formik.touched.firstName && formik.errors.firstName ? formik.errors.firstName : null}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="family-name"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.lastName}
                                        error={formik.touched.lastName && formik.errors.lastName ? true : false}
                                        helperText={formik.touched.lastName && formik.errors.lastName ? formik.errors.lastName : null}
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
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.email}
                                        error={formik.touched.email && formik.errors.email ? true : false}
                                        helperText={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="contactNo"
                                        label="Contact Number"
                                        id="contactNo"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.contactNo}
                                        error={formik.touched.contactNo && formik.errors.contactNo ? true : false}
                                        helperText={formik.touched.contactNo && formik.errors.contactNo ? formik.errors.contactNo : null}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.password}
                                        error={formik.touched.password && formik.errors.password ? true : false}
                                        helperText={formik.touched.password && formik.errors.password ? formik.errors.password : null}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick = {onClickNextPageHandler}
                            >
                                Next
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="/login" variant="body2">
                                        Already have an account? Log in
                                    </Link>
                                </Grid>
                            </Grid>
                        </>
                        : <>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="tenantName"
                                        required
                                        fullWidth
                                        id="tenantName"
                                        label="Tenant Name"
                                        autoFocus
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.tenantName}
                                        // error={formik.touched.tenantName && formik.errors.tenantName ? true : false}
                                        // helperText={formik.touched.tenantName && formik.errors.tenantName ? formik.errors.tenantName : 
                                        //     formik.touched.tenantName && formattedTenantName !== '' ? `Tenant will be created as ${formattedTenantName}` : 
                                        //     formik.touched.tenantName && formik.values.tenantName ? `${formik.values.tenantName} is available` : null }
                                        error={formik.touched.tenantName && tenantNameError.tenantName ? true : false}
                                        helperText={formik.touched.tenantName && tenantNameError.tenantName ? tenantNameError.tenantName : 
                                            formik.touched.tenantName && formattedTenantName !== '' && !checkingTenantName ? `Tenant will be created as ${formattedTenantName}` : 
                                            formik.touched.tenantName && formik.values.tenantName && formattedTenantName === '' && !checkingTenantName ? `${formik.values.tenantName} is available` : null }
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="companyName"
                                        label="Company Name"
                                        name="companyName"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.companyName}
                                        error={formik.touched.companyName && formik.errors.companyName ? true : false}
                                        helperText={formik.touched.companyName && formik.errors.companyName ? formik.errors.companyName : null}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="address"
                                        label="Company Address"
                                        name="address"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.address}
                                        error={formik.touched.address && formik.errors.address ? true : false}
                                        helperText={formik.touched.address && formik.errors.address ? formik.errors.address : null}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="companyContactNo"
                                        label="Company Contact Number"
                                        id="companyContactNo"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.companyContactNo}
                                        error={formik.touched.companyContactNo && formik.errors.companyContactNo ? true : false}
                                        helperText={formik.touched.companyContactNo && formik.errors.companyContactNo ? formik.errors.companyContactNo : null}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={onClickBackPageHandler}
                                    >
                                        Back
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Register
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    }
                    
                </Box>
            </Box>
        </Container>
    );
}