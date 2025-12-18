/* eslint-disable react/react-in-jsx-scope */
import { useCallback } from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "@screens/Home";
import WishlistScreen from "@screens/Wishlist";

import BottomTabbar from "./BottomTabbar";
import { ScreenNames } from "./ScreenNames";

const Tab = createBottomTabNavigator();

const BottomStack: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabbar {...props} />}
    >
      <Tab.Screen name={ScreenNames.Home} component={HomeScreen} />
      <Tab.Screen name={ScreenNames.Wishlist} component={WishlistScreen} />
    </Tab.Navigator>
  );
};

export default BottomStack;
