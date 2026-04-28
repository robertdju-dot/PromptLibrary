import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, FileText, Globe, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminAnalyticsPage() {
  const stats = [
    { title: "Total Users", value: "1,248", change: "+12%", icon: Users },
    { title: "Total Prompts", value: "8,593", change: "+24%", icon: FileText },
    { title: "Public Prompts", value: "3,102", change: "+18%", icon: Globe },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <Button className="gap-2" variant="outline">
          <Download className="w-4 h-4" />
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-500 mt-1 font-medium">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-96 flex items-center justify-center border-dashed">
          <p className="text-muted-foreground">User Growth Chart (Mock)</p>
        </Card>
        <Card className="h-96 flex items-center justify-center border-dashed">
          <p className="text-muted-foreground">Top Tags Chart (Mock)</p>
        </Card>
      </div>
    </div>
  );
}
