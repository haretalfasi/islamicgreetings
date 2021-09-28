import React, { FC, useEffect, useState } from "react";
import {
	StyleSheet,
	Dimensions,
	View,
	TouchableWithoutFeedback,
	Image,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import Constants from "expo-constants";
import { SvgXml } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";

import { AppNavigatorParamList } from "../routes/AppNavigator";
import Screen from "../components/Screen";
import { colors } from "../config/theme";
import TextTool from "../components/TextTool";
import MainToolbar from "../components/MainToolbar";
import { stringInterface } from "../components/TextTool";
import Header from "../components/Header";
import { RoundedGradient } from "../svgs/svgList";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import DynamicTextWrapper from "../components/DynamicTextWrapper";
import DynamicImageWrapper from "../components/DynamicImageWrapper";

const { width, height } = Dimensions.get("window");

interface CustomiseScreenProps {
	navigation: StackNavigationProp<AppNavigatorParamList, "CustomiseScreen">;
	route: RouteProp<AppNavigatorParamList, "CustomiseScreen">;
}

const CustomiseScreen: FC<CustomiseScreenProps> = ({ navigation, route }) => {
	const { occasion, image, cardBackground } = route.params;
	const [strings, setStrings] = useState<stringInterface[]>([]);
	const [imageUris, setImageUris] = useState<ImageInfo[]>([]);
	const [selectedString, setSelectedString] = useState<stringInterface>();
	const [activeTool, setActiveTool] = useState<
		"main" | "text" | "image" | "photo" | "emoji"
	>("main");
	const gradient = RoundedGradient(cardBackground);

	const handleAddText = () => {
		setActiveTool("text");
	};

	const handleCreateText = (text: stringInterface) => {
		setStrings([...strings, text]);
		setActiveTool("main");
	};

	const handleToggleTextTool = (text: stringInterface) => {
		setSelectedString(text);
		setActiveTool("text");
	};

	const handleUpdateText = (text: stringInterface) => {
		setStrings((strings) => [
			...strings.filter((s) => s.id !== text.id),
			text,
		]);
		setActiveTool("main");
		setSelectedString(undefined);
	};

	const requestGalleryPermission = async () => {
		const { granted } =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!granted) {
			alert(
				"You need to enable permissions to access your image gallery"
			);
		}
	};

	const selectImage = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync();
			if (!result.cancelled) {
				setImageUris([...imageUris, result]);
			}
		} catch (error) {
			console.log("Error reading an image");
		}
	};

	useEffect(() => {
		requestGalleryPermission();
	}, []);

	return (
		<Screen style={styles.container}>
			{activeTool === "main" && (
				<View style={styles.toolsWrapper}>
					<Header>
						<>
							<TouchableWithoutFeedback
								onPress={() =>
									navigation.navigate(
										"BackgroundSelectionScreen",
										{
											occasion,
										}
									)
								}
							>
								<AntDesign
									name="closecircle"
									size={24}
									color={colors.yellow}
								/>
							</TouchableWithoutFeedback>

							<View style={styles.toolbar}>
								<MainToolbar
									onCreateNewText={handleAddText}
									onSelectImage={selectImage}
								/>
							</View>
						</>
					</Header>
				</View>
			)}

			<View style={styles.toolsWrapper}>
				{activeTool === "text" && (
					<TextTool
						onCreateText={handleCreateText}
						onUpdateText={handleUpdateText}
						selectedText={selectedString}
					/>
				)}
			</View>

			{/* Begin Final Image */}
			<View
				style={[
					styles.imageContainer,
					{ backgroundColor: cardBackground },
				]}
			>
				{image}

				<SvgXml
					xml={gradient}
					width={width}
					height={width * 0.178}
					style={styles.roundedGradient}
				/>

				{strings.map((s) => (
					<DynamicTextWrapper
						key={s.id}
						text={s}
						onPress={() => handleToggleTextTool(s)}
					/>
				))}

				{imageUris.map((image) => (
					<DynamicImageWrapper image={image} />
				))}
			</View>
			{/* End Final Image */}
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		backgroundColor: colors.darkBlue,
		position: "relative",
	},
	adBanner: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 28,
		width: "100%",
		alignItems: "center",
	},
	toolbar: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		position: "relative",
		zIndex: 3,
	},
	imageContainer: {
		flex: 1,
		backgroundColor: "#fff",
		position: "relative",
		marginTop: 50,
	},
	toolsWrapper: {
		position: "absolute",
		top: Constants.statusBarHeight,
		zIndex: 3,
		flex: 1,
		width,
	},
	roundedGradient: {
		position: "absolute",
		top: width - width * 0.173,
		zIndex: 3,
		left: 0,
		right: 0,
	},
});

export default CustomiseScreen;
