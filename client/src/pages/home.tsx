import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TaskForm from "@/components/task-form";
import TaskList from "@/components/task-list";
import NotificationBell from "@/components/notification-bell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { type Task } from "@shared/schema";
import { Plus } from "lucide-react";

type PriorityFilter = "all" | "low" | "medium" | "high";

export default function Home() {
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const filteredTasks = tasks
    .filter(task => 
      priorityFilter === "all" || task.priority === priorityFilter
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            My Tasks
          </h1>
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <TaskForm />
              </DialogContent>
            </Dialog>
            <NotificationBell tasks={tasks} />
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6" onValueChange={(value) => setPriorityFilter(value as PriorityFilter)}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="low">Low Priority</TabsTrigger>
            <TabsTrigger value="medium">Medium Priority</TabsTrigger>
            <TabsTrigger value="high">High Priority</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <TaskList tasks={filteredTasks} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="low">
            <TaskList tasks={filteredTasks} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="medium">
            <TaskList tasks={filteredTasks} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="high">
            <TaskList tasks={filteredTasks} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}