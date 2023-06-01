import { useEffect, useMemo, useState } from 'react';

import './App.css';
import { MatrixDisplay } from './components';
import { Button, ButtonContainer } from './components/Buttons';

interface Node {
	row: number;
	col: number;
	g: number;
	h: number;
	f: number;
	parent: Node | null;
}

const generateMatrix = (numbersOfRowColomun: number, blockingObjectCount: number): number[][] => {
	const matrix: number[][] = [];

	for (let i = 0; i < numbersOfRowColomun; i++) {
		matrix[i] = [];
		for (let j = 0; j < numbersOfRowColomun; j++) {
			matrix[i][j] = 0;
		}
	}

	let blockersCount = 0;

	while (blockersCount < blockingObjectCount) {
		if (blockersCount > numbersOfRowColomun * numbersOfRowColomun - 3) {
			return matrix;
		}

		const row = Math.floor(Math.random() * numbersOfRowColomun);
		const col = Math.floor(Math.random() * numbersOfRowColomun);

		if (matrix[row][col] !== -1 && (row !== 0 || col !== 0) && (row !== numbersOfRowColomun - 1 || col !== numbersOfRowColomun - 1)) {
			matrix[row][col] = -1;
			blockersCount++;
		}
	}

	return matrix;
};

function App() {
	const [animateRestartButton, setAnimateRestartButton] = useState(false);
	const [grid, setGrid] = useState(5);
	const [start] = useState([0, 0]);
	const [end] = useState([grid, grid]); 

	const findShortestPath = (matrix: number[][]) => {
		const numRows = matrix.length;
		const numCols = matrix[0].length;

		const movingObjectRow = 0; 
		const movingObjectCol = 0; 

		const isValidPosition = (row: number, col: number) => {
			return row >= 0 && row < numRows && col >= 0 && col < numCols;
		};

		const calculateHeuristic = (row: number, col: number, targetRow: number, targetCol: number) => {
			return Math.abs(targetRow - row) + Math.abs(targetCol - col);
		};

		const isPositionBlocked = (row: number, col: number) => {
			return matrix[row][col] === -1 || (row === movingObjectRow && col === movingObjectCol);
		};

		const findPath = () => {
			const startNode = { row: start[0], col: start[1], g: 0, h: 0, f: 0, parent: null };
			const targetNode = { row: end[0] - 1, col: end[1] - 1, g: 0, h: 0, f: 0, parent: null };

			const openList = [startNode];
			const closedList = [];

			while (openList.length > 0) {
				if (closedList.length >= 25) {
					setAnimateRestartButton(true);
					return null;
				}

				const currentNode = openList.reduce((minNode, node) => (node.f < minNode.f ? node : minNode));

				if (currentNode.row === targetNode.row && currentNode.col === targetNode.col) {
					return reconstructPath(currentNode);
				}

				const neighbors = [
					{ row: currentNode.row - 1, col: currentNode.col },
					{ row: currentNode.row + 1, col: currentNode.col },
					{ row: currentNode.row, col: currentNode.col - 1 },
					{ row: currentNode.row, col: currentNode.col + 1 },
				];

				for (const neighbor of neighbors) {
					const { row, col } = neighbor;

					if (isValidPosition(row, col) && !isPositionBlocked(row, col)) {
						const g = currentNode.g + 1;
						const h = calculateHeuristic(row, col, targetNode.row, targetNode.col);
						const f = g + h;

						const existingNodeIndex = openList.findIndex((node) => node.row === row && node.col === col);
						const existingNode: Node | null = existingNodeIndex !== -1 ? openList[existingNodeIndex] : null;

						if (existingNode && g < existingNode.g) {
							existingNode.g = g;
							existingNode.f = f;
							existingNode.parent = currentNode;
						} else if (!existingNode) {
							openList.push({ row, col, g, h, f, parent: currentNode });
						}
					}
				}

				closedList.push(currentNode);
				openList.splice(openList.indexOf(currentNode), 1);
			}

			setAnimateRestartButton(true);
			return [];
		};

		const reconstructPath = (node: Node | null) => {
			const path = [];
			let currentNode = node;

			while (currentNode) {
				path.unshift({ row: currentNode.row, col: currentNode.col });
				currentNode = currentNode.parent;
			}

			return path.map(({ row, col }) => [row, col]);
		};

		const shortestPath = findPath();

		return shortestPath;
	};

	const [isbuttonClicked, setIsButtonClicked] = useState(false);
	const [path, setPath] = useState<number[][] | null>(null);
	const [blockingObjectCount, setBlockingObjectCount] = useState(3);
	const [matrix, setMatrix] = useState(generateMatrix(5, blockingObjectCount));

	useMemo(() => setMatrix(generateMatrix(grid, blockingObjectCount)), [blockingObjectCount]) as unknown as number[][];

	useEffect(() => {
		if (isbuttonClicked) {
			const path = findShortestPath(matrix);
			setPath(path);
		}
	}, [isbuttonClicked]);

	const handleClick = () => {
		setIsButtonClicked(true);
	};

	const handleRestart = () => {
		setMatrix(generateMatrix(grid, blockingObjectCount));
		setPath(null);
		setIsButtonClicked(false);
		setAnimateRestartButton(false);
	};

	const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		setBlockingObjectCount(Number(ev.target.value));
	};

	const [firstRenderDone, setFirstRenderDone] = useState(false);

	const handleGenerateMatrix = () => {
		setGrid(3);
	};

	useEffect(() => {
		setFirstRenderDone(true);
	}, []);

	useEffect(() => {
		if (!firstRenderDone) return;
		setMatrix(generateMatrix(grid, blockingObjectCount));

	}, [grid]);

	return (
		<>
			<ButtonContainer className='button-container mb-5 flex justify-center gap-5 text-white'>
				<Button
					disabled={animateRestartButton}
					onClick={handleClick}
					className={`bg-indigo-700 ${animateRestartButton ? 'disabled:opacity-30' : ''}`}
				>
					Start
				</Button>
				<Button onClick={handleRestart} className={`bg-red-500 ${animateRestartButton ? 'animate-bounce' : ''}`}>
					Restart
				</Button>
			</ButtonContainer>
			<div className='sidebar'>
				<input
					type='number'
					className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
					value={blockingObjectCount}
					onChange={handleChange}
					disabled={animateRestartButton || isbuttonClicked}
				/>
				<input
					type='number'
					className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
					value={5}
					onChange={handleGenerateMatrix}
				/>
			</div>
			<div className={`grid grid-cols-5 gap-1 text-white`}>
				<MatrixDisplay matrix={matrix} shortestPath={path} />
			</div>
		</>
	);
}

export default App;


