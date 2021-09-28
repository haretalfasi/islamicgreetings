import { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent } from "react-native";

export const useKeyboard = (): [number, boolean] => {
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [keyboardVisible, setkeyboardVisible] = useState(false);

	function onKeyboardDidShow(e: KeyboardEvent): void {
		setKeyboardHeight(e.endCoordinates.height);
		setkeyboardVisible(true);
	}

	function onKeyboardDidHide(): void {
		setKeyboardHeight(0);
		setkeyboardVisible(false);
	}

	useEffect(() => {
		Keyboard.addListener("keyboardDidShow", onKeyboardDidShow);
		Keyboard.addListener("keyboardDidHide", onKeyboardDidHide);
		return (): void => {
			Keyboard.removeListener("keyboardDidShow", onKeyboardDidShow);
			Keyboard.removeListener("keyboardDidHide", onKeyboardDidHide);
		};
	}, []);

	return [keyboardHeight, keyboardVisible];
};
