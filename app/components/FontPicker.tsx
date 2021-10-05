import React from "react";
import {
	FlatList,
	TouchableWithoutFeedback,
	View,
	StyleSheet,
} from "react-native";

import Text from "./Text";
import { fontsList } from "../constants";

export interface FontPickerProps {
	onSetSelectedFont: (font: string) => void;
	selectedFont: string;
}

const FontPicker = ({ onSetSelectedFont, selectedFont }: FontPickerProps) => (
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
				onPress={() => onSetSelectedFont(item.font)}
			>
				<View style={styles.fontOption}>
					<Text
						style={{
							fontFamily: item.font,
							color:
								selectedFont === item.font ? "orange" : "#fff",
						}}
						fontSize={18}
					>
						Aa
					</Text>
				</View>
			</TouchableWithoutFeedback>
		)}
	/>
);

const styles = StyleSheet.create({
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
});

export default FontPicker;
