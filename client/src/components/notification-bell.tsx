import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Task } from "@shared/schema";
import { format } from "date-fns";

interface NotificationBellProps {
  tasks: Task[];
}

export default function NotificationBell({ tasks }: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const highPriorityDue = tasks.filter(task => 
      task.priority === "high" &&
      !task.completed &&
      new Date(task.dueDate) <= new Date()
    );
    setUnreadCount(highPriorityDue.length);
  }, [tasks]);

  const notifications = tasks
    .filter(task => 
      task.priority === "high" &&
      !task.completed &&
      new Date(task.dueDate) <= new Date()
    )
    .sort((a, b) => 
      new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">High Priority Tasks Due</h4>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No high priority tasks due
            </p>
          ) : (
            <div className="space-y-2">
              {notifications.map(task => (
                <div key={task.id} className="text-sm">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-muted-foreground">
                    Due {format(new Date(task.dueDate), "PPp")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
