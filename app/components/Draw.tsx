import React, {
	Dispatch,
	forwardRef,
	SetStateAction,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import {
	Alert,
	Animated,
	Dimensions,
	Easing,
	StyleProp,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
	ViewStyle,
} from "react-native";
import {
	PanGestureHandler,
	PanGestureHandlerGestureEvent,
	PanGestureHandlerStateChangeEvent,
	State,
} from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import { createSVGPath } from "../utils";
import type { PathDataType, PathType } from "../types";
import SVGRenderer from "./SVGRenderer";
import ColorPicker from "./ColorPicker";
import {
	DEFAULT_COLORS,
	DEFAULT_THICKNESS,
	DEFAULT_OPACITY,
	colorsList,
} from "../constants";
import Header from "./Header";
import Constants from "expo-constants";
import Slider from "@react-native-community/slider";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export interface DrawInitialValues {
	/**
	 * Initial brush color, from the colors provided
	 */
	color?: string;

	/**
	 * Initial thickness of the brush strokes
	 * @default DEFAULT_THICKNESS
	 */
	thickness?: number;

	/**
	 * Initial opacity of the brush strokes
	 * @default DEFAULT_OPACITY
	 */
	opacity?: number;

	/**
	 * Paths to be already drawn
	 * @default []
	 */
	paths?: PathType[];
}

export interface SimplifyOptions {
	/**
	 * Enable SVG path simplification on paths, except the one currently being drawn
	 */
	simplifyPaths?: boolean;

	/**
	 * Enable SVG path simplification on the stroke being drawn
	 */
	simplifyCurrentPath?: boolean;

	/**
	 * Amount of simplification to apply
	 */
	amount?: number;

	/**
	 * Ignore fractional part in the points. Improves performance
	 */
	roundPoints?: boolean;
}

export interface DrawProps {
	/**
	 * Color palette colors, specifying the color palette sections each containing rows of colors
	 * @default DEFAULT_COLORS
	 */
	colors?: string[][][];

	/**
	 * Initial values for color the brush and paths
	 */
	initialValues?: DrawInitialValues;

	/**
	 * Override the style of the container of the canvas
	 */
	canvasStyle?: StyleProp<ViewStyle>;

	/**
	 * Override the style of the buttons
	 */
	buttonStyle?: StyleProp<ViewStyle>;

	/**
	 * Callback function when paths change
	 */
	onPathsChange?: (paths: PathType[]) => any;

	/**
	 * Height of the canvas
	 */
	height?: number;

	/**
	 * Width of the canvas
	 */
	width?: number;

	/**
	 * Hide all of the bottom section, below the canvas, or only certain functionalities
	 */
	hideBottom?: boolean;

	/**
	 * SVG simplification options
	 */
	simplifyOptions?: SimplifyOptions;
	onConfirmPaths: (paths: PathType[]) => void;
}

export interface DrawRef {
	/**
	 * Undo last brush stroke
	 */
	undo: () => void;

	/**
	 * Change brush color
	 */
	setColor: Dispatch<SetStateAction<string>>;

	/**
	 * Removes all brush strokes
	 */
	clear: () => void;

	/**
	 * Get brush strokes data
	 */
	getPaths: () => PathType[];

	/**
	 * Append a path to the current drawing paths
	 */
	addPath: (path: PathType) => void;
}

const Draw = forwardRef<DrawRef, DrawProps>(
	(
		{
			colors = DEFAULT_COLORS,
			initialValues = {},
			canvasStyle,
			buttonStyle,
			onPathsChange,
			height = screenHeight - 100,
			width = screenWidth,
			simplifyOptions = {},
			onConfirmPaths,
		},
		ref
	) => {
		initialValues = {
			thickness: DEFAULT_THICKNESS,
			opacity: DEFAULT_OPACITY,
			paths: [],
			color: colorsList[4].hex,
			...initialValues,
		};

		simplifyOptions = {
			simplifyPaths: true,
			simplifyCurrentPath: false,
			amount: 1,
			roundPoints: true,
			...simplifyOptions,
		};

		const [paths, setPaths] = useState<PathType[]>(initialValues.paths!);
		const [path, setPath] = useState<PathDataType>([]);
		const [color, setColor] = useState(initialValues.color!);
		const [thickness, setThickness] = useState(initialValues.thickness!);
		const [opacity, setOpacity] = useState(initialValues.opacity!);

		const addPath = (x: number, y: number) => {
			setPath((prev) => [
				...prev,
				[
					simplifyOptions.roundPoints ? Math.floor(x) : x,
					simplifyOptions.roundPoints ? Math.floor(y) : y,
				],
			]);
		};

		const onGestureEvent = ({
			nativeEvent: { x, y },
		}: PanGestureHandlerGestureEvent) => {
			addPath(x, y);
		};

		const focusCanvas = () => {
			if (penOpen) {
				handlePenOnPress();
			}
		};

		const handleThicknessOnChange = (t: number) => setThickness(t);

		const handleUndo = () => {
			focusCanvas();
			setPaths((list) =>
				list.filter((_i, key) => key !== list.length - 1)
			);
		};
		const handleColorPickerSelection = (newColor: string) => {
			setColor(newColor);
		};

		const clear = () => {
			setPaths([]);
			setPath([]);
		};

		const reset = () => {
			focusCanvas();
			if (paths.length > 0) {
				Alert.alert(
					"Delete drawing",
					"Are you sure you want to delete your masterpiece?",
					[
						{
							text: "No",
							style: "cancel",
						},
						{
							onPress: clear,
							text: "Yes",
						},
					],
					{
						cancelable: true,
					}
				);
			}
		};

		const [animVal] = useState(new Animated.Value(0));
		const [penOpen, setPenOpen] = useState(false);

		const handlePenOnPress = () => {
			if (!penOpen) {
				setPenOpen(true);
			}
			Animated.timing(animVal, {
				useNativeDriver: true,
				toValue: penOpen ? 0 : -90,
				duration: 300,
				easing: Easing.out(Easing.cubic),
			}).start(() => {
				if (penOpen) {
					setPenOpen(false);
				}
			});
		};

		const onHandlerStateChange = ({
			nativeEvent: { state, x, y },
		}: PanGestureHandlerStateChangeEvent) => {
			focusCanvas();

			if (!penOpen) {
				if (state === State.BEGAN) {
					addPath(x, y);
				} else if (state === State.END || state === State.CANCELLED) {
					setPaths((prev) => [
						...prev,
						{
							color,
							path: createSVGPath(
								path,
								simplifyOptions.simplifyPaths
									? simplifyOptions.amount!
									: 0,
								simplifyOptions.roundPoints!
							),
							data: path,
							thickness,
							opacity,
						},
					]);
					setPath([]);
				}
			}
		};

		const opacityOverlay = animVal.interpolate({
			inputRange: [-50, 0],
			outputRange: [0.5, 0],
			extrapolate: "clamp",
		});

		const viewOpacity = animVal.interpolate({
			inputRange: [penOpen ? -50 : -180, 0],
			outputRange: [1, 0],
			extrapolate: "clamp",
		});

		const canvasContainerStyles = [
			styles.canvas,
			{
				transform: [{ translateY: animVal }],
				height,
				width,
			},
			canvasStyle,
		];

		useEffect(
			() => onPathsChange && onPathsChange(paths),
			[paths, onPathsChange]
		);

		useImperativeHandle(ref, () => ({
			undo: handleUndo,
			clear,
			setColor,
			getPaths: () => paths,
			addPath: (newPath) => {
				setPaths((prev) => [...prev, newPath]);
			},
		}));

		return (
			<View style={styles.drawWrapper}>
				<Header customStyle={styles.toolbar}>
					<>
						<TouchableWithoutFeedback onPress={reset}>
							<MaterialIcons
								name="delete"
								size={30}
								color="white"
							/>
						</TouchableWithoutFeedback>
						<TouchableWithoutFeedback onPress={handleUndo}>
							<View style={{ marginLeft: 16 }}>
								<FontAwesome5
									name="undo-alt"
									size={22}
									color="white"
								/>
							</View>
						</TouchableWithoutFeedback>
						<TouchableWithoutFeedback
							onPress={() => onConfirmPaths(paths)}
						>
							<View style={{ marginLeft: 16 }}>
								<FontAwesome5
									name="check"
									size={22}
									color="white"
								/>
							</View>
						</TouchableWithoutFeedback>
					</>
				</Header>
				<Animated.View style={canvasContainerStyles}>
					<PanGestureHandler
						maxPointers={1}
						minDist={0}
						avgTouches={false}
						onHandlerStateChange={onHandlerStateChange}
						onGestureEvent={onGestureEvent}
						hitSlop={{
							height,
							width,
							top: 0,
							left: 0,
						}}
						shouldCancelWhenOutside
					>
						<View style={styles.canvasContent}>
							<SVGRenderer
								currentColor={color}
								currentOpacity={opacity}
								currentPath={path}
								currentThickness={thickness}
								currentPathTolerance={
									simplifyOptions.simplifyCurrentPath
										? simplifyOptions.amount!
										: 0
								}
								roundPoints={simplifyOptions.roundPoints!}
								paths={paths}
								height={height}
								width={width}
							/>
						</View>
					</PanGestureHandler>
				</Animated.View>
				<Slider
					minimumValue={5}
					maximumValue={35}
					step={1}
					value={thickness}
					onValueChange={(value) => handleThicknessOnChange(value)}
					thumbTintColor="white"
					minimumTrackTintColor="white"
					style={styles.thicknessSlider}
					vertical
				/>
				<ColorPicker
					onSetSelectedColor={handleColorPickerSelection}
					customStyle={{
						backgroundColor: "rgba(0,0,0,0.4)",
						height: 50,
					}}
				/>
			</View>
		);
	}
);

const styles = StyleSheet.create({
	drawWrapper: {
		top: Constants.statusBarHeight,
		justifyContent: "space-between",
		height: screenHeight,
		position: "absolute",
	},
	canvas: {
		width: "100%",
	},
	canvasContent: {
		width: "100%",
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	toolbar: {
		justifyContent: "flex-end",
	},
	thicknessSlider: {
		position: "absolute",
		top: screenHeight / 2,
		left: -screenWidth / 2 + 20,
		width: "100%",
		backgroundColor: "rgba(0,0,0,0.3)",
		transform: [
			{
				rotate: "270deg",
			},
		],
	},
});

export default Draw;
