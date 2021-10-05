import { ImageSourcePropType } from "react-native";

export type PathDataType = [number, number][];

export interface PathType {
	/**
	 * Color of the path
	 */
	color: string;

	/**
	 * SVG path
	 */
	path: string;

	/**
	 * Raw points data used to create the SVG path
	 */
	data: PathDataType;

	/**
	 * Thickness of the path
	 */
	thickness: number;

	/**
	 * Opacity of the path
	 */
	opacity: number;
}

export interface FontItem {
	id: string;
	font: string;
}

export interface ColorItem {
	id: string;
	hex: string;
}

export type TOccasion = {
	key: string;
	image: ImageSourcePropType;
	backgroundColor?: string;
	showCurvedGradient?: boolean;
	box?: boolean;
	verticalPosition?: "flex-start" | "flex-end" | "center";
	height?: string;
};

export type Sticker = {
	key: string;
	name: string;
	tags: string[];
	svg: string;
};
