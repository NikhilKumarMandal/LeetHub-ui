import ReactCalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import Tooltip from "react-tooltip";
type Submission = {
  date: string;
  count: number;
};

type SubmissionHeatmapProps = {
  data: Submission[];
};
const SubmissionHeatmap: React.FC<SubmissionHeatmapProps> = ({ data }) => {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Submission Activity</h2>

      <ReactCalendarHeatmap
        startDate={oneYearAgo}
        endDate={today}
        values={data || []}
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
          }) as any
        }
        showWeekdayLabels
      />
      <Tooltip />
    </div>
  );
};

export default SubmissionHeatmap;
