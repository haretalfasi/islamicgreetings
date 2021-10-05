import React, { FC } from "react";
import {
	StyleSheet,
	Dimensions,
	View,
	TouchableWithoutFeedback,
	Image,
	FlatList,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { AdMobBanner } from "expo-ads-admob";
import { SvgXml } from "react-native-svg";

import { AppNavigatorParamList } from "../routes/AppNavigator";
import Screen from "../components/Screen";
import { colors } from "../config/theme";
import { appLogo } from "../svgs/svgList";
import { backgroundsList } from "../constants";

const { width, height } = Dimensions.get("window");
const ratio = 226 / 55;
const LOGO_WIDTH = width * 0.72;
const LOGO_HEIGHT = LOGO_WIDTH / ratio;

interface BackgroundSelectionScreenProps {
	navigation: StackNavigationProp<
		AppNavigatorParamList,
		"BackgroundSelectionScreen"
	>;
	route: RouteProp<AppNavigatorParamList, "BackgroundSelectionScreen">;
}

const BackgroundSelectionScreen: FC<BackgroundSelectionScreenProps> = ({
	navigation,
}) => {
	return (
		<Screen style={styles.container}>
			<View style={styles.logo}>
				<SvgXml xml={appLogo} width="100%" height="100%" />
			</View>

			<FlatList
				data={backgroundsList}
				keyExtractor={(item) => item.key}
				numColumns={3}
				renderItem={({ item }) => {
					return (
						<View style={styles.backgroundWrapper}>
							<TouchableWithoutFeedback
								onPress={() =>
									navigation.navigate("CustomiseScreen", {
										image: item.key,
										cardBackground: item.backgroundColor,
										showCurvedGradient:
											item.showCurvedGradient || false,
										verticalPosition:
											item.verticalPosition ||
											"flex-start",
										box: item.box || false,
										height: item.height,
									})
								}
							>
								<Image
									source={item.image}
									style={styles.thumbnail}
								/>
							</TouchableWithoutFeedback>
						</View>
					);
				}}
				contentContainerStyle={styles.listContainer}
			/>

			<View style={styles.adBanner}>
				<AdMobBanner
					bannerSize="banner"
					adUnitID="ca-app-pub-3940256099942544/2934735716" // Test ID, Replace with your-admob-unit-id
				/>
			</View>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		backgroundColor: colors.darkBlue,
	},
	logo: {
		resizeMode: "contain",
		width: LOGO_WIDTH,
		height: LOGO_HEIGHT,
		marginTop: 16,
		marginBottom: 60,
	},
	adBanner: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 28,
		width: "100%",
		alignItems: "center",
	},
	image: {
		resizeMode: "contain",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
		paddingHorizontal: 18,
		justifyContent: "space-between",
		marginTop: 12,
		marginBottom: 24,
	},
	heading: {
		textAlign: "center",
		color: "white",
	},
	backgroundWrapper: {
		width: width / 3,
		height: width / 3,
		overflow: "hidden",
	},
	thumbnail: {
		resizeMode: "cover",
		width: "100%",
		height: 200,
		position: "relative",
	},
	listContainer: {
		width,
	},
	positionTop: {
		top: 0,
	},
	positionBottom: {
		bottom: 0,
	},
});

export default BackgroundSelectionScreen;
