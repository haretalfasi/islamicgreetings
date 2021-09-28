import React, { FC } from "react";
import { StyleSheet, View } from "react-native";

export interface HeaderProps {
	children: JSX.Element;
}

const Header: FC<HeaderProps> = ({ children }) => {
	return <View style={styles.header}>{children}</View>;
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
