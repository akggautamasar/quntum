import { LoadingSVG } from './Icons/icons';

export function Loading() {
	return (
		<div className="flex items-center justify-center h-screen bg-primary">
			<div className="animate-spin">
				<LoadingSVG />
			</div>
			<div className="text-primary-foreground text-2xl font-bold">Loading...</div>
		</div>
	);
}
