import React, { FC } from "react";
import { Text as BasicText, StyleSheet } from "react-native";

export interface TextProps {
	children: React.ReactNode;
}

const Text: FC<TextProps> = ({ children }) => {
	return <BasicText style={styles.textStyle}>{children}</BasicText>;
};

const styles = StyleSheet.create({
	textStyle: {
		color: "#fff",
	},
});

export default Text;
