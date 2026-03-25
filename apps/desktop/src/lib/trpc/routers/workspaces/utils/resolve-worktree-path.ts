import { homedir } from "node:os";
import { join } from "node:path";
import { type SelectProject, settings } from "@superset/local-db";
import { localDb } from "main/lib/local-db";
import { SUPERSET_DIR_NAME, WORKTREES_DIR_NAME } from "shared/constants";

/** Resolves base dir: project override > global setting > default (~/.superset/worktrees) */
export function resolveWorktreePath(
	project: Pick<
		SelectProject,
		"name" | "worktreeBaseDir" | "flatWorktreeLayout"
	>,
	branch: string,
): string {
	const resolvePath = (baseDir: string) =>
		project.flatWorktreeLayout
			? join(baseDir, branch)
			: join(baseDir, project.name, branch);

	if (project.worktreeBaseDir) {
		return resolvePath(project.worktreeBaseDir);
	}

	const row = localDb.select().from(settings).get();
	const baseDir =
		row?.worktreeBaseDir ??
		join(homedir(), SUPERSET_DIR_NAME, WORKTREES_DIR_NAME);

	return resolvePath(baseDir);
}
