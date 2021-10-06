import React, { FC, useEffect, useRef, useState, LegacyRef } from "react";
import {
	StyleSheet,
	Dimensions,
	View,
	TouchableWithoutFeedback,
	Image,
	Text,
	ViewStyle,
	TransformsStyle,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import Constants from "expo-constants";
import { SvgXml } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraCapturedPicture } from "expo-camera";
import BottomSheet from "reanimated-bottom-sheet";
import BottomSheetBehavior from "reanimated-bottom-sheet/lib/typescript";
import { MaterialIcons } from "@expo/vector-icons";

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
import { backgroundsList, stickersList } from "../constants";
import AppCamera from "../components/AppCamera";
import Draw from "../components/Draw";
import { PathType, Sticker } from "../types";
import PathsCanvas from "../components/PathsCanvas";
import StickersTray from "../components/StickersTray";
import DynamicStickerWrapper from "../components/DynamicStickerWrapper";
import Animated, {
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

interface CustomiseScreenProps {
	navigation: StackNavigationProp<AppNavigatorParamList, "CustomiseScreen">;
	route: RouteProp<AppNavigatorParamList, "CustomiseScreen">;
}

export interface ImageInterface extends ImageInfo {
	style?: TransformsStyle;
}

const CustomiseScreen: FC<CustomiseScreenProps> = ({ navigation, route }) => {
	const {
		image,
		cardBackground,
		showCurvedGradient,
		verticalPosition,
		box,
		height: imageHeight,
	} = route.params;
	const [strings, setStrings] = useState<stringInterface[]>([]);
	const [imageUris, setImageUris] = useState<ImageInterface[]>([]);
	const [selectedString, setSelectedString] = useState<stringInterface>();
	const [activeTool, setActiveTool] = useState<
		"main" | "text" | "image" | "camera" | "emoji" | "draw"
	>("main");
	const [paths, setPaths] = useState<PathType[]>([]);
	const [snapPoint, setSnapPoint] = useState<0 | 2>(2);
	const [stickers, setStickers] = useState<Sticker[]>([]);
	const [showRemove, setShowRemove] = useState(false);

	const gradient = RoundedGradient(cardBackground);
	const sheetRef = useRef<BottomSheetBehavior>(null);

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

	const requestCameraPermission = async () => {
		const { status } = await Camera.requestPermissionsAsync();
		if (status !== "granted") {
			alert("You need to enable permissions to take photos");
		}
	};

	const handleUsePhoto = (photo: CameraCapturedPicture) => {
		setImageUris([
			...imageUris,
			{ ...photo, style: { transform: [{ rotateY: "180deg" }] } },
		]);
		setActiveTool("main");
	};

	useEffect(() => {
		requestGalleryPermission();
		requestCameraPermission();
	}, []);

	useEffect(() => {
		sheetRef.current?.snapTo(snapPoint);
	}, [snapPoint]);

	const animatedShowRemove = useAnimatedStyle(() => ({
		opacity: withTiming(showRemove ? 1 : 0, { duration: 500 }),
	}));

	return (
		<>
			<Screen style={styles.container}>
				<View style={styles.toolsWrapper}>
					{/main|emoji/.test(activeTool) && (
						<Header>
							<>
								<TouchableWithoutFeedback
									onPress={() =>
										navigation.navigate(
											"BackgroundSelectionScreen"
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
										onSelectImage={(image) =>
											setImageUris([...imageUris, image])
										}
										onSelectTool={(tool) => {
											setActiveTool(tool);
											if (tool == "emoji") {
												setSnapPoint(
													snapPoint === 2 ? 0 : 2
												);
											}
										}}
									/>
								</View>
							</>
						</Header>
					)}
				</View>

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
						{
							backgroundColor: cardBackground,
							justifyContent: verticalPosition,
						},
					]}
				>
					<Image
						source={
							backgroundsList.find((i) => i.key === image)?.image!
						}
						style={[
							{
								width,
								height: box
									? width
									: imageHeight
									? imageHeight
									: "100%",
							},
						]}
					/>

					{showCurvedGradient && (
						<SvgXml
							xml={gradient}
							width={width}
							height={width * 0.178}
							style={styles.roundedGradient}
						/>
					)}

					{strings.map((s) => (
						<DynamicTextWrapper
							key={s.id}
							text={s}
							onPress={() => handleToggleTextTool(s)}
						/>
					))}

					{imageUris.map((image) => (
						<DynamicImageWrapper
							key={image.uri}
							image={image}
							onShowRemove={(value) => setShowRemove(value)}
						/>
					))}

					{paths.length > 0 && activeTool !== "draw" && (
						<PathsCanvas
							height={height}
							width={width}
							paths={paths}
						/>
					)}

					{stickers.map((sticker: Sticker) => (
						<DynamicStickerWrapper
							sticker={sticker}
							key={sticker.key}
						/>
					))}
				</View>
				{/* End Final Image */}

				{activeTool === "camera" && (
					<AppCamera
						onUsePhoto={(photo) => handleUsePhoto(photo)}
						onCloseCamera={() => setActiveTool("main")}
					/>
				)}

				{activeTool === "draw" && (
					<Draw
						onConfirmPaths={(paths) => {
							setPaths(paths);
							setActiveTool("main");
						}}
						initialValues={{ paths }}
					/>
				)}

				<Animated.View
					style={[
						{
							position: "absolute",
							bottom: 50,
							left: width / 2 - 15,
							zIndex: 9000,
						},
						animatedShowRemove,
					]}
				>
					<MaterialIcons name="delete" size={40} color="white" />
				</Animated.View>
			</Screen>
			<BottomSheet
				ref={sheetRef}
				snapPoints={["86%", "50%", 0]}
				borderRadius={10}
				renderContent={() => (
					<StickersTray
						onSelectSticker={(sticker) => {
							setStickers([...stickers, sticker]);
							setSnapPoint(2);
							setActiveTool("main");
						}}
					/>
				)}
				enabledContentTapInteraction={false}
				initialSnap={snapPoint}
				onCloseEnd={() => setSnapPoint(2)}
			/>
		</>
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
	},
	toolsWrapper: {
		position: "absolute",
		top: Constants.statusBarHeight,
		zIndex: 3,
		flex: 1,
		width,
		backgroundColor: "rgba(0,0,0,0.4)",
	},
	roundedGradient: {
		position: "absolute",
		top: width - width * 0.173,
		zIndex: 3,
		left: 0,
		right: 0,
	},
	verticalCentre: {
		position: "absolute",
		width: 2,
		height,
		backgroundColor: "#333",
		left: width / 2 - 1,
		zIndex: 1002,
		top: Constants.statusBarHeight,
	},
	horizontalCentre: {
		position: "absolute",
		width,
		height: 2,
		backgroundColor: "#333",
		top: Constants.statusBarHeight + height / 2,
		zIndex: 1002,
	},
});

export default CustomiseScreen;
