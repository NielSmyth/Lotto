import AIResultsProcessor from "@/components/ai-results-processor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProcessResultsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">AI-Assisted Result Processing</CardTitle>
        <CardDescription>
          Upload lottery entries and provide regulations to let the AI process the results and identify anomalies.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AIResultsProcessor />
      </CardContent>
    </Card>
  );
}
