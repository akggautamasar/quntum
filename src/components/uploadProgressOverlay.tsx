import { XIcon } from './Icons/icons';
import { Progress } from './ui/progress';

interface UploadProgress {
	itemName: string;
	itemIndex: number;
	progress: number;
	total: number;
}

interface UploadProgressOverlayProps {
	progress: UploadProgress;
	onClose?: () => void;
}

export function UploadProgressOverlay({ progress, onClose }: UploadProgressOverlayProps) {
	const progressPercentage = Math.round(progress.progress * 100);

	return (
		<div className="fixed bottom-4 right-4 z-50">
			<div className="bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg shadow-lg p-4 min-w-[320px]">
				<div className="flex justify-between items-center mb-4">
					<h3 className="font-semibold">Uploading Files</h3>
					{onClose && (
						<button
							onClick={onClose}
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							<XIcon className="w-4 h-4" />
							<span className="sr-only">Close</span>
						</button>
					)}
				</div>

				<div className="space-y-3">
					<div className="flex justify-between items-center text-sm">
						<span
							className="text-muted-foreground font-medium truncate max-w-[200px]"
							title={progress.itemName}
						>
							{progress.itemName}
						</span>
						<span className="text-muted-foreground ml-2">
							{progress.itemIndex + 1} of {progress.total}
						</span>
					</div>

					<div className="space-y-1.5">
						<Progress value={progressPercentage} />
						<div className="text-xs text-muted-foreground text-right">{progressPercentage}%</div>
					</div>
				</div>
			</div>
		</div>
	);
}
