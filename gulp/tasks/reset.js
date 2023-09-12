import { deleteAsync } from "del";
export const reset = async () => {
	const deletedPaths = await deleteAsync(app.path.clean);
	console.log(app.path.clean);
	return deletedPaths;
};
