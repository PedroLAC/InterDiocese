import { createStackNavigator } from '@react-navigation/stack';
import { Home } from './pages/home';
import { Paroquia } from './pages/paroquia';

const Stack = createStackNavigator();

export function Routes() {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Paroquia" component={Paroquia} />
    </Stack.Navigator>
  );
}