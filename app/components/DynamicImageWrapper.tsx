import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
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

export interface DynamicTextWrapperProps {
	image: ImageInfo;
}

type eventContext = {
	translateX: number;
	translateY: number;
	rotation: number;
	scale: number;
};

const { width: BASE_WIDTH, height: BASE_HEIGHT } = Dimensions.get("window");

const DynamicTextWrapper: FC<DynamicTextWrapperProps> = ({ image }) => {
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
		const width = scale.value + 200;

		return {
			transform: [
				{ translateX: translateX.value },
				{ translateY: translateY.value },
				{ rotate: `${rotation.value * (180 / Math.PI)}deg` },
			],
			width,
			height: width,
		};
	});

	const animatedImageStyle = useAnimatedStyle(() => {
		return {
			width: scale.value + 200,
			height: scale.value + 200,
		};
	});

	return (
		<PanGestureHandler
			onGestureEvent={handlePanGesture}
			ref={panRef}
			simultaneousHandlers={[rotationRef, scaleRef]}
		>
			<Animated.View style={[styles.imageWrapper, animatedStyle]}>
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
							<Animated.Image
								source={{ uri: image.uri }}
								style={animatedImageStyle}
							/>
						</PinchGestureHandler>
					</Animated.View>
				</RotationGestureHandler>
			</Animated.View>
		</PanGestureHandler>
	);
};

const styles = StyleSheet.create({
	imageWrapper: {
		zIndex: 299,
		position: "absolute",
		left: 0,
		top: BASE_HEIGHT / 2,
		backgroundColor: "red",
	},
	image: {
		flex: 1,
	},
});

export default DynamicTextWrapper;
