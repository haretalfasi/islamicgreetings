import React, { FC } from "react";
import { TouchableWithoutFeedback, StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";

import { letters, gallery, camera, emoji } from "../svgs/svgList";

export interface MainToolbarProps {
	onCreateNewText: () => void;
	onSelectImage: () => void;
}

const MainToolbar: FC<MainToolbarProps> = ({
	onCreateNewText,
	onSelectImage,
}) => {
	return (
		<>
			<TouchableWithoutFeedback onPress={onCreateNewText}>
				<View>
					<SvgXml xml={letters} width={32} height={32} />
				</View>
			</TouchableWithoutFeedback>
			<TouchableWithoutFeedback onPress={() => onSelectImage()}>
				<View>
					<SvgXml
						xml={gallery}
						width={30}
						height={30}
						style={styles.button}
					/>
				</View>
			</TouchableWithoutFeedback>
			<TouchableWithoutFeedback onPress={() => console.log("Add Photo")}>
				<View>
					<SvgXml
						xml={camera}
						width={28}
						height={28}
						style={styles.button}
					/>
				</View>
			</TouchableWithoutFeedback>
			<TouchableWithoutFeedback onPress={() => console.log("Add Emoji")}>
				<View>
					<SvgXml
						xml={emoji}
						width={28}
						height={28}
						style={styles.button}
					/>
				</View>
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
