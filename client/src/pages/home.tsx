import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TaskForm from "@/components/task-form";
import TaskList from "@/components/task-list";
import NotificationBell from "@/components/notification-bell";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { type Task } from "@shared/schema";

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
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">My Tasks</h1>
          <NotificationBell tasks={tasks} />
        </div>

        <Card className="p-6 mb-8">
          <TaskForm />
        </Card>

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