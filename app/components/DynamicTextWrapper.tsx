import React, { FC, useRef } from "react";
import { Dimensions, StyleSheet } from "react-native";
import {
	PanGestureHandler,
	PanGestureHandlerGestureEvent,
	PinchGestureHandler,
	PinchGestureHandlerGestureEvent,
	RotationGestureHandler,
	RotationGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { Rubik_300Light, Rubik_700Bold } from "@expo-google-fonts/rubik";
import { useFonts, Arizonia_400Regular } from "@expo-google-fonts/arizonia";
import { Courgette_400Regular } from "@expo-google-fonts/courgette";
import { GloriaHallelujah_400Regular } from "@expo-google-fonts/gloria-hallelujah";
import { Oswald_500Medium } from "@expo-google-fonts/oswald";
import { stringInterface } from "../components/TextTool";

export interface DynamicTextWrapperProps {
	text: stringInterface;
	onPress: () => void;
}

type eventContext = {
	translateX: number;
	translateY: number;
	rotation: number;
	scale: number;
};

const { width: BASE_WIDTH, height: BASE_HEIGHT } = Dimensions.get("window");

const DynamicTextWrapper: FC<DynamicTextWrapperProps> = ({ text, onPress }) => {
	// Fonts
	let [fontsLoaded] = useFonts({
		Rubik_300Light,
		Rubik_700Bold,
		Arizonia_400Regular,
		Courgette_400Regular,
		GloriaHallelujah_400Regular,
		Oswald_500Medium,
	});

	const panRef = useRef();
	const rotationRef = useRef();
	const scaleRef = useRef();

	const translateX = useSharedValue(0);
	const translateY = useSharedValue(0);
	const rotation = useSharedValue(0);
	const scale = useSharedValue(42);

	const handlePanGesture = useAnimatedGestureHandler<
		PanGestureHandlerGestureEvent,
		eventContext
	>({
		onStart: (event, context) => {
			console.log("Panning");
			context.translateX = translateX.value;
			context.translateY = translateY.value;
		},
		onActive: (event, context) => {
			translateX.value = context.translateX + event.translationX;
			translateY.value = context.translateY + event.translationY;
		},
	});

	const handleRotationGesture = useAnimatedGestureHandler<
		RotationGestureHandlerGestureEvent,
		eventContext
	>({
		onStart: (event, context) => {
			context.rotation = rotation.value;
		},
		onActive: (event, context) => {
			rotation.value = context.rotation + event.rotation;
		},
	});

	const handlePinchEvent = useAnimatedGestureHandler<
		PinchGestureHandlerGestureEvent,
		eventContext
	>({
		onStart: (event, context) => {
			context.scale = scale.value;
		},
		onActive: (event, context) => {
			scale.value = context.scale * event.scale;
		},
	});

	const animatedStyle = useAnimatedStyle(() => {
		const width = BASE_WIDTH + scale.value + 500;

		return {
			transform: [
				{ translateX: translateX.value },
				{ translateY: translateY.value },
				{ rotate: `${rotation.value * (180 / Math.PI)}deg` },
			],
			width,
		};
	});

	const animatedFontStyle = useAnimatedStyle(() => ({
		fontSize: scale.value,
	}));

	if (!fontsLoaded) return null;

	return (
		<PanGestureHandler
			onGestureEvent={handlePanGesture}
			ref={panRef}
			simultaneousHandlers={[rotationRef, scaleRef]}
		>
			<Animated.View style={[styles.stringWrapper, animatedStyle]}>
				<RotationGestureHandler
					onGestureEvent={handleRotationGesture}
					ref={rotationRef}
					simultaneousHandlers={[scaleRef, panRef]}
				>
					<Animated.View>
						<PinchGestureHandler
							onGestureEvent={handlePinchEvent}
							ref={scaleRef}
							simultaneousHandlers={[rotationRef, panRef]}
						>
							<Animated.Text
								style={[
									styles.string,
									animatedFontStyle,
									{
										fontFamily: text.fontFamily,
										textAlign: text.textAlign,
										color: text.color,
									},
									text.color === "#FFFFFF" && styles.shadow,
								]}
								onPress={onPress}
							>
								{text.text}
							</Animated.Text>
						</PinchGestureHandler>
					</Animated.View>
				</RotationGestureHandler>
			</Animated.View>
		</PanGestureHandler>
	);
};

const styles = StyleSheet.create({
	stringWrapper: {
		zIndex: 300,
		alignSelf: "flex-start",
		position: "absolute",
		left: -250,
		top: BASE_HEIGHT / 2,
	},
	string: {
		fontSize: 42,
	},
	shadow: {
		textShadowColor: "rgba(0,0,0,0.3)",
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 10,
	},
});

export default DynamicTextWrapper;
