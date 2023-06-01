import React from 'react';

type Props = {
	children: React.ReactNode;
	className?: string;
	onClick: () => void;
	disabled?: boolean;
};
export const Button = ({ children, className, onClick, disabled }: Props) => {
	return (
		<button type='button' className={className} onClick={onClick} disabled={disabled}>
			{children}
		</button>
	);
};
