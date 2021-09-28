import React, { FC } from "react";
import Constants from "expo-constants";
import {
	StyleSheet,
	View,
	useWindowDimensions,
	ImageBackground,
	Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../config/theme";

interface ScreenProps {
	children?: React.ReactNode;
	style?: object;
}

const backgroundImage = require("../assets/background-pattern.png");
const { width, height } = Dimensions.get("window");

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
			<ImageBackground
				source={backgroundImage}
				style={styles.backgroundImage}
				resizeMode={"repeat"}
			/>
			<LinearGradient
				colors={[colors.darkBlue, "transparent"]}
				style={styles.gradientStyle}
				start={{ x: 0.5, y: 0.3 }}
				end={{ x: 0.5, y: 1 }}
			/>
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		paddingTop: Constants.statusBarHeight,
		flex: 1,
		backgroundColor: colors.darkBlue,
		position: "relative",
	},
	backgroundImage: {
		width: width,
		height: height,
		position: "absolute",
		bottom: 0,
		opacity: 0.02,
		flex: 1,
	},
	gradientStyle: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		height: 300,
		width: width,
	},
});

export default Screen;
