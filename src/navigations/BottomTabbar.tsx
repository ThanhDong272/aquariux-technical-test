import React from "react";

import { ScreenNames } from "@navigations/ScreenNames";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { FontAwesome } from "@react-native-vector-icons/fontawesome";

const BottomTabbar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const renderIcon = (name: string) => {
    let iconName: "home" | "bookmark" = "home";
    switch (name) {
      case ScreenNames.Home:
        iconName = "home";
        break;
      case ScreenNames.Wishlist:
        iconName = "bookmark";
        break;
      default:
        iconName = "home";
        break;
    }
    return <FontAwesome color={"#fff"} size={24} name={iconName} />;
  };

  return (
    <Container edges={["right", "left", "bottom"]}>
      {state.routes?.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          navigation.navigate(route.name, route.params);
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <ButtonItem
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {renderIcon(route?.name)}
          </ButtonItem>
        );
      })}
    </Container>
  );
};

const Container = styled(SafeAreaView)`
  flex-direction: row;
  background-color: #032541;
`;

const ButtonItem = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-top: 8px;
  margin-left: -6px;
  margin-right: -6px;
`;

export default BottomTabbar;
