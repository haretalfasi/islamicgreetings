import React, { useEffect, FC } from "react";
import { StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { SvgXml } from "react-native-svg";
import { AppNavigatorParamList } from "../routes/AppNavigator";

import Screen from "../components/Screen";
import { appLogo } from "../svgs/svgList";
import Animated, {
	useSharedValue,
	withTiming,
	withRepeat,
	useAnimatedStyle,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const ratio = 226 / 55;
const LOGO_WIDTH = width * 0.8;
const LOGO_HEIGHT = LOGO_WIDTH / ratio;

interface SplashScreenProps {
	navigation: StackNavigationProp<AppNavigatorParamList, "SplashScreen">;
	route: RouteProp<AppNavigatorParamList, "SplashScreen">;
}

const SplashScreen: FC<SplashScreenProps> = ({ navigation, route }) => {
	const upDown = useSharedValue(0);
	const style = useAnimatedStyle(() => ({
		transform: [{ translateY: upDown.value }],
	}));

	const navigateToNext = route.params.viewedOnboarder
		? "MainScreen"
		: "OnBoarderScreen";

	useEffect(() => {
		upDown.value = withRepeat(withTiming(10, { duration: 1000 }), -1, true);
		setTimeout(() => {
			navigation.navigate(navigateToNext);
		}, 2000);
	}, []);

	return (
		<Screen style={styles.container}>
			<Animated.View style={[styles.logo, style]}>
				<SvgXml xml={appLogo} width="100%" height="100%" />
			</Animated.View>
			<ActivityIndicator
				size="large"
				color="#ffffff"
				style={styles.activityIndicator}
			/>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
	},
	logo: {
		resizeMode: "contain",
		width: LOGO_WIDTH,
		height: LOGO_HEIGHT,
		marginTop: height / 4,
	},
	activityIndicator: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: "30%",
	},
});

export default SplashScreen;
