import React from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SvgXml } from "react-native-svg";

import { colors } from "./app/theme";
import Screen from "./app/components/Screen";
import { appLogo } from "./app/svgs/svgList";
import Animated, {
	useSharedValue,
	withTiming,
	withRepeat,
} from "react-native-reanimated";

// Images
const backgroundImage = require("./app/assets/main_background.jpg");
const logo = require("./app/assets/logo.png");

export default function App() {
	const sharedValue = useSharedValue(0);
	sharedValue.value = withRepeat(
		withTiming(70, undefined, (finished, currentValue) => {
			if (finished) {
				console.log("current withRepeat value is " + currentValue);
			} else {
				console.log("inner animation cancelled");
			}
		}),
		10,
		true,
		(finished) => {
			const resultStr = finished
				? "All repeats are completed"
				: "withRepeat cancelled";
			console.log(resultStr);
		}
	);

	return (
		<Screen style={styles.container}>
			<ImageBackground
				source={backgroundImage}
				style={styles.backgroundImage}
			>
				<LinearGradient
					colors={[colors.darkBlue, "transparent"]}
					style={styles.gradientStyle}
				/>
			</ImageBackground>
			<Animated.View style={styles.logo}>
				<SvgXml xml={appLogo} width="100%" height="100%" />
			</Animated.View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.darkBlue,
		position: "relative",
		alignItems: "center",
	},
	backgroundImage: {
		width: "100%",
		height: 300,
		position: "absolute",
		bottom: 0,
	},
	gradientStyle: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		height: 300,
	},
	logo: {
		resizeMode: "contain",
		width: 280,
		height: 180,
		marginTop: 40,
	},
});
