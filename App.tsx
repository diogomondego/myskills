import 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import { database } from './src/database'

import { StatusBar } from 'expo-status-bar';
import Home from './src/screens/Home';

function App() {
  return (
    <>
      <StatusBar
        style="light"
        translucent
        backgroundColor="transparent"
      />
      <DatabaseProvider database={database}>
        <Home />
      </DatabaseProvider>
      <Toast />
    </>
  );
}

export default gestureHandlerRootHOC(App);