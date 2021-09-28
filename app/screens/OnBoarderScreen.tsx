import React, { FC } from "react";
import AppIntroSlider from "react-native-app-intro-slider";
import { View, ListRenderItem, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AntDesign } from "@expo/vector-icons";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { SvgXml } from "react-native-svg";

import Text, { FontWeights } from "../components/Text";
import {
	onBoarderOne,
	onBoarderTwo,
	onBoarderThree,
	onBoarderFour,
} from "../svgs/svgList";
import Screen from "../components/Screen";
import { colors } from "../config/theme";
import { AppNavigatorParamList } from "../routes/AppNavigator";

interface IntroSlide {
	key: string;
	title: string;
	text: string;
	image: string;
	backgroundColor: string;
}

const slides: IntroSlide[] = [
	{
		key: "one",
		title: "Choose",
		text: "Start by choosing an occasion from the available list",
		image: onBoarderOne,
		backgroundColor: "#59b2ab",
	},
	{
		key: "two",
		title: "Pick",
		text: "Next, pick a design that will be the background of your card",
		image: onBoarderTwo,
		backgroundColor: "#febe29",
	},
	{
		key: "three",
		title: "Customise",
		text: "Style your card with images, text, emojis and even photos!",
		image: onBoarderThree,
		backgroundColor: "#22bcb5",
	},
	{
		key: "four",
		title: "Share",
		text: "Share your card with your loved ones and friends",
		image: onBoarderFour,
		backgroundColor: "#22bcb5",
	},
];

const renderItem: ListRenderItem<IntroSlide> = ({ item }) => {
	return (
		<View style={styles.container}>
			<SvgXml
				xml={item.image}
				style={styles.image}
				width={160}
				height={160}
			/>
			<Text style={styles.title}>{item.title}</Text>
			<Text style={styles.content}>{item.text}</Text>
		</View>
	);
};

interface OnBoarderScreenProps {
	navigation: StackNavigationProp<AppNavigatorParamList, "MainScreen">;
}

const OnBoarderScreen: FC<OnBoarderScreenProps> = ({ navigation }) => {
	const { setItem } = useAsyncStorage("introCarouselViewed");

	const writeItemToStorage = async () => {
		navigation.navigate("MainScreen");
		// await setItem("true");
	};

	return (
		<Screen>
			<AppIntroSlider
				renderItem={renderItem}
				data={slides}
				onDone={writeItemToStorage}
				activeDotStyle={styles.activeDot}
				dotStyle={styles.inactiveDot}
				renderDoneButton={() => (
					<AntDesign
						name="checkcircle"
						size={40}
						color={colors.yellow}
					/>
				)}
				renderNextButton={() => (
					<AntDesign
						name="rightcircle"
						size={40}
						color={colors.yellow}
					/>
				)}
			/>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 12,
		alignItems: "center",
	},
	image: {
		resizeMode: "contain",
		marginBottom: 60,
	},
	title: {
		paddingTop: 25,
		paddingBottom: 10,
		fontSize: 24,
		alignSelf: "center",
		fontFamily: FontWeights.bold,
		color: colors.yellow,
	},
	content: {
		textAlign: "center",
		fontSize: 18,
		paddingHorizontal: 28,
		color: "#ffffff",
	},
	activeDot: {
		backgroundColor: colors.yellow,
	},
	inactiveDot: {
		backgroundColor: "transparent",
		borderWidth: 1,
		borderColor: "#979797",
	},
});

export default OnBoarderScreen;
