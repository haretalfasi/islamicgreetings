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

export interface DynamicImageWrapperProps {
	image: ImageInfo;
}

type eventContext = {
	translateX: number;
	translateY: number;
	rotation: number;
	scale: number;
};

const { width: BASE_WIDTH, height: BASE_HEIGHT } = Dimensions.get("window");

const DynamicImageWrapper: FC<DynamicImageWrapperProps> = ({ image }) => {
	const panRef = useRef();
	const rotationRef = useRef();
	const scaleRef = useRef();

	const baseImageWidth = image.width / 12;
	const baseImageHeight = image.height / 12;

	console.log({ width: image.width, height: image.height });

	const translateX = useSharedValue(0);
	const translateY = useSharedValue(0);
	const rotation = useSharedValue(0);
	const scale = useSharedValue(1);

	const handlePanGesture = useAnimatedGestureHandler<
		PanGestureHandlerGestureEvent,
		eventContext
	>({
		onStart: (event, context) => {
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
			console.log(event.scale);
			scale.value = context.scale * event.scale;
		},
	});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: translateX.value },
				{ translateY: translateY.value },
				{ rotate: `${rotation.value * (180 / Math.PI)}deg` },
			],
			width: scale.value * baseImageWidth,
			height: scale.value * baseImageHeight,
		};
	});

	const animatedImageStyle = useAnimatedStyle(() => {
		const imageWidth = scale.value * baseImageWidth;
		const imageHeight = scale.value * baseImageHeight;
		return {
			width: imageWidth,
			height: imageHeight,
		};
	});

	return (
		<PanGestureHandler
			onGestureEvent={handlePanGesture}
			ref={panRef}
			simultaneousHandlers={[rotationRef, scaleRef]}
		>
			<Animated.View
				style={[
					styles.imageWrapper,
					animatedStyle,
					{
						width: baseImageWidth,
						height: baseImageHeight,
					},
				]}
			>
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
								style={[
									animatedImageStyle,
									{
										width: baseImageWidth,
										height: baseImageHeight,
									},
								]}
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
});

export default DynamicImageWrapper;
