import React, { FC } from "react";
import { StyleSheet, Dimensions, View, FlatList } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SvgXml } from "react-native-svg";
import { AdMobBanner } from "expo-ads-admob";

import { AppNavigatorParamList } from "../routes/AppNavigator";
import Screen from "../components/Screen";
import { appLogo } from "../svgs/svgList";
import { lantern, eid, hajj, newborn } from "../svgs/svgList";
import { colors } from "../config/theme";
import OccasionItem from "../components/OccasionItem";

const { width } = Dimensions.get("window");
const ratio = 226 / 55;
const LOGO_WIDTH = width * 0.72;
const LOGO_HEIGHT = LOGO_WIDTH / ratio;

export interface occasion {
	key: string;
	title: string;
	image: string;
}

const occasionsList: occasion[] = [
	{
		key: "ramadan",
		title: "Ramadan",
		image: lantern,
	},
	{
		key: "eid",
		title: "Eid",
		image: eid,
	},
	{
		key: "hajj",
		title: "Hajj",
		image: hajj,
	},
	{
		key: "newborn",
		title: "Newborn",
		image: newborn,
	},
	{
		key: "wedding",
		title: "Wedding",
		image: newborn,
	},
];

interface MainScreenProps {
	navigation: StackNavigationProp<AppNavigatorParamList>;
}

const MainScreen: FC<MainScreenProps> = ({ navigation }) => {
	return (
		<Screen style={styles.container}>
			<View style={styles.logo}>
				<SvgXml xml={appLogo} width="100%" height="100%" />
			</View>
			<FlatList
				data={occasionsList}
				keyExtractor={(item) => item.key}
				renderItem={({ item }) => (
					<OccasionItem
						item={item}
						onPress={() =>
							navigation.navigate("BackgroundSelectionScreen")
						}
					/>
				)}
				numColumns={3}
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
});

export default MainScreen;
