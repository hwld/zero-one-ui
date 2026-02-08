export type Todo2ErrorSimulationScope = "getAll" | "get";

class Todo2ErrorSimulator {
  private errorSimulationScopes: Set<Todo2ErrorSimulationScope> = new Set();

  public addErrorSimulationScope(scope: Todo2ErrorSimulationScope) {
    this.errorSimulationScopes.add(scope);
  }

  public removeErrorSimulationScope(scope: Todo2ErrorSimulationScope) {
    this.errorSimulationScopes.delete(scope);
  }

  public stopErrorSimulation() {
    this.errorSimulationScopes.clear();
  }

  public throwIfScopeActive(scope: Todo2ErrorSimulationScope) {
    if (this.errorSimulationScopes.has(scope)) {
      throw new Error("Simulated error");
    }
  }
}

export const todo2ErrorSimulator = new Todo2ErrorSimulator();
