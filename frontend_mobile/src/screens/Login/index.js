import { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { useTailwind } from "tailwind-rn";
import { useFormik } from 'formik'
import { useUserHook } from '@/src/hooks/useUserHook';
import axiosBackend from '@/src/configs/axiosBackend';

import LockIcon from '@/svgs/lock.svg'
import { Text, View, TextInput, Button } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import StyledButton from '@/src/components/StyledButton';
import StyledTextInput from '@/src/components/StyledTextInput';

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
    const userHook = useUserHook()
    const navigation = useNavigation()
    const tailwind = useTailwind()
    const [preCheckCompletedOnAccount, setPreCheckCompletedOnAccount] = useState(false)
    const [verifiedAccount, setVerifiedAccount] = useState(true)
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
            if (!user.isVerified) {
                setVerifiedAccount(false)
            }
            setPreCheckCompletedOnAccount(true)
        } catch (err) {
            console.log(err)
            if (err.response.status === 404 && err.response.data.message === 'Tenant not found') {
                formik.setFieldError('tenantName', err.response.data.message)
            } else if (err.response.status === 404 && err.response.data.message === 'User with the email not found') {
                formik.setFieldError('email', err.response.data.message)
            }
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
            // const res = await axiosBackend.post('/user/login', formValues)
            // console.log(res.data.token)
            // userHook.storeToken(res.data.token)
            // if (navigation.canGoBack()) {
            //     navigation.goBack()
            //     return
            // }
            // navigation.navigate('Home')
            const res = await userHook.signIn(formValues)
            if (res.success) {
                if (navigation.canGoBack()) {
                    navigation.goBack()
                    return
                }
            }
        } catch (err) {
            // if (err.response.status === 400 && err.response.data.message === 'Password is incorrect') {
            //     formik.setFieldError('password', err.response.data.message)
            // }
            console.log(err)
        }
    }

    return (
        <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
        >
            <View style={tailwind('items-center justify-center mt-32')}>
                <View style={[tailwind('rounded-full items-center'), {backgroundColor: '#9c27b0', width: 50}]}>
                    <LockIcon fill={"white"} width={30}/>
                </View>
                <View style={tailwind('mt-3')}>
                    <Text style={tailwind('text-lg font-medium')}>Log in account</Text>
                </View>
                <View style={tailwind('w-9/12 mt-4')}>
                    <View>
                        <StyledTextInput 
                            icon='database'
                            placeholder='Tenant Name *'
                            autoCapitalize='none'
                            onChangeText={formik.handleChange('tenantName')}
                            onBlur={formik.handleBlur('tenantName')}
                            value={formik.values.tenantName}
                            editable={!preCheckCompletedOnAccount}
                            selectTextOnFocus={!preCheckCompletedOnAccount}
                            error={formik.touched.tenantName && formik.errors.tenantName ? true : false}
                            helperText={formik.touched.tenantName && formik.errors.tenantName ? formik.errors.tenantName : null}
                        />
                    </View>
                    <View style={tailwind('mt-2')}>
                        <StyledTextInput 
                            icon='mail'
                            placeholder='Email Address *'
                            autoCapitalize='none'
                            autoCompleteType='email'
                            keyboardType='email-address'
                            onChangeText={formik.handleChange('email')}
                            onBlur={formik.handleBlur('email')}
                            value={formik.values.email}
                            editable={!preCheckCompletedOnAccount}
                            selectTextOnFocus={!preCheckCompletedOnAccount}
                            error={formik.touched.email && formik.errors.email ? true : false}
                            helperText={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                        />
                    </View>
                    {!preCheckCompletedOnAccount && <View style={tailwind('mt-2')}>
                        <StyledButton onPress={onClickNextHandler} label="Next" />
                    </View>}
                    {preCheckCompletedOnAccount && <>
                        <View style={tailwind('mt-2')}>
                            <StyledTextInput 
                                icon='key'
                                placeholder='Password *'
                                autoCapitalize='none'
                                secureTextEntry
                                autoCompleteType='password'
                                onChangeText={formik.handleChange('password')}
                                onBlur={formik.handleBlur('password')}
                                value={formik.values.password}
                                error={formik.touched.password && formik.errors.password ? true : false}
                                helperText={formik.touched.password && formik.errors.password ? formik.errors.password : 
                                    !verifiedAccount ? 'This is your first login, please set your password' : null}
                            />
                        </View>
                        <View style={tailwind('mt-2')}>
                            <StyledButton label={"Log in"} onPress={formik.handleSubmit}/>
                        </View>
                    </>}
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}