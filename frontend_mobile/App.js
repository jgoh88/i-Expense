import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {TailwindProvider} from 'tailwind-rn';
import { UserProvider } from '@/src/hooks/useUserHook'
import utilities from './tailwind.json';
import { NavigationContainer } from '@react-navigation/native';
import AppNav from './src/components/AppNav';

export default function App() {
  return (
    <NavigationContainer>
      <UserProvider>
        <TailwindProvider utilities={utilities}>
          <StatusBar style="auto" />
          <SafeAreaView style={styles.container}>
            <View style={styles.container}>
              <AppNav />
            </View>
          </SafeAreaView>
        </TailwindProvider>
      </UserProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
