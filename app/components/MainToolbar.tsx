import React, { FC } from "react";
import { TouchableWithoutFeedback, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";

import { letters, gallery, camera, emoji } from "../svgs/svgList";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";

export interface MainToolbarProps {
	onCreateNewText: () => void;
	onSelectImage: (image: ImageInfo) => void;
	onSelectTool: (tool: "camera" | "draw" | "emoji") => void;
}

const MainToolbar: FC<MainToolbarProps> = ({
	onCreateNewText,
	onSelectImage,
	onSelectTool,
}) => {
	const selectImage = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync();
			if (result.cancelled === false) {
				onSelectImage(result);
			}
		} catch (error) {
			console.log("Error reading an image");
		}
	};

	return (
		<>
			<TouchableWithoutFeedback onPress={onCreateNewText}>
				<View>
					<SvgXml xml={letters} width={32} height={32} />
				</View>
			</TouchableWithoutFeedback>
			<TouchableWithoutFeedback onPress={selectImage}>
				<View>
					<SvgXml
						xml={gallery}
						width={30}
						height={30}
						style={styles.button}
					/>
				</View>
			</TouchableWithoutFeedback>
			<TouchableWithoutFeedback onPress={() => onSelectTool("camera")}>
				<View>
					<SvgXml
						xml={camera}
						width={28}
						height={28}
						style={styles.button}
					/>
				</View>
			</TouchableWithoutFeedback>
			<TouchableWithoutFeedback onPress={() => onSelectTool("emoji")}>
				<View>
					<SvgXml
						xml={emoji}
						width={28}
						height={28}
						style={styles.button}
					/>
				</View>
			</TouchableWithoutFeedback>
			<TouchableWithoutFeedback onPress={() => onSelectTool("draw")}>
				<MaterialCommunityIcons
					name="draw"
					size={32}
					color="white"
					style={styles.button}
				/>
			</TouchableWithoutFeedback>
		</>
	);
};

const styles = StyleSheet.create({
	button: {
		marginLeft: 24,
	},
});

export default MainToolbar;
