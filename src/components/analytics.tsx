import { ProjectAnalyticsType } from "@/app/features/projects/api/use-get-project-analytics";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { DottedSperator } from "./dotted-speator";
import { AnalyticsCard } from "./analytics-card";

export const Analytics = ({ data }: ProjectAnalyticsType) => {
    if(!data) return null;

    return (
        <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
            <div className="w-full flex flex-row">
                <div className="flex items-center flex-1">
                    <AnalyticsCard 
                        title="Total Tasks"
                        value={data.taskCount}
                        variant={data.taskDifference > 0 ? "up": "down"}
                        increaseValue={data.taskDifference}
                    />
                    <DottedSperator direction="vertical" />
                </div>
                <div className="flex items-center flex-1">
                    <AnalyticsCard 
                        title="Assigneed Tasks"
                        value={data.assigneeTaskCount}
                        variant={data.assigneeTaskDifference > 0 ? "up": "down"}
                        increaseValue={data.assigneeTaskDifference}
                    />
                    <DottedSperator direction="vertical" />
                </div>

                <div className="flex items-center flex-1">
                    <AnalyticsCard 
                        title="Completed Tasks"
                        value={data.completeTaskCount}
                        variant={data.completeTaskCountDifference > 0 ? "up": "down"}
                        increaseValue={data.completeTaskCountDifference}
                    />
                    <DottedSperator direction="vertical" />
                </div>

                <div className="flex items-center flex-1">
                    <AnalyticsCard 
                        title="OverDue Tasks"
                        value={data.overdueTaskCount}
                        variant={data.overdueTaskCountDifference > 0 ? "up": "down"}
                        increaseValue={data.overdueTaskCountDifference}
                    />
                    <DottedSperator direction="vertical" />
                </div>

                <div className="flex items-center flex-1">
                    <AnalyticsCard 
                        title="InCompleted Tasks"
                        value={data.inCompleteTaskCount}
                        variant={data.inCompleteTaskCountDifference > 0 ? "up": "down"}
                        increaseValue={data.inCompleteTaskCountDifference}
                    />
                    <DottedSperator direction="vertical" />
                </div>
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}