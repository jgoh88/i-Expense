import { useEffect, useState } from 'react';
import { useFormik } from 'formik'
import axiosBackend from '../../configs/axiosBackend';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';

import Modal from 'react-bootstrap/Modal';

export default function UserEditModal(props) {
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <Tooltip title="Edit">
                <IconButton 
                    aria-label="edit user"
                    onClick={() => setModalShow(true)}
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>
            <ModalForm 
                show={modalShow}
                onHide={() => setModalShow(false)}
                edittedUser={props.user}
                users={props.users}
                onUserEdit={props.onUserEdit}
                token={props.token}
            />
        </>
    )
}

function ModalForm(props) {
    const formik = useFormik({
        initialValues: {
            firstName: props.edittedUser.firstName,
            lastName: props.edittedUser.lastName,
            email: props.edittedUser.email,
            contactNo: props.edittedUser.contactNo,
            role: props.edittedUser.role,
            reportTo: props.edittedUser.reportTo || 'default',
        },
        validate,
        onSubmit: values => {
            onSubmitFormHandler(values);
        },
        enableReinitialize: true,
    });

    function handleClose() {
        props.onHide()
    }

    async function onSubmitFormHandler(formValues) {
        const reqBody = {
            id: props.edittedUser._id,
            data: {...formValues},
        }
        if (formValues.reportTo === 'default') {
            delete reqBody.data['reportTo']
        }
        try {
            await axiosBackend.put('/user', reqBody, {
                headers: {
                    authorization: `Bearer ${props.token}`
                }
            })
            handleClose()
            props.onUserEdit()
        } catch (err) {
            console.log(err)
            if (err.response.status === 400 && err.response.data.message === 'Email already taken') {
                formik.setFieldError('email', 'Email already used by another user')
            }
        }
    }

    return (
        <Modal
            show={props.show}
            size="lg"
            aria-labelledby="edit-user-modal"
            centered
            onHide={handleClose}
        >
            <Modal.Header closeButton style={{ backgroundColor: "#1976d2", color: "#fff" }}>
                <Modal.Title id="contained-modal-title-vcenter">
                    <Typography variant={'h6'}>
                        Edit user
                    </Typography>
                </Modal.Title>
            </Modal.Header>
            <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3, width: '100%' }}>
                <Modal.Body>
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
                            <FormControl fullWidth>
                                <InputLabel id="role">Role</InputLabel>
                                <Select
                                    name="role"
                                    id="role"
                                    value={formik.values.role}
                                    label="Role"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.role && formik.errors.role ? true : false}
                                >
                                    <MenuItem value={'default'} disabled>Select a role *</MenuItem>
                                    <MenuItem value={'user'}>User</MenuItem>
                                    <MenuItem value={'admin'}>Admin</MenuItem>
                                </Select>
                                <FormHelperText 
                                    error={formik.touched.role && formik.errors.role ? true : false}
                                >
                                    {formik.touched.role && formik.errors.role ? formik.errors.role : null}
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="role">Report to</InputLabel>
                                <Select
                                    name="reportTo"
                                    id="reportTo"
                                    value={formik.values.reportTo}
                                    label="Report to"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.reportTo && formik.errors.reportTo ? true : false}
                                >
                                    <MenuItem value={"default"} disabled>Select the person user will report to for approval of expense</MenuItem>
                                    {props.users.map((user) => <MenuItem key={user._id} value={user._id} disabled={props.edittedUser._id === user._id}>{user.firstName} {user.lastName}</MenuItem>)}
                                </Select>
                                <FormHelperText 
                                    error={formik.touched.reportTo && formik.errors.reportTo ? true : false}
                                >
                                    {formik.touched.reportTo && formik.errors.reportTo ? formik.errors.role : null}
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="submit"
                        variant="contained"
                    >
                        Save changes
                    </Button>
                </Modal.Footer>
            </Box> 
        </Modal>
    );
}

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

    if (values.role === 'default') {
        errors.role = "Required"
    }

    // if (values.reportTo === 'default') {
    //     errors.reportTo = "Required"
    // }

    return errors
}