"use client";

import { useCallback } from "react";
import { useWorkspaceId } from "../../workspaces/hooks/use-workspaceId";
import { useProjectId } from "../../projects/hooks/use-project-id";
import { Loader, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DottedSperator } from "@/components/dotted-speator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateTasksModal } from "../hooks/use-create-tasks-modal";
import { useQueryState } from "nuqs";
import { DataFilters } from "./task-filters";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useGetTask } from "../api/use-get-tasks";
import { useTaskFilters } from "../hooks/use-task-filter";
import { DataKanban } from "./data-kanban";
import { TaskStatus } from "../types";
import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";
import { DataCelander } from "./data-calender";
import "./data-calender.css";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean,
}

export const TaskViewSwitcher = ({hideProjectFilter}: TaskViewSwitcherProps) => {
  const [{ status, assigneeId, projectId, dueDate }] = useTaskFilters();

  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const workspaceId = useWorkspaceId();
  const paramProjectId = useProjectId();
  const { open } = useCreateTasksModal();
  const { mutate: bulkUpdate } = useBulkUpdateTasks();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTask({
    workspaceId,
    projectId,
    assigneeId,
    status,
    dueDate,
  });



  const onKanbanChange = useCallback((
    tasks: {$id: string; status: TaskStatus; position: number}[]
  ) => {
    bulkUpdate({
      json: {tasks},
    });
  }, [bulkUpdate]);

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calender">
              Calender
            </TabsTrigger>
          </TabsList>
          <Button size="sm" className="w-full lg:w-auto" onClick={open}>
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSperator className="my-4" />
        <DataFilters hideProjectFilter={hideProjectFilter} />
        <DottedSperator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []}/>
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban onChange={onKanbanChange} data={tasks?.documents ?? []}/>
            </TabsContent>
            <TabsContent value="calender" className="mt-0 h-full pb-4">
              <DataCelander data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
