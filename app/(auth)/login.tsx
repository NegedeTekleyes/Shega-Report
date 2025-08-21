import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {StatusBar} from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import {Ionicons} from '@expo/vector-icons'
export default function LoginScreen() {
    // const {login} = useAuth()
    const {t} = useLanguage()
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark"/>
    <KeyboardAvoidingView
    behavior= {Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.keyboardview}
    >
        <ScrollView contentContainerStyle = {styles.scrollContent}>
            <View style={styles.header}>
                <TouchableOpacity
                style={styles.backButton}
                onPress={()=> router.back()}
                >
                    <Ionicons name='arrow-back' color='#009639' size = {24}/>
                </TouchableOpacity>
                     <Text style={styles.title}>{t('login')}</Text>
            </View>


            <View style = {styles.form}>
                <View style = {styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <Ionicons name= 'mail' color='#666' size ={20}/>
                        <TextInput
                        style = {styles.input}
                        placeholder = {t('email')}
                        />
                    </View>
                </View>

            </View>
        </ScrollView>
        
    </KeyboardAvoidingView>




    </SafeAreaView>
      
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff"
    },
    keyboardview: {
        flex: 1
    },
    scrollContent:{
        flexGrow: 1,
        paddingHorizontal: 24
    },
    header:{
        flexDirection: 'row',
        alignItems: "center",
        paddingTop: 20,
        paddingBottom: 40,
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: "#009639"
    },
    form :{
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputWrapper :{
        flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',                      
    },
    input :{
        flex: 1,
        fontSize: 16,
        marginLeft: 12,
        color: '#333'
    }
})

function useLanguage(): { t: any } {
    throw new Error('Function not implemented.')
}
