import React from 'react';

type Props = {
	children: React.ReactNode;
	className?: string;
};
export const ButtonContainer = ({ children, className }: Props) => {
	return <div className={className}>{children}</div>;
};
