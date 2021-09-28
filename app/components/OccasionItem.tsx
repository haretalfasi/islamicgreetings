import React, { FC } from "react";
import { useNavigation } from "@react-navigation/native";
import {
	View,
	StyleSheet,
	Dimensions,
	TouchableWithoutFeedback,
} from "react-native";
import { SvgXml } from "react-native-svg";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

import { occasion } from "../screens/MainScreen";
import Text from "./Text";

const { width } = Dimensions.get("window");

export interface OccasionItemProps {
	item: occasion;
	onPress: () => void;
}

const OccasionItem: FC<OccasionItemProps> = ({ item, onPress }) => {
	const pressDown = useSharedValue(0);
	const buttonStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateY: withTiming(pressDown.value, { duration: 50 }) },
		],
	}));

	return (
		<View style={styles.occasion}>
			<SvgXml
				xml={item.image}
				style={styles.image}
				width={80}
				height={80}
			/>
			<TouchableWithoutFeedback
				onPress={onPress}
				onPressIn={() => (pressDown.value = 2)}
				onPressOut={() => (pressDown.value = 0)}
			>
				<Animated.View style={[styles.occasionButton, buttonStyle]}>
					<Text
						style={styles.occasionButtonText}
						fontFamily="Rubik_700Bold"
					>
						{item.title}
					</Text>
				</Animated.View>
			</TouchableWithoutFeedback>
			<View style={styles.occasionButtonShadow} />
		</View>
	);
};

const styles = StyleSheet.create({
	image: {
		resizeMode: "contain",
		marginBottom: 18,
	},
	occasion: {
		width: width / 3 - 16,
		alignItems: "center",
		marginBottom: 60,
		position: "relative",
		marginHorizontal: 8,
	},
	occasionButton: {
		backgroundColor: "#4B2746",
		width: "100%",
		borderRadius: 40,
		alignItems: "center",
		padding: 12,
		position: "relative",
		zIndex: 2,
	},
	occasionButtonText: {
		color: "white",
	},
	occasionButtonShadow: {
		backgroundColor: "#3B1A37",
		height: 40,
		borderRadius: 40,
		position: "absolute",
		zIndex: 1,
		left: 0,
		right: 0,
		bottom: -5,
	},
});

export default OccasionItem;
