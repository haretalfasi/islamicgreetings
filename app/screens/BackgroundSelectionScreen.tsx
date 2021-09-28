import React, { FC } from "react";
import {
	StyleSheet,
	Dimensions,
	View,
	TouchableWithoutFeedback,
	ImageSourcePropType,
	Image,
	FlatList,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { AdMobBanner } from "expo-ads-admob";
import { AntDesign } from "@expo/vector-icons";

import { AppNavigatorParamList } from "../routes/AppNavigator";
import Screen from "../components/Screen";
import Text from "../components/Text";
import { colors } from "../config/theme";

export interface occasion {
	key: string;
	image: ImageSourcePropType;
	backgroundColor: string;
}

export interface backgroundList {
	[key: string]: occasion[];
}

const { width, height } = Dimensions.get("window");

const backgroundsList: backgroundList = {
	ramadan: [
		{
			key: "ramadan-1",
			image: require("../assets/backgrounds/ramadan/ramadan-1.jpg"),
			backgroundColor: "#043C3F",
		},
		{
			key: "ramadan-2",
			image: require("../assets/backgrounds/ramadan/ramadan-2.jpg"),
			backgroundColor: "#ffffff",
		},
	],
	eid: [
		{
			key: "eid-1",
			image: require("../assets/backgrounds/eid/eid-1.jpg"),
			backgroundColor: "#CBD2D0",
		},
		{
			key: "eid-2",
			image: require("../assets/backgrounds/eid/eid-2.jpg"),
			backgroundColor: "#744704",
		},
	],
	wedding: [
		{
			key: "wedding-1",
			image: require("../assets/backgrounds/wedding/wedding-1.jpg"),
			backgroundColor: "#CBD2D0",
		},
		{
			key: "wedding-2",
			image: require("../assets/backgrounds/wedding/wedding-2.jpg"),
			backgroundColor: "#744704",
		},
	],
};

interface BackgroundSelectionScreenProps {
	navigation: StackNavigationProp<
		AppNavigatorParamList,
		"BackgroundSelectionScreen"
	>;
	route: RouteProp<AppNavigatorParamList, "BackgroundSelectionScreen">;
}

const BackgroundSelectionScreen: FC<BackgroundSelectionScreenProps> = ({
	navigation,
	route,
}) => {
	const { occasion } = route.params;
	return (
		<Screen style={styles.container}>
			<View style={styles.header}>
				<TouchableWithoutFeedback
					onPress={() => navigation.navigate("MainScreen")}
				>
					<AntDesign
						name="leftcircle"
						size={24}
						color={colors.yellow}
					/>
				</TouchableWithoutFeedback>
				<Text
					fontFamily="Rubik_700Bold"
					fontSize={24}
					style={styles.heading}
				>
					{occasion}
				</Text>
				<View />
			</View>

			<FlatList
				data={backgroundsList[occasion.toLowerCase()]}
				keyExtractor={(item) => item.key}
				renderItem={({ item }) => {
					return (
						<View style={styles.backgroundWrapper}>
							<TouchableWithoutFeedback
								onPress={() =>
									navigation.navigate("CustomiseScreen", {
										occasion,
										image: (
											<Image
												source={item.image}
												style={{ width, height: width }}
											/>
										),
										cardBackground: item.backgroundColor,
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
	},
	thumbnail: {
		resizeMode: "cover",
		width: "100%",
		height: "100%",
	},
	listContainer: {
		flexDirection: "row",
		justifyContent: "flex-start",
		width: width,
	},
});

export default BackgroundSelectionScreen;
