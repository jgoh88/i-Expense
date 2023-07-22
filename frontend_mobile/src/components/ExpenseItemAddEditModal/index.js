import { useState } from 'react';
import { useUserHook } from "@/src/hooks/useUserHook";
import { useTailwind } from "tailwind-rn";
import { Formik } from 'formik';
import * as Yup from 'yup';

import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Modal, Text, Pressable, View, ScrollView} from 'react-native';
import StyledButton from '../StyledButton';
import StyledTextInput from '../StyledTextInput';
import StyledDropdownInput from '../StyledDropdownInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import StyledDatePicker from '../StyledDatePicker';


const categories = ['meal', 'mileage', 'travel', 'accommodation', 'others']

export default function ExpenseItemAddEditModal({children, expenseItem, expense, setExpense, readOnly, style}) {
    const initialExpenseItem = expenseItem ? expenseItem : {
        description: '',
        category: '',
        date: new Date(),
        amount: '',
        note: '',
    }
    const [expenseItemState, setExpenseItemState] = useState(initialExpenseItem)
    const [modalVisible, setModalVisible] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const tailwind = useTailwind()

    async function onSubmitFormHandler(formValues) {
        const tempExpense = {...expense}
        if (!expenseItem) {
            tempExpense.expenseItems.push(formValues)
        } else{
            const idx = tempExpense.expenseItems.findIndex(item => item._id === expenseItem._id)
            tempExpense.expenseItems[idx] = {...tempExpense.expenseItems[idx], ...formValues}
        }
        setExpense(tempExpense)
        onModalCloseHandler()
    }

    function onModalCloseHandler() {
        setModalVisible(!modalVisible);
    }

    return (
        <>
            <Pressable
                onPress={() => setModalVisible(true)}
                style={style}
            >
                {children}
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
                            <Text style={tailwind('text-base font-bold')}>{expenseItem ? 'Edit expense item' : 'New expense item'}</Text>
                            <Pressable onPress={onModalCloseHandler}>
                                <Icon name="close" size={24} color="gray" />
                            </Pressable>
                        </View>
                        <Formik
                            initialValues={initialExpenseItem}
                            validationSchema={Yup.object({
                                description: Yup.string()
                                    .min(5, 'Must be 5 characters or more')
                                    .required('Required'),
                                category: Yup.string()
                                    .required('Required'),
                                date: Yup.date()
                                    .required('Required'),
                                amount: Yup.number()
                                    .min(1, 'Must be more than 0')
                                    .required('Required'),                                
                            })}
                            onSubmit={values => 
                                onSubmitFormHandler(values)
                            }
                            >
                            {formik => (
                                <KeyboardAwareScrollView
                                        resetScrollToCoords={{ x: 0, y: 0 }}
                                        scrollEnabled={true}
                                        style={tailwind('w-full')}
                                    >
                                    <StyledTextInput
                                        placeholder='Expense Description *'
                                        onChangeText={formik.handleChange('description')}
                                        onBlur={formik.handleBlur('description')}
                                        value={formik.values.description}
                                        error={formik.touched.description && formik.errors.description ? true : false}
                                        helperText={formik.touched.description && formik.errors.description ? formik.errors.description : null}
                                        editable={!readOnly}
                                        selectTextOnFocus={!readOnly}
                                        style={tailwind('mt-3')}
                                    />
                                    <StyledDropdownInput 
                                        data={categories}
                                        defaultValue={formik.values.category}
                                        onSelect={(selectedItem, index) => {
                                            formik.setFieldValue('category', selectedItem)
                                        }}
                                        buttonTextAfterSelection={(selectedItem, index) => {
                                            return selectedItem
                                        }}
                                        rowTextForSelection={(item, index) => {
                                            return item
                                        }}
                                        buttonStyle={tailwind('h-8 w-full bg-transparent')}
                                        buttonTextStyle={tailwind('text-base text-left capitalize')}
                                        rowTextStyle={tailwind('text-base capitalize')}
                                        disabled={readOnly}
                                        style={tailwind('mt-3')}
                                    />
                                    <StyledDatePicker 
                                        value={new Date(formik.values.date)}
                                        mode={'date'}
                                        textColor="white"
                                        onChange={(e, selectedDate) => {
                                            formik.setFieldValue('date', selectedDate)
                                        }}
                                        error={formik.touched.category && formik.errors.category ? true : false}
                                        helperText={formik.touched.category && formik.errors.category ? formik.errors.category : null}
                                        disabled={readOnly}
                                        style={tailwind('mt-3')}
                                    />
                                    <StyledTextInput
                                        placeholder='Amount *'
                                        inputMode='decimal'
                                        onChangeText={formik.handleChange('amount')}
                                        onBlur={formik.handleBlur('amount')}
                                        value={`${formik.values.amount}`}
                                        error={formik.touched.amount && formik.errors.amount ? true : false}
                                        helperText={formik.touched.amount && formik.errors.amount ? formik.errors.amount : null}
                                        editable={!readOnly}
                                        selectTextOnFocus={!readOnly}
                                        style={tailwind('mt-3')}
                                    />
                                    <StyledTextInput
                                        placeholder={readOnly ? '' : 'Note'}
                                        onChangeText={formik.handleChange('note')}
                                        onBlur={formik.handleBlur('note')}
                                        value={formik.values.note}
                                        error={formik.touched.note && formik.errors.note ? true : false}
                                        helperText={formik.touched.note && formik.errors.note ? formik.errors.note : null}
                                        multiline={true}
                                        editable={!readOnly}
                                        selectTextOnFocus={!readOnly}
                                        style={tailwind('mt-3')}
                                    />
                                    {readOnly ? null
                                    : <StyledButton label={"Save"} onPress={formik.handleSubmit} style={tailwind('mt-2')}/>
                                    }
                                    
                                </KeyboardAwareScrollView>
                            )}
                        </Formik>  
                    </View>
                </View>
            </Modal>
       </>
    )
}