import React, { FC } from "react";
import Constants from "expo-constants";
import { StyleSheet, View, useWindowDimensions } from "react-native";

interface ScreenProps {
	children?: React.ReactNode;
	style?: object;
}

const Screen: FC<ScreenProps> = ({ children, style }) => {
	const windowHeight = useWindowDimensions().height;
	return (
		<View
			style={[
				styles.screen,
				style,
				{ minHeight: Math.round(windowHeight) },
			]}
		>
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		paddingTop: Constants.statusBarHeight,
		flex: 1,
	},
});

export default Screen;
