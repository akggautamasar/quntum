import { getFolderHierarchy } from '@/actions';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getGlobalTGCloudContext } from '@/lib/context';
import { useCreateQueryString } from '@/lib/utils';
import { ChevronRight, Home, Plus } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { use, useOptimistic, useState } from 'react';

export type AllFolder = {
	id: string;
	name: string;
	userId: string;
	parentId: string | null;
	path: string;
	createdAt: string | null;
	updatedAt: string | null;
}[];

interface FolderNavigationBarProps {
	currentPath?: string[];
	onNavigate: (path: string) => void;
	onCreateFolder: (folderName: string) => void;
	currentFolderId: string | null;
	userId: string;
	folders: Awaited<ReturnType<typeof getFolderHierarchy>>;
	allFolder: AllFolder;
}

export default function FolderNavigationBar({
	onNavigate,
	onCreateFolder,
	currentFolderId,
	userId,
	folders,
	allFolder
}: FolderNavigationBarProps) {
	const [newFolderName, setNewFolderName] = useState('');
	const currentFolder = allFolder.find((folder) => folder.id === currentFolderId);
	const pathNames = currentFolder ? currentFolder.path.split('/').filter(Boolean) : [];
	const [optimisiticPathNames, setOPtimisticPathNames] = useOptimistic(pathNames);
	const TGCloudGlobalContext = getGlobalTGCloudContext();

	const router = useRouter();
	const pathname = usePathname();
	const searchParam = useSearchParams();

	const createQueryString = useCreateQueryString(searchParam);

	const handleCreateFolder = () => {
		if (newFolderName.trim()) {
			onCreateFolder(newFolderName.trim());
			setNewFolderName('');
		}
	};

	return (
		<div className="	flex items-center justify-between p-2 bg-zinc-800 rounded-md">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink className="cursor-pointer" onClick={() => onNavigate('')}>
							<Home className="h-4 w-4" />
						</BreadcrumbLink>
					</BreadcrumbItem>
					{optimisiticPathNames?.length > 0 && (
						<BreadcrumbSeparator>
							<ChevronRight className="h-4 w-4" />
						</BreadcrumbSeparator>
					)}
					{optimisiticPathNames.map((folder, index) => (
						<BreadcrumbItem className="cursor-pointer" key={index}>
							<BreadcrumbLink
								onClick={() => {
									const expectedPath = pathNames.slice(0, index + 1);
									const fullPath = `/${expectedPath.join('/')}`;
									const matchingFolder = allFolder.find((f) => f.path === fullPath);
									const query = createQueryString('folderId', matchingFolder?.id!);
									TGCloudGlobalContext?.startPathSwitching(() => {
										setOPtimisticPathNames(expectedPath);
										router.push(pathname + '?' + query);
									});
								}}
							>
								{folder}
							</BreadcrumbLink>
							{index < pathNames.length - 1 && (
								<BreadcrumbSeparator>
									<ChevronRight className="h-4 w-4" />
								</BreadcrumbSeparator>
							)}
						</BreadcrumbItem>
					))}
				</BreadcrumbList>
			</Breadcrumb>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline" size="icon">
						<Plus className="h-4 w-4" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80">
					<div className="flex flex-col space-y-2">
						<h3 className="font-medium">Create New Folder</h3>
						<div className="flex space-x-2">
							<Input
								placeholder="Folder name"
								value={newFolderName}
								onChange={(e) => setNewFolderName(e.target.value)}
							/>
							<Button onClick={handleCreateFolder}>Create</Button>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
