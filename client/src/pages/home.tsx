import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TaskForm from "@/components/task-form";
import TaskList from "@/components/task-list";
import NotificationBell from "@/components/notification-bell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { type Task } from "@shared/schema";
import { Plus, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

type PriorityFilter = "all" | "low" | "medium" | "high";

export default function Home() {
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { theme, setTheme } = useTheme();

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
          <h1 className="text-3xl font-bold text-primary">
            My Tasks
          </h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                <TaskForm onSuccess={() => setIsAddDialogOpen(false)} />
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