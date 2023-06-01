type Props = {
	matrix: number[][];
	shortestPath: number[][] | null;
};

export const MatrixDisplay = ({ matrix, shortestPath }: Props): any => {
	return matrix.map((row, rowIndex) =>
		row.map((item, columnIndex) => {
			const isPath = shortestPath?.some(([row, col]) => row === rowIndex && col === columnIndex);

			return (
				<div
					key={`${rowIndex}-${columnIndex}`}
					className={`p-4 w-14 h-14 ${isPath ? 'bg-green-500' : item === -1 ? 'bg-red-500' : 'bg-sky-500'} shadow-lg rounded-lg`}
				>
					{item}
				</div>
			);
		})
	);
};
