import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertTaskSchema, type InsertTask, type Task } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface TaskFormProps {
  initialTask?: Task;
  onSuccess?: () => void;
}

export default function TaskForm({ initialTask, onSuccess }: TaskFormProps) {
  const { toast } = useToast();
  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: initialTask?.title ?? "",
      description: initialTask?.description ?? "",
      priority: initialTask?.priority ?? "low",
      dueDate: initialTask?.dueDate 
        ? new Date(initialTask.dueDate).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
      completed: initialTask?.completed ?? false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertTask) => {
      if (initialTask) {
        await apiRequest("PATCH", `/api/tasks/${initialTask.id}`, data);
      } else {
        await apiRequest("POST", "/api/tasks", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: initialTask ? "Task updated" : "Task created",
        description: initialTask 
          ? "Your task has been updated successfully."
          : "Your task has been created successfully.",
      });
      form.reset();
      onSuccess?.();
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} 
            className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter task description..." 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input 
                    type="datetime-local" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full md:w-auto bg-primary hover:bg-primary/90"
          >
            {initialTask ? "Update Task" : "Add Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
}