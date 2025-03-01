import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DivideIcon as LucideIcon } from "lucide-react";

interface DetailItem {
  label: string;
  value: string | number;
  badge?: boolean;
}

interface LoanDetailCardProps {
  title: string;
  icon: LucideIcon;
  items: DetailItem[];
}

export function LoanDetailCard({ title, icon: Icon, items }: LoanDetailCardProps) {
  // Function to determine badge color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
      case "defaulted":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <div className="rounded-full bg-muted p-2">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between py-1">
              <dt className="text-sm text-muted-foreground">{item.label}</dt>
              <dd className="text-sm font-medium">
                {item.badge ? (
                  <Badge className={`${getStatusColor(String(item.value))} px-2 py-0.5 text-xs font-medium`}>
                    {String(item.value)}
                  </Badge>
                ) : (
                  item.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}