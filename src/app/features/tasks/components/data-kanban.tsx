import React, { useCallback, useEffect, useState } from "react";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

import { Task, TaskStatus } from "../types";
import { KanbanCard } from "./kanban-card";
import { KanbanColoumHeader } from "./kanban-column-header";

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.TODO,
  TaskStatus.DONE,
];

type TasksState = {
  [key in TaskStatus]: Task[];
};

interface DataKanbanProps {
  data: Task[];
  onChange: (tasks: { $id: string; status: TaskStatus; position: number }[]) => void;
}

export const DataKanban = ({ data, onChange }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initialTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort(
        (a, b) => a.position - b.position
      );
    });

    return initialTasks;
  });

 

  useEffect(()=>{
    const newTasks: TasksState = {
        [TaskStatus.BACKLOG]: [],
        [TaskStatus.IN_PROGRESS]: [],
        [TaskStatus.IN_REVIEW]: [],
        [TaskStatus.TODO]: [],
        [TaskStatus.DONE]: [],
      };
    
      data.forEach((task) => {
        newTasks[task.status].push(task);
      });


      Object.keys(newTasks).forEach((status) => {
        newTasks[status as TaskStatus].sort(
          (a, b) => a.position - b.position
        );
      });

      setTasks(newTasks);
    
  }, [data]);

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    console.log("FIRED ONCE");

    const { source, destination } = result;
    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    let updatesPayload: {
      $id: string;
      status: TaskStatus;
      position: number;
    }[] = [];

    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };

      //safely remove the task form the source column
      const sourceColumn = [...newTasks[sourceStatus]];
      const [movedTask] = sourceColumn.splice(source.index, 1);

      // if there's no moved task (shouldn't happen, but just in case) return pervious state.
      if (!movedTask) {
        console.error("No task found at the source index");
        return prevTasks;
      }

      // create a new task object with potentially updated status
      const updateMovedTask =
        sourceStatus !== destStatus
          ? { ...movedTask, status: destStatus }
          : movedTask;
        
        // update the source column
        newTasks[sourceStatus] = sourceColumn;

        // add the task to the destination column
        const destColumn = [...newTasks[destStatus]];
        destColumn.splice(destination.index, 0, updateMovedTask);
        newTasks[destStatus] = destColumn;

        //prepare minimal update payloads
        updatesPayload = [];

        //always update the moved task
            updatesPayload.push({
                $id: updateMovedTask.$id,
                status: destStatus,
                position: Math.min((destination.index + 1) * 1000, 1_000_000),
            });
        
        //update positions for affected tasks in the destination column
        newTasks[destStatus].forEach((task, index) =>{
            if(task && task.$id !== updateMovedTask.$id){
                const newPosition = Math.min((index + 1)* 1000, 1_000_000);

                if(task.position !== newPosition){
                    updatesPayload.push({
                        $id: task.$id,
                        status: destStatus,
                        position: newPosition,
                    });
                }
            }
        });

        // if the task moved between columns, update positions in the source column
        if(sourceStatus !== destStatus){
            newTasks[sourceStatus].forEach((task, index) => {
                if(task) {
                    const newPosition = Math.min((index+1)* 1000, 1_000_000);

                    if(task.position !== newPosition){
                        updatesPayload.push({
                            $id: task.$id,
                            status: sourceStatus,
                            position: newPosition,
                        })
                    }
                }
            });   
        }
        return newTasks;
    });

    onChange(updatesPayload);
  }, [onChange]);

  console.log(boards);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[180px]"
            >
              <KanbanColoumHeader
                board={board}
                taskCount={tasks[board].length}
              />
              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] py-1.5"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task.$id}
                        draggableId={task.$id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
