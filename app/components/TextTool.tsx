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
import { Rubik_300Light, Rubik_700Bold } from "@expo-google-fonts/rubik";
import { useFonts, Arizonia_400Regular } from "@expo-google-fonts/arizonia";
import { Courgette_400Regular } from "@expo-google-fonts/courgette";
import { GloriaHallelujah_400Regular } from "@expo-google-fonts/gloria-hallelujah";
import { Oswald_500Medium } from "@expo-google-fonts/oswald";
import { FontAwesome5 } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";

import { useKeyboard } from "../hooks/useKeyboard";
import Text from "./Text";
import Header from "./Header";
import { ColourWheel } from "../svgs/svgList";
import ColorPicker from "./ColorPicker";
import FontPicker from "./FontPicker";

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

const TextTool: FC<TextToolProps> = ({
	onUpdateText,
	onCreateText,
	selectedText,
}) => {
	// Fonts
	let [fontsLoaded] = useFonts({
		Rubik_300Light,
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
					<FontPicker
						onSetSelectedFont={(font) => setSelectedFont(font)}
						selectedFont={selectedFont}
					/>
				)}

				{fontOrColor === "color" && (
					<ColorPicker
						onSetSelectedColor={(color) => setSelectedColor(color)}
					/>
				)}
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	overlay: {
		backgroundColor: "#111",
		opacity: 0.5,
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
		justifyContent: "center",
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
