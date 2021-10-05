import React, { FC, ReactElement } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

export interface HeaderProps {
	children?: ReactElement;
	customStyle?: ViewStyle;
}

const Header: FC<HeaderProps> = ({ children, customStyle = {} }) => {
	return <View style={[styles.header, customStyle]}>{children}</View>;
};

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
		paddingHorizontal: 18,
		justifyContent: "space-between",
		alignContent: "center",
		position: "relative",
		zIndex: 2,
		height: 50,
	},
});

export default Header;
