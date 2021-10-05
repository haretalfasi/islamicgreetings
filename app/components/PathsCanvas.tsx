import React from "react";
import Svg, { Path } from "react-native-svg";
import { PathType } from "../types";

export interface PathsCanvasProps {
	height: number;
	width: number;
	paths: PathType[];
}

const PathsCanvas = ({ height, width, paths }: PathsCanvasProps) => (
	<Svg
		height={height}
		width={width}
		style={{
			position: "absolute",
			top: 50,
			zIndex: 298,
		}}
	>
		{paths.map(({ color, path, thickness, opacity }, i) => (
			<Path
				key={i}
				d={path}
				fill="none"
				stroke={color}
				strokeWidth={thickness}
				strokeLinecap="round"
				opacity={opacity}
				strokeLinejoin="round"
			/>
		))}
	</Svg>
);

export default PathsCanvas;
