import React, { FC, ReactElement } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import OnBoarderScreen from "../screens/OnBoarderScreen";
import BackgroundSelectionScreen from "../screens/BackgroundSelectionScreen";
import CustomiseScreen from "../screens/CustomiseScreen";
import Draw from "../components/Draw";

export type AppNavigatorParamList = {
	SplashScreen: { viewedOnboarder: boolean };
	OnBoarderScreen: undefined;
	MainScreen: undefined;
	BackgroundSelectionScreen: undefined;
	CustomiseScreen: {
		image: string;
		cardBackground?: string;
		showCurvedGradient: boolean;
		verticalPosition: "flex-start" | "flex-end" | "center";
		box?: boolean;
		height?: string;
	};
	PlayScreen: undefined;
	DrawScreen: undefined;
};

const Stack = createStackNavigator<AppNavigatorParamList>();

export interface AppNavigatorProps {
	viewedOnboarder: boolean;
}

const AppNavigator: FC<AppNavigatorProps> = ({ viewedOnboarder }) => {
	return (
		<Stack.Navigator
			headerMode="none"
			initialRouteName="BackgroundSelectionScreen"
			detachInactiveScreens={false}
		>
			<Stack.Screen
				name="SplashScreen"
				component={SplashScreen}
				initialParams={{ viewedOnboarder }}
			/>
			<Stack.Screen name="OnBoarderScreen" component={OnBoarderScreen} />
			<Stack.Screen
				name="BackgroundSelectionScreen"
				component={BackgroundSelectionScreen}
			/>
			<Stack.Screen name="CustomiseScreen" component={CustomiseScreen} />
			<Stack.Screen name="DrawScreen" component={Draw} />
		</Stack.Navigator>
	);
};

export default AppNavigator;
