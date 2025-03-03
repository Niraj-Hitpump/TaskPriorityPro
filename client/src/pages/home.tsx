import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TaskForm from "@/components/task-form";
import TaskList from "@/components/task-list";
import SearchBar from "@/components/search-bar";
import NotificationBell from "@/components/notification-bell";
import { Card } from "@/components/ui/card";
import { type Task } from "@shared/schema";

export default function Home() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const filteredTasks = tasks
    .filter(task => 
      task.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" || 
       (filter === "completed" ? task.completed : !task.completed))
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">My Tasks</h1>
          <NotificationBell tasks={tasks} />
        </div>

        <Card className="p-4 mb-6">
          <TaskForm />
        </Card>

        <div className="mb-6">
          <SearchBar 
            search={search}
            onSearchChange={setSearch}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>

        <TaskList 
          tasks={filteredTasks}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
