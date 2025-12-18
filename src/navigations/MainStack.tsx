import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { screenOptionsNativeStack } from ".";
import ScreenNames from "./ScreenNames";
import BottomStack from "./BottomStack";

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName={ScreenNames.BottomStack}
      screenOptions={screenOptionsNativeStack as any}
    >
      <Stack.Screen
        name={ScreenNames.BottomStack}
        options={{ headerShown: false }}
        component={BottomStack}
      />
      <Stack.Screen
        name={ScreenNames.MovieDetail}
        options={{ headerShown: false }}
        component={require("../screens/MovieDetail").default}
      />
    </Stack.Navigator>
  );
}
