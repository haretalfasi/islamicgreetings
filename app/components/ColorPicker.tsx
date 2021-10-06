import React from "react";
import {
	FlatList,
	TouchableWithoutFeedback,
	View,
	StyleSheet,
	ViewStyle,
} from "react-native";
import { colorsList } from "../constants";

export interface ColorPickerProps {
	onSetSelectedColor: (color: string) => void;
	customStyle?: ViewStyle;
}

const ColorPicker = ({
	onSetSelectedColor,
	customStyle = {},
}: ColorPickerProps) => (
	<View>
		<FlatList
			contentContainerStyle={[
				{
					alignItems: "center",
				},
				customStyle,
			]}
			horizontal
			scrollEnabled
			showsHorizontalScrollIndicator={false}
			data={colorsList}
			keyExtractor={(item) => item.id}
			keyboardShouldPersistTaps="always"
			renderItem={({ item }) => (
				<TouchableWithoutFeedback
					onPress={() => onSetSelectedColor(item.hex)}
				>
					<View
						style={[styles.color, { backgroundColor: item.hex }]}
					/>
				</TouchableWithoutFeedback>
			)}
		/>
	</View>
);

const styles = StyleSheet.create({
	color: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#fff",
		marginHorizontal: 8,
	},
});

export default ColorPicker;
