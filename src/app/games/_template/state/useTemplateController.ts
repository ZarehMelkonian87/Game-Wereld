import { useMemo } from "react";
import { templateTasks } from "../content/tasks.data";

export const useTemplateController = () => {
  const viewModel = useMemo(
    () => ({
      currentTask: templateTasks[0],
    }),
    [],
  );

  return {
    actions: {},
    viewModel,
  };
};

