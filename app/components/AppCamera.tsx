import React, { useRef, useState } from "react";
import {
	StyleSheet,
	View,
	Dimensions,
	Platform,
	TouchableOpacity,
	Text,
	Image,
} from "react-native";
import { Camera, CameraCapturedPicture } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";

const { height, width } = Dimensions.get("window");

export interface AppCameraProps {
	onUsePhoto: (photo: CameraCapturedPicture) => void;
	onCloseCamera: () => void;
}

const AppCamera = ({ onUsePhoto, onCloseCamera }: AppCameraProps) => {
	let camera = useRef<Camera>(null);

	// Screen Ratio and image padding
	const [imagePadding, setImagePadding] = useState(0);
	const [ratio, setRatio] = useState("4:3");
	const [isRatioSet, setIsRatioSet] = useState(false);
	const [type, setType] = useState(Camera.Constants.Type.front);
	const [photo, setPhoto] = useState<CameraCapturedPicture>();

	const screenRatio = height / width;

	const prepareRatio = async () => {
		let desiredRatio = "4:3"; // Start with the system default

		// This issue only affects Android
		if (Platform.OS === "android" && camera.current) {
			const ratios = await camera.current.getSupportedRatiosAsync();
			// Calculate the width/height of each of the supported camera ratios
			// These width/height are measured in landscape mode
			// find the ratio that is closest to the screen ratio without going over
			let distances: any = {};
			let realRatios: any = {};
			let minDistance = "";
			for (const ratio of ratios) {
				const parts = ratio.split(":");
				const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
				realRatios[ratio] = realRatio;
				// ratio can't be taller than screen, so we don't want an abs()
				const distance = screenRatio - realRatio;
				distances[ratio] = realRatio;
				if (minDistance === "") {
					minDistance = ratio;
				} else {
					if (distance >= 0 && distance < distances[minDistance]) {
						minDistance = ratio;
					}
				}
			}
			// set the best match
			desiredRatio = minDistance;

			//  calculate the difference between the camera width and the screen height
			const remainder = Math.floor(
				(height - realRatios[desiredRatio] * width) / 2
			);
			// set the preview padding and preview ratio
			setImagePadding(remainder / 2);
			setRatio(desiredRatio);
			// Set a flag so we don't do this
			// calculation each time the screen refreshes
			setIsRatioSet(true);
		}
	};

	// the camera must be loaded in order to access the supported ratios
	const setCameraReady = async () => {
		if (!isRatioSet) {
			await prepareRatio();
		}
	};

	const snap = async () => {
		if (camera.current) {
			let photo = await camera.current.takePictureAsync({ quality: 1 });
			if (photo) {
				setPhoto(photo);
			}
		}
	};

	const handleUsePhoto = () => {
		photo && onUsePhoto(photo);
	};

	const handleSetType = () =>
		setType(
			type === Camera.Constants.Type.back
				? Camera.Constants.Type.front
				: Camera.Constants.Type.back
		);

	return (
		<View style={styles.cameraWrapper}>
			{!photo && (
				<Camera
					style={[
						styles.cameraPreview,
						{ marginVertical: imagePadding },
					]}
					onCameraReady={setCameraReady}
					ratio={ratio}
					ref={camera}
					type={type}
				>
					<TouchableOpacity
						onPress={onCloseCamera}
						style={{ position: "absolute", top: 20, left: 20 }}
					>
						<MaterialIcons name="close" size={32} color="white" />
					</TouchableOpacity>
					<View style={styles.buttonContainer}>
						<TouchableOpacity onPress={handleSetType}>
							<MaterialIcons
								name="flip-camera-android"
								size={40}
								color="white"
							/>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={snap}
							style={styles.takePhoto}
						/>
					</View>
				</Camera>
			)}

			{photo?.uri && (
				<View style={{ flex: 1 }}>
					<Image
						source={{ uri: photo.uri }}
						height={photo.height}
						width={photo.width}
						style={{ flex: 1, transform: [{ rotateY: "180deg" }] }}
					/>
					<TouchableOpacity
						onPress={onCloseCamera}
						style={{ position: "absolute", top: 20, left: 20 }}
					>
						<MaterialIcons name="close" size={32} color="white" />
					</TouchableOpacity>
					<View style={styles.retakeButtonContainer}>
						<TouchableOpacity onPress={handleUsePhoto}>
							<Text style={styles.text}> Use </Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => setPhoto(undefined)}>
							<Text style={styles.text}> Retake </Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	cameraWrapper: {
		flex: 1,
		width,
		height,
		justifyContent: "center",
		zIndex: 1000,
		position: "absolute",
		backgroundColor: "#000",
		top: Constants.statusBarHeight,
	},
	cameraPreview: {
		flex: 1,
		justifyContent: "flex-end",
	},
	buttonContainer: {
		marginVertical: 20,
		width: "100%",
		flexDirection: "row",
		justifyContent: "flex-end",
		position: "relative",
		alignItems: "center",
		height: 72,
		paddingHorizontal: 24,
	},
	takePhoto: {
		position: "absolute",
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: "white",
		left: width / 2 - 30,
		top: 6,
	},
	button: {
		alignSelf: "center",
	},
	text: {
		fontSize: 18,
		color: "white",
	},
	retakeButtonContainer: {
		position: "absolute",
		height: 40,
		flexDirection: "row",
		justifyContent: "space-between",
		bottom: 25,
		alignItems: "center",
		width: "100%",
		paddingHorizontal: 24,
	},
});

export default AppCamera;
