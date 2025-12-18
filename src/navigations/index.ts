import React from "react";
import {
  CommonActions,
  NavigationContainerRef,
  StackActions,
} from "@react-navigation/native";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Platform } from "react-native";

export const screenOptionsNativeStack: NativeStackNavigationOptions = {
  headerShown: false,
  fullScreenGestureEnabled: true,
  gestureEnabled: false,
  animationTypeForReplace: "push",
  animation: "slide_from_right",
  presentation: Platform.OS === "android" ? "modal" : undefined,
};

import ScreenNames from "./ScreenNames";
export type ScreenNameType = keyof typeof ScreenNames;

export interface ScreenPropType extends ReactNavigation.RootParamList {}

export type NavigationType = NavigationContainerRef<ScreenPropType>;

export const navigationOptions: NativeStackNavigationOptions = {
  gestureDirection: "horizontal",
  headerShown: false,
};

export type NavigateTransitionType = <
  T extends ScreenPropType,
  N extends ScreenNameType
>(
  name: N,
  params?: T
) => void;

export type TabScreenType = {
  name: ScreenNameType;
  title: string;
  component: React.FC;
};

export interface NavigationInterface {
  navigateTo: NavigateTransitionType;
  push: NavigateTransitionType;
  replace: NavigateTransitionType;
  reset: NavigateTransitionType;
  pop: (count?: number) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  getRef: () => ReturnType<typeof React.createRef<NavigationType>>;
}

export class NavigationProvider implements NavigationInterface {
  private _ref = React.createRef<NavigationType>();

  constructor() {
    this.getRef = this.getRef.bind(this);
    this.push = this.push.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
    this.pop = this.pop.bind(this);
    this.push = this.push.bind(this);
    this.replace = this.replace.bind(this);
    this.reset = this.reset.bind(this);
  }

  getRef() {
    return this._ref;
  }

  getCurrentRouteName() {
    return this._ref.current?.getCurrentRoute()?.name;
  }

  push(name: string, params?: any) {
    this._ref.current?.dispatch(StackActions.push(name, params));
  }

  navigateTo(name: any, params?: any) {
    this._ref.current?.dispatch(CommonActions.navigate(name, params));
  }

  canGoBack(): any {
    return this._ref.current?.canGoBack();
  }

  goBack() {
    this._ref.current?.goBack();
  }

  replace(name: string, params?: any) {
    this._ref.current?.dispatch(StackActions.replace(name, params));
  }

  pop(count?: number) {
    this._ref.current?.dispatch(StackActions.pop(count));
  }

  popToTop() {
    this._ref.current?.dispatch(StackActions.popToTop());
  }

  reset(stackName: string, params?: any) {
    this._ref.current?.reset({
      index: 0,
      routes: [{ name: stackName, params }],
    });
  }

  resetToAuthStack(
    authStackName: string,
    initialScreenName: string,
    params?: any
  ) {
    this._ref.current?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: authStackName,
            state: {
              index: 0,
              routes: [
                {
                  name: initialScreenName,
                  params: params,
                },
              ],
            },
          },
        ],
      })
    );
  }
}

const Navigation = new NavigationProvider();

export default Navigation;
