import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./app/routes/AppNavigator";
import { colors } from "./app/config/theme";

export default function App() {
	const [loaded, setLoaded] = useState<boolean>(false);
	const [viewedOnboarder, setViewedOnboarder] = useState<boolean>(false);
	const { getItem } = useAsyncStorage("viewedOnboarder");

	const readItemFromStorage = async () => {
		const result = await getItem();
		setViewedOnboarder(!!result);
		setLoaded(true);
	};

	useEffect(() => {
		readItemFromStorage();
	}, []);

	if (!loaded) return <Text>Loading...</Text>;

	return (
		<NavigationContainer>
			<AppNavigator viewedOnboarder={viewedOnboarder} />
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.darkBlue,
		alignItems: "center",
		justifyContent: "center",
	},
});
