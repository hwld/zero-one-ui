import { Project } from "../../../_backend/taskbox/project/model";
import { ProjectPositionChange } from "../../../_backend/taskbox/project/schema";
import { ProjectExpansionMap } from "./expansion-map";

// orderは存在せず、配列の並びで順番を決める
export type ProjectNode = Omit<Project, "subProjects" | "order" | "parentProjectId"> & {
  depth: number;
  visible: boolean;
  descendantsProjectCount: number;
};

export type ProjectMap = Map<string, Project>;

export const toProjectMap = (projects: Project[]): ProjectMap => {
  const projectMap: ProjectMap = new Map();

  const addToMap = (project: Project) => {
    projectMap.set(project.taskboxId, project);
    project.subProjects.forEach(addToMap);
  };

  projects.forEach(addToMap);

  return projectMap;
};

export const getProjectPositionChanges = (
  baseMap: ProjectMap,
  map: ProjectMap,
): ProjectPositionChange[] => {
  const result: ProjectPositionChange[] = [];

  Array.from(map.entries()).forEach(([id, project]) => {
    const baseProject = baseMap.get(id);
    if (!baseProject) {
      throw new Error("プロジェクトが削除されています");
    }

    if (baseProject.order !== project.order || baseProject.parentId !== project.parentId) {
      result.push({
        projectId: project.taskboxId,
        order: project.order,
        parentProjectId: project.parentId,
      });
    }
  });

  return result;
};

export const toProjectNodes = (
  projects: Project[],
  projectExpansionMap: ProjectExpansionMap,
  depth: number = 0,
  parentVisible: boolean = true,
): ProjectNode[] => {
  return [...projects]
    .sort((a, b) => a.order - b.order)
    .flatMap((project): ProjectNode[] => {
      const descendants = countProjectDescendants(project);

      const node: ProjectNode = {
        ...project,
        depth,
        visible: parentVisible,
        descendantsProjectCount: descendants,
      };

      return [
        node,
        ...toProjectNodes(
          project.subProjects,
          projectExpansionMap,
          depth + 1,
          parentVisible && projectExpansionMap.isExpanded(project.taskboxId),
        ),
      ];
    });
};

export const toProjects = (nodes: ProjectNode[]): Project[] => {
  const stack: Project[] = [];
  const result: Project[] = [];

  for (const node of nodes) {
    while (stack.length > node.depth) {
      stack.pop();
    }

    const project: Project = {
      ...node,
      order: 0,
      parentId: null,
      subProjects: [],
    };

    if (stack.length > 0) {
      const parent = stack[stack.length - 1];
      const parentSubProjects = parent.subProjects;

      project.order = parentSubProjects.length;
      project.parentId = parent.taskboxId;

      parentSubProjects.push(project);
    } else {
      project.order = result.length;
      result.push(project);
    }

    stack.push(project);
  }

  return result;
};

const findProject = (projects: Project[], id: string): Project | undefined => {
  for (const project of projects) {
    if (project.taskboxId === id) {
      return project;
    }

    const found = findProject(project.subProjects, id);
    if (found) {
      return found;
    }
  }
  return undefined;
};

const countProjectDescendants = (project: Project): number => {
  return project.subProjects.reduce((acc, subProject) => {
    return acc + 1 + countProjectDescendants(subProject);
  }, 0);
};

// TODO: fromに含まれるサブプロジェクトがtoIdに来ることを想定していない
// その制限を反映させたい
export const moveProject = (
  projects: Project[],
  projectExpansionMap: ProjectExpansionMap,
  fromId: string,
  toId: string,
): Project[] => {
  if (fromId === toId) {
    return projects;
  }

  const nodes = toProjectNodes(projects, projectExpansionMap);

  const fromIndex = nodes.findIndex((p) => p.taskboxId === fromId);
  let toIndex = nodes.findIndex((p) => p.taskboxId === toId);
  const toNode = nodes[toIndex];

  const newNodes = [...nodes];

  if (
    fromIndex < toIndex &&
    toNode.descendantsProjectCount &&
    !projectExpansionMap.isExpanded(toNode.taskboxId)
  ) {
    // 前から後の移動で、移動対象のプロジェクトにsubProjectsが存在し、展開されていない場合には
    // 移動対象のプロジェクトの子孫プロジェクトの数だけindexをずらす
    const toProject = findProject(projects, toNode.taskboxId);
    if (!toProject) {
      throw new Error("移動対象のプロジェクトが存在しません");
    }

    toIndex = toIndex + countProjectDescendants(toProject);
  }

  newNodes.splice(toIndex, 0, newNodes.splice(fromIndex, 1)[0]);

  // 移動したプロジェクト (from)
  const moved = newNodes[toIndex];

  if (
    fromIndex < toIndex &&
    toNode.descendantsProjectCount &&
    projectExpansionMap.isExpanded(toNode.taskboxId)
  ) {
    moved.depth = toNode.depth + 1;
  } else {
    moved.depth = toNode.depth;
  }

  return toProjects(newNodes);
};

export const updateProjectDepth = (
  projects: Project[],
  projectExpansionMap: ProjectExpansionMap,
  projectId: string,
  newDepth: number,
): Project[] => {
  const nodes = toProjectNodes(projects, projectExpansionMap);

  const targetIndex = nodes.findIndex((p) => p.taskboxId === projectId);
  if (targetIndex === -1) {
    throw new Error(`変更対象のプロジェクトが存在しない: ${projectId}`);
  }

  // 直近でvisibleがtrueのプロジェクトのdepth
  const prevDepth = nodes.slice(0, targetIndex).findLast((p) => p.visible === true)?.depth ?? -1;
  const nextDepth = nodes[targetIndex + 1]?.depth ?? 0;

  // 前の要素のdepth+1以上大きくはできない
  if (newDepth > prevDepth + 1) {
    newDepth = prevDepth + 1;
  }

  // 次の要素よりも小さくできない
  if (newDepth < nextDepth) {
    newDepth = nextDepth;
  }

  if (newDepth < 0) {
    newDepth = 0;
  }

  const newNodes = [...nodes];
  newNodes[targetIndex].depth = newDepth;

  return toProjects(newNodes);
};

export const dragProjectStart = (
  projects: Project[],
  projectExpansionMap: ProjectExpansionMap,
  id: string,
): { results: Project[]; removedDescendantNodes: ProjectNode[] } => {
  const nodes = toProjectNodes(projects, projectExpansionMap);

  const targetIndex = nodes.findIndex((p) => p.taskboxId === id);
  const targetNode = nodes[targetIndex];
  if (!targetNode) {
    throw new Error(`プロジェクトが存在しない: ${id}`);
  }

  const targetProject = findProject(projects, id);
  if (!targetProject) {
    throw new Error(`プロジェクトが存在しない: ${id}`);
  }

  // ドラッグする要素の子孫をすべて削除する
  const descendantCount = countProjectDescendants(targetProject);
  const descendantsStartIndex = targetIndex + 1;
  const descendantsEndIndex = targetIndex + descendantCount + 1;
  const descendants = nodes.slice(descendantsStartIndex, descendantsEndIndex);

  const newNodes = [...nodes.slice(0, descendantsStartIndex), ...nodes.slice(descendantsEndIndex)];

  return { results: toProjects(newNodes), removedDescendantNodes: descendants };
};

export const dragProjectEnd = (
  projects: Project[],
  projectExpansionMap: ProjectExpansionMap,
  id: string,
  removedDescendants: ProjectNode[],
): [Project[], ProjectExpansionMap] => {
  const nodes = toProjectNodes(projects, projectExpansionMap);

  const targetIndex = nodes.findIndex((n) => n.taskboxId === id);
  if (targetIndex === -1) {
    throw new Error(`対象のプロジェクトが存在しない: ${id}`);
  }
  const targetNode = nodes[targetIndex];

  const newNodes = [
    ...nodes.slice(0, targetIndex + 1),
    ...removedDescendants.map((descendant) => {
      const parentDepth = targetNode.depth;
      const descendantRootDepth = removedDescendants[0].depth;

      return {
        ...descendant,
        depth: descendant.depth - descendantRootDepth + parentDepth + 1,
      };
    }),
    ...nodes.slice(targetIndex + 1),
  ];

  const newExpansionMap = new ProjectExpansionMap(projectExpansionMap);

  // ドラッグしたノードの親プロジェクトのexpandedをtrueにする
  if (targetNode.depth > 0) {
    const parent = newNodes.slice(0, targetIndex).findLast((p) => p.depth === targetNode.depth - 1);
    if (!parent) {
      throw new Error(`親プロジェクトが存在しない`);
    }

    newExpansionMap.toggle(parent.taskboxId, true);
  }

  return [toProjects(newNodes), newExpansionMap];
};
