import React, { FC } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import OnBoarderScreen from "../screens/OnBoarderScreen";
import MainScreen from "../screens/MainScreen";
import BackgroundSelectionScreen from "../screens/BackgroundSelectionScreen";
import CustomiseScreen from "../screens/CustomiseScreen";

export type AppNavigatorParamList = {
	SplashScreen: { viewedOnboarder: boolean };
	OnBoarderScreen: undefined;
	MainScreen: undefined;
	BackgroundSelectionScreen: { occasion: string };
	CustomiseScreen: {
		occasion: string;
		image: JSX.Element;
		cardBackground: string;
	};
	PlayScreen: undefined;
};

const Stack = createStackNavigator<AppNavigatorParamList>();

export interface AppNavigatorProps {
	viewedOnboarder: boolean;
}

const AppNavigator: FC<AppNavigatorProps> = ({ viewedOnboarder }) => {
	return (
		<Stack.Navigator
			headerMode="none"
			initialRouteName="MainScreen"
			detachInactiveScreens={false}
		>
			<Stack.Screen
				name="SplashScreen"
				component={SplashScreen}
				initialParams={{ viewedOnboarder }}
			/>
			<Stack.Screen name="OnBoarderScreen" component={OnBoarderScreen} />
			<Stack.Screen name="MainScreen" component={MainScreen} />
			<Stack.Screen
				name="BackgroundSelectionScreen"
				component={BackgroundSelectionScreen}
			/>
			<Stack.Screen name="CustomiseScreen" component={CustomiseScreen} />
		</Stack.Navigator>
	);
};

export default AppNavigator;
