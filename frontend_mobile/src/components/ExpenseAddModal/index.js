import { useState } from 'react';
import { useUserHook } from "@/src/hooks/useUserHook";
import { useTailwind } from "tailwind-rn";
import { useNavigation } from "@react-navigation/native";
import axiosBackend from '@/src/configs/axiosBackend';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Modal, Text, Pressable, View, TouchableOpacity} from 'react-native';
import StyledButton from '../StyledButton';
import StyledTextInput from '../StyledTextInput';

export default function ExpenseAddModal({onExpenseUpdate}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState('')
    const userHook = useUserHook()
    const tailwind = useTailwind()
    const navigation = useNavigation()

    async function onSubmitFormHandler(formValues) {
        try {
            const res = await axiosBackend.post('/expense', formValues, {
                headers: {
                    authorization: `Bearer ${userHook.auth.token}`
                }
            })
            onExpenseUpdate()
            onModalCloseHandler()
            navigation.navigate('ExpenseEdit', { 
                expense: res.data.expense
            })
        } catch (err) {
            console.log(err)
            if (err.response.status === 400 && err.response.data.message === 'Missing approver for user') {
                setError('There is no approver assigned to you. Please contact admin team.')
            }
        }
    }

    function onModalCloseHandler() {
        setModalVisible(!modalVisible);
    }

    return (
        <View>
            <Pressable
                onPress={() => setModalVisible(true)}
            >
                <Icon name="add" size={32} color="white" />
            </Pressable>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    onModalCloseHandler()
                }}
            >
                <View style={[tailwind('flex-1 justify-center items-center'), {backgroundColor: 'rgba(221, 221, 221, 0.7)'}]}>
                    <View style={tailwind('w-5/6 rounded-md bg-white p-3 items-center')}>
                        <View style={tailwind('w-full flex-row justify-between')}>
                            <Text style={tailwind('text-base font-bold')}>Create new expense</Text>
                            <Pressable onPress={onModalCloseHandler}>
                                <Icon name="close" size={24} color="gray" />
                            </Pressable>
                            
                        </View>
                        
                        <Formik
                            initialValues={{title: '' }}
                            validationSchema={Yup.object({
                                title: Yup.string()
                                .min(10, 'Must be 10 characters or more')
                                .required('Required'),
                            })}
                            onSubmit={values => 
                                onSubmitFormHandler(values)
                            }
                            >
                            {formik => (
                                <>
                                    <StyledTextInput
                                        placeholder='Expense Title *'
                                        onChangeText={formik.handleChange('title')}
                                        onBlur={formik.handleBlur('title')}
                                        value={formik.values.title}
                                        error={formik.touched.title && formik.errors.title ? true : false}
                                        helperText={formik.touched.title && formik.errors.title ? formik.errors.title : null}
                                        style={tailwind('mt-3')}
                                    />
                                    {error && <View style={tailwind('w-full')}>
                                        <Text style={[tailwind('text-xs'), {color: '#d32f2f'}]}>{error}</Text>
                                    </View>
                                    }
                                    <StyledButton label={"create"} onPress={formik.handleSubmit} style={tailwind('mt-4')}/>
                                </>
                            )}
                        </Formik>
                    </View>
                </View>
            </Modal>
        </View>
    )
}