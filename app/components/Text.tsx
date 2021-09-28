import React, { FC } from "react";
import { StyleSheet, Text, TextStyle } from "react-native";
import {
	useFonts,
	Rubik_300Light,
	Rubik_700Bold,
} from "@expo-google-fonts/rubik";

export const FontWeights = {
	bold: "Rubik_700Bold",
	light: "Rubik_300Light",
};

export interface AppTextProps {
	fontSize?: number;
	fontFamily?: "Rubik_300Light" | "Rubik_700Bold";
	color?: string;
	style?: TextStyle;
	children: React.ReactNode;
}

const AppText: FC<AppTextProps> = ({
	fontSize = 16,
	fontFamily = "Rubik_300Light",
	color = "#A6A6A6",
	children,
	style,
}) => {
	let [fontsLoaded] = useFonts({
		Rubik_300Light,
		Rubik_700Bold,
	});

	if (!fontsLoaded) {
		return <Text></Text>;
	}

	const dynamicStyle: TextStyle = {
		fontSize,
		fontFamily,
		color,
		...style,
	};

	return (
		<Text style={[{ fontFamily: "Rubik_300Light" }, dynamicStyle]}>
			{children}
		</Text>
	);
};

export default AppText;
