import { describe, expect, it } from "vite-plus/test";
import {
  getOrderBasedOnProject,
  validateDeleteInput,
  validateUpdateInput,
  validateUpdatePositionInputs,
  type Project,
} from "./model";

describe("project model", () => {
  describe("getOrderBasedOnProject", () => {
    it("あるプロジェクトのbeforeのorderを正しく取得できる", () => {
      const baseProject = genProject({
        taskboxId: "1",
        order: 10,
        parentId: "parent",
        subProjects: [genProject(), genProject()],
      });

      const order = getOrderBasedOnProject({
        baseProjectId: baseProject.taskboxId,
        position: "before",
        getProject: () => baseProject,
      });

      expect(order.parentId).toBe("parent");
      expect(order.order).toBe(10);
    });

    it("サブプロジェクトが存在しないプロジェクトのafterのorderを正しく取得できる", () => {
      const baseProject = genProject({
        taskboxId: "1",
        order: 10,
        parentId: "parent",
        subProjects: [],
      });

      const order = getOrderBasedOnProject({
        baseProjectId: baseProject.taskboxId,
        position: "after",
        getProject: () => baseProject,
      });

      expect(order.parentId).toBe("parent");
      expect(order.order).toBe(11);
    });

    it("サブプロジェクトが存在するプロジェクトのafterのorderを正しく取得できる", () => {
      const baseProject = genProject({
        taskboxId: "1",
        order: 10,
        parentId: "parent",
        subProjects: [genProject(), genProject()],
      });

      const order = getOrderBasedOnProject({
        baseProjectId: baseProject.taskboxId,
        position: "after",
        getProject: () => baseProject,
      });

      expect(order.parentId).toBe("1");
      expect(order.order).toBe(0);
    });
  });

  describe("validateUpdateInput", () => {
    it("検証に成功する", () => {
      const execute = () =>
        validateUpdateInput(
          { id: "1", label: "label" },
          { getProject: () => genProject({ taskboxId: "1" }) },
        );

      expect(execute).not.toThrowError();
    });

    it("プロジェクトが存在しないときにはエラー", () => {
      const execute = () =>
        validateUpdateInput({ id: "1", label: "label" }, { getProject: () => undefined });

      expect(execute).toThrowError();
    });
  });

  describe("validateUpdatePositionInputs", () => {
    it("検証に成功する", () => {
      const execute = () =>
        validateUpdatePositionInputs(
          [
            { projectId: "1", parentProjectId: null, order: 0 },
            { projectId: "2", parentProjectId: null, order: 1 },
          ],
          {
            getProjects: () => [
              genProject({ taskboxId: "1", parentId: null }),
              genProject({ taskboxId: "2", parentId: null }),
            ],
          },
        );

      expect(execute).not.toThrowError();
    });

    it("存在しないプロジェクトがあるとエラー", () => {
      const execute = () =>
        validateUpdatePositionInputs(
          [
            { projectId: "1", parentProjectId: null, order: 0 },
            { projectId: "2", parentProjectId: null, order: 1 },
          ],
          {
            getProjects: () => [genProject({ taskboxId: "1", parentId: null })],
          },
        );

      expect(execute).toThrowError();
    });
  });

  describe("validateDeleteInput", () => {
    it("検証に成功する", () => {
      const execute = () => {
        validateDeleteInput(
          { projectId: "1" },
          { getProject: () => genProject({ taskboxId: "1" }) },
        );
      };

      expect(execute).not.toThrowError();
    });

    it("存在しないプロジェクトだとエラー", () => {
      const execute = () => {
        validateDeleteInput({ projectId: "1" }, { getProject: () => undefined });
      };

      expect(execute).toThrowError();
    });
  });
});

export const genProject = (project?: Partial<Project>): Project => {
  return {
    taskboxId: project?.taskboxId ?? crypto.randomUUID(),
    label: project?.label ?? "project",
    order: project?.order ?? 0,
    parentId: project?.parentId ?? null,
    subProjects: project?.subProjects ?? [],
    taskCount: project?.taskCount ?? 0,
  };
};
