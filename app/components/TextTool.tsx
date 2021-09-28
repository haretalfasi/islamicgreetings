import React, { FC, useRef, useState } from "react";
import Constants from "expo-constants";
import {
	StyleSheet,
	Dimensions,
	View,
	TextInput,
	TouchableWithoutFeedback,
	GestureResponderEvent,
} from "react-native";
import { getRandomBytes } from "expo-random";
import { Rubik_700Bold } from "@expo-google-fonts/rubik";
import { useFonts, Arizonia_400Regular } from "@expo-google-fonts/arizonia";
import { Courgette_400Regular } from "@expo-google-fonts/courgette";
import { GloriaHallelujah_400Regular } from "@expo-google-fonts/gloria-hallelujah";
import { Oswald_500Medium } from "@expo-google-fonts/oswald";
import { FontAwesome5 } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";

import { useKeyboard } from "../hooks/useKeyboard";
import Text from "./Text";
import Header from "./Header";
import { FlatList } from "react-native-gesture-handler";
import { ColourWheel } from "../svgs/svgList";

const { width, height } = Dimensions.get("window");

export type TextAlignType = "left" | "center" | "right";

export interface stringInterface {
	text: string;
	id: string;
	fontFamily: string;
	textAlign: TextAlignType;
	color: string;
}

export interface TextToolProps {
	onUpdateText?: (text: stringInterface) => void;
	onCreateText?: (text: stringInterface) => void;
	selectedText?: stringInterface;
}

interface FontItem {
	id: number;
	font: string;
}

const fontsList = [
	{
		id: 1,
		font: "Arizonia_400Regular",
	},
	{
		id: 2,
		font: "Rubik_700Bold",
	},
	{
		id: 3,
		font: "Courgette_400Regular",
	},
	{
		id: 4,
		font: "GloriaHallelujah_400Regular",
	},
	{
		id: 5,
		font: "Oswald_500Medium",
	},
];

interface ColorItem {
	id: number;
	hex: string;
}

const colorsList = [
	{
		id: 1,
		hex: "#FFFFFF",
	},
	{
		id: 2,
		hex: "#000000",
	},
	{
		id: 3,
		hex: "#301000",
	},
	{
		id: 4,
		hex: "#2870B8",
	},
	{
		id: 5,
		hex: "#3091C8",
	},
	{
		id: 6,
		hex: "#90C767",
	},
	{
		id: 7,
		hex: "#011F2F",
	},
	{
		id: 8,
		hex: "#B86F27",
	},
	{
		id: 9,
		hex: "#C96730",
	},
	{
		id: 10,
		hex: "#FFFFFF",
	},
	{
		id: 11,
		hex: "#000000",
	},
	{
		id: 12,
		hex: "#3797F1",
	},
	{
		id: 13,
		hex: "#6FC04E",
	},
	{
		id: 14,
		hex: "#FDCB5A",
	},
	{
		id: 15,
		hex: "#FD8D32",
	},
	{
		id: 16,
		hex: "#EE4A56",
	},
	{
		id: 17,
		hex: "#D1096A",
	},
	{
		id: 18,
		hex: "#A206BA",
	},
	{
		id: 19,
		hex: "#ED0114",
	},
	{
		id: 20,
		hex: "#ED858E",
	},
	{
		id: 21,
		hex: "#FFD2D3",
	},
	{
		id: 22,
		hex: "#FEDBB2",
	},
	{
		id: 23,
		hex: "#FFC481",
	},
	{
		id: 24,
		hex: "#D28F46",
	},
	{
		id: 25,
		hex: "#9A6439",
	},
	{
		id: 26,
		hex: "#442324",
	},
	{
		id: 27,
		hex: "#1B4A28",
	},
	{
		id: 28,
		hex: "#262626",
	},
	{
		id: 29,
		hex: "#363636",
	},
	{
		id: 30,
		hex: "#555555",
	},
	{
		id: 31,
		hex: "#737373",
	},
	{
		id: 32,
		hex: "#999999",
	},
	{
		id: 33,
		hex: "#B2B2B2",
	},
	{
		id: 34,
		hex: "#C7C7C7",
	},
	{
		id: 35,
		hex: "#DBDBDB",
	},
	{
		id: 36,
		hex: "#EFEFEF",
	},
];

const TextTool: FC<TextToolProps> = ({
	onUpdateText,
	onCreateText,
	selectedText,
}) => {
	// Fonts
	let [fontsLoaded] = useFonts({
		Rubik_700Bold,
		Arizonia_400Regular,
		Courgette_400Regular,
		GloriaHallelujah_400Regular,
		Oswald_500Medium,
	});

	const [keyboardHeight, keyboardVisible] = useKeyboard();
	const [text, setText] = useState<string>(selectedText?.text || "");
	const [textAlign, setTextAlign] = useState<TextAlignType>(
		selectedText?.textAlign || "center"
	);
	const [selectedFont, setSelectedFont] = useState(
		selectedText?.fontFamily || "Rubik_300Light"
	);
	const [fontOrColor, setFontOrColor] = useState<"font" | "color">("font");
	const [selectedColor, setSelectedColor] = useState(
		selectedText?.color || "#FFFFFF"
	);

	const textRef = useRef<TextInput>(null);
	const textInputWrapperHeight =
		height - keyboardHeight - Constants.statusBarHeight - 50;
	const fontsToolbarHeight =
		height - keyboardHeight - Constants.statusBarHeight - 68;

	const handleDone = (e: GestureResponderEvent) => {
		if (selectedText) {
			const newText: stringInterface = {
				...selectedText,
				text,
				fontFamily: selectedFont,
				color: selectedColor,
				textAlign,
			};
			onUpdateText && onUpdateText(newText);
		} else {
			createText();
		}
	};

	const createText = () => {
		const newString: stringInterface = {
			text,
			id: getRandomBytes(3).join(""),
			fontFamily: selectedFont,
			color: selectedColor,
			textAlign,
		};
		onCreateText && onCreateText(newString);
	};

	if (!fontsLoaded) return null;

	return (
		<>
			<Header>
				<View style={styles.toolbar}>
					<TouchableWithoutFeedback
						onPress={() =>
							setTextAlign(
								textAlign === "center"
									? "left"
									: textAlign === "left"
									? "right"
									: "center"
							)
						}
					>
						<FontAwesome5
							name={`align-${textAlign}`}
							size={24}
							color="white"
						/>
					</TouchableWithoutFeedback>
					{fontOrColor === "font" && (
						<TouchableWithoutFeedback
							onPress={() => setFontOrColor("color")}
						>
							<View
								style={[
									styles.toolbarOption,
									styles.fontColorWheel,
								]}
							>
								<SvgXml
									xml={ColourWheel}
									width={24}
									height={24}
								/>
							</View>
						</TouchableWithoutFeedback>
					)}
					{fontOrColor === "color" && (
						<TouchableWithoutFeedback
							onPress={() => setFontOrColor("font")}
						>
							<View
								style={[
									styles.toolbarOption,
									styles.fontColorWheel,
									styles.fontIcon,
								]}
							>
								<FontAwesome5
									name="font"
									size={14}
									color="white"
								/>
							</View>
						</TouchableWithoutFeedback>
					)}

					<TouchableWithoutFeedback onPress={handleDone}>
						<View style={styles.toolbarOption}>
							<Text
								fontFamily="Rubik_700Bold"
								fontSize={18}
								color="#ffffff"
							>
								Done
							</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</Header>
			<View
				style={[styles.overlay, { height: textInputWrapperHeight }]}
			/>
			<View
				style={[
					styles.textInputWrapper,
					{
						height: textInputWrapperHeight,
						display: keyboardVisible ? "flex" : "none",
					},
				]}
			>
				<TextInput
					ref={textRef}
					style={[
						styles.textInput,
						{
							fontFamily: selectedFont,
							textAlign,
							color: selectedColor || "#fff",
						},
					]}
					placeholderTextColor="#e1e1e1"
					autoFocus={true}
					onChangeText={(text) => setText(text)}
					value={text}
					multiline
					underlineColorAndroid="transparent"
				/>
			</View>
			<View style={[styles.fontsToolbar, { top: fontsToolbarHeight }]}>
				{fontOrColor === "font" && (
					<FlatList
						contentContainerStyle={{
							alignItems: "center",
						}}
						horizontal
						scrollEnabled
						data={fontsList}
						keyExtractor={(item) => item.id}
						keyboardShouldPersistTaps="always"
						renderItem={({ item }) => (
							<TouchableWithoutFeedback
								onPress={() => setSelectedFont(item.font)}
							>
								<View style={styles.fontOption}>
									<Text
										style={{
											fontFamily: item.font,
											color:
												selectedFont === item.font
													? "orange"
													: "#fff",
										}}
										fontSize={18}
									>
										Aa
									</Text>
								</View>
							</TouchableWithoutFeedback>
						)}
					/>
				)}

				{fontOrColor === "color" && (
					<FlatList
						contentContainerStyle={{
							alignItems: "center",
						}}
						horizontal
						scrollEnabled
						data={colorsList}
						keyExtractor={(item) => item.id}
						keyboardShouldPersistTaps="always"
						renderItem={({ item }) => (
							<TouchableWithoutFeedback
								onPress={() => setSelectedColor(item.hex)}
							>
								<View
									style={{
										width: 24,
										height: 24,
										borderRadius: 12,
										backgroundColor: item.hex,
										borderWidth: 1,
										borderColor: "#fff",
										marginHorizontal: 8,
									}}
								/>
							</TouchableWithoutFeedback>
						)}
					/>
				)}
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	overlay: {
		backgroundColor: "#111",
		opacity: 0.8,
		width,
	},
	textInput: {
		position: "relative",
		zIndex: 2,
		color: "#ffffff",
		fontSize: 32,
		textAlign: "center",
		width: "75%",
		minHeight: 200,
		fontWeight: "normal",
		alignContent: "flex-start",
		textShadowColor: "rgba(0,0,0,0.3)",
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 10,
	},
	textInputWrapper: {
		width,
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
	},
	toolbar: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		position: "relative",
		zIndex: 3,
		flex: 1,
	},
	toolbarOption: {
		marginLeft: 24,
	},
	fontsToolbar: {
		width,
		height: 68,
		position: "absolute",
		left: 0,
		right: 0,
	},
	fontOption: {
		width: 50,
		height: 50,
		backgroundColor: "rgba(0,0,0,0.35)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 25,
		marginHorizontal: 8,
	},
	fontColorWheel: {
		borderRadius: 14,
		borderWidth: 2,
		borderColor: "#fff",
	},
	fontIcon: {
		width: 28,
		height: 28,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default TextTool;
