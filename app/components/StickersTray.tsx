import React, { useEffect, useState } from "react";
import {
	View,
	TouchableWithoutFeedback,
	TextInput,
	StyleSheet,
	Keyboard,
	FlatList,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { stickersList } from "../constants";
import { Sticker } from "../types";
import { FontAwesome } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

interface StickerTrayProps {
	onSelectSticker: (sticker: Sticker) => void;
}

const StickerTray = ({ onSelectSticker }: StickerTrayProps) => {
	const [searchText, setSearchText] = useState<string>();
	const [searchResults, setSearchResults] = useState<Sticker[]>(stickersList);

	useEffect(() => {
		if (!searchText) {
			setSearchResults(stickersList);
			return;
		}
		// Every time search text changes
		// We will use its new value to search the sticker list
		const newList = stickersList.filter((item) => {
			if (item.tags.includes(searchText.toLowerCase())) {
				return item;
			}
		});
		setSearchResults(newList);
		console.log(searchResults);
		console.log(searchText);
	}, [searchText]);

	return (
		<BlurView
			intensity={90}
			tint="dark"
			style={{
				padding: 16,
				height: "100%",
				width: "100%",
			}}
		>
			<View style={{ marginBottom: 24 }}>
				<FontAwesome
					name="search"
					size={14}
					color="#666"
					style={styles.searchIcon}
				/>
				<TextInput
					placeholder="Search"
					style={styles.searchBox}
					onChangeText={(text) => setSearchText(text)}
				/>
			</View>

			<FlatList
				data={searchResults}
				keyExtractor={(item) => item.key}
				numColumns={3}
				renderItem={({ item: sticker }) => {
					return (
						<View
							style={{
								width: "33%",
								flexDirection: "row",
								justifyContent: "center",
								marginBottom: 24,
							}}
						>
							<TouchableWithoutFeedback
								onPress={() => {
									onSelectSticker(sticker);
									Keyboard.dismiss();
								}}
								key={sticker.key}
							>
								<SvgXml
									xml={sticker.svg}
									width={84}
									height={84}
								/>
							</TouchableWithoutFeedback>
						</View>
					);
				}}
				contentContainerStyle={{
					width: "100%",
				}}
			/>
		</BlurView>
	);
};

const styles = StyleSheet.create({
	searchBox: {
		backgroundColor: "#eee",
		borderRadius: 8,
		height: 36,
		paddingLeft: 32,
		fontSize: 16,
	},
	searchIcon: {
		position: "absolute",
		zIndex: 2,
		left: 10,
		top: 11,
	},
});

export default StickerTray;
