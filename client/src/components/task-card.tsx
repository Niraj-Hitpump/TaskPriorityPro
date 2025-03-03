import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { type Task } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Edit2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import TaskForm from "./task-form";

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const toggleMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/tasks/${task.id}`, {
        completed: !task.completed,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/tasks/${task.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  return (
    <>
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleMutation.mutate()}
            disabled={toggleMutation.isPending}
          />

          <div className="flex-1">
            <h3 className={cn(
              "text-lg font-medium",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>

            {task.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {task.description}
              </p>
            )}

            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Due {format(new Date(task.dueDate), "PPp")}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditDialogOpen(true)}
              className="hover:bg-primary/10"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm initialTask={task} onSuccess={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}