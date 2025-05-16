import { submissionActivity } from "@/http/api";
import { useQuery } from "@tanstack/react-query";
import ReactCalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

type Submission = {
  date: string;
  count: number;
};

const SubmissionHeatmap: React.FC = () => {
  const { data: submissionData } = useQuery({
    queryKey: ["totalSubmission"],
    queryFn: async () => {
      const { data } = await submissionActivity();
      return data.map((item: { data: string; count: number }) => ({
        date: item.data,
        count: item.count,
      })) as Submission[];
    },
  });

  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Submission Activity</h2>

      <ReactCalendarHeatmap
        startDate={oneYearAgo}
        endDate={today}
        values={submissionData || []}
        classForValue={(value) => {
          if (!value || !value.count) return "color-empty";
          if (value.count >= 5) return "color-scale-4";
          if (value.count >= 3) return "color-scale-3";
          if (value.count >= 2) return "color-scale-2";
          return "color-scale-1";
        }}
        tooltipDataAttrs={(value) =>
          ({
            "data-tip": `${value?.date || "Unknown"} - ${value?.count || 0} submission(s)`,
          } as any)
        }
        showWeekdayLabels
      />

      <Tooltip />
    </div>
  );
};

export default SubmissionHeatmap;

