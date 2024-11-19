import { Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "../../members/api/user-get-member";
import { useGetProjects } from "../../projects/api/use-get-projects";
import { useWorkspaceId } from "../../workspaces/hooks/use-workspaceId";
import { EditTaskForm } from "./edit-task-form";
import { useGetTask } from "../api/use-get-task";

interface EditTaskFromWrapperProps {
  onCancel: () => void;
  id: string,
}

export const EditTaskFormWrapper = ({
  onCancel,
  id,
}: EditTaskFromWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: initialValues, isLoading: isLoadingTasks } = useGetTask({
    taskId: id,
  })

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    image: project.imageUrl,
  }));

  const memberOptions = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }));

  const isLoading = isLoadingProjects || isLoadingMembers || isLoadingTasks;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if(!initialValues){
    return null;
  }

  return (
    <EditTaskForm
        onCancel={onCancel}
        initialValues={initialValues}
        projectOptions={projectOptions ?? []}
        memberOptions={memberOptions ?? []}
    />
  )
};
