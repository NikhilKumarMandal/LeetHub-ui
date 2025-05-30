interface CircularProgressBarProps {
  value: number;
  maxValue: number;
  size: number;
  strokeWidth: number;
}

export function CircularProgressBar({
  value,
  maxValue,
  size,
  strokeWidth,
}: CircularProgressBarProps) {
  // Calculate the percentage
  const percentage = (value / maxValue) * 100;

  // Calculate the circumference
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Calculate the dash offset
  const dashOffset = circumference - (percentage / 100) * circumference;

  // Get stroke color based on percentage
  const getStrokeColor = () => {
    if (percentage < 25) return "#00e6ca"; // Teal for low progress
    if (percentage < 50) return "#7fd100"; // Green for medium-low
    if (percentage < 75) return "#ffa116"; // Orange for medium-high
    return "#ef4743"; // Red for high progress
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Background circle */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#333"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1s ease-in-out",
          }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold">{value}</span>
        <span className="text-sm text-gray-400">/{maxValue}</span>
      </div>
    </div>
  );
}
