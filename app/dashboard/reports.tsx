import React from "react";
import DashboardPage, {
  DashboardCard,
  DashboardSection,
  EmptyState,
} from "../../components/dashboard/DashboardPage";

export default function ReportsScreen() {
  return (
    <DashboardPage
      title="Reports"
      subtitle="Understand your nutrition and progress over time."
      icon="document-text-outline"
    >
      <DashboardSection
        title="Reports"
        subtitle="Your reports will be generated from your tracked data."
      >
        <DashboardCard
          icon="calendar-outline"
          title="Daily Report"
          description="Summary of today's nutrition and activity"
          value="Not available"
        />

        <DashboardCard
          icon="calendar-number-outline"
          title="Weekly Report"
          description="Your weekly performance"
          value="Not available"
        />

        <DashboardCard
          icon="analytics-outline"
          title="Progress Report"
          description="Long-term progress and trends"
          value="Not available"
        />
      </DashboardSection>

      <DashboardSection title="Insights">
        <EmptyState
          icon="stats-chart-outline"
          title="Insights will appear here"
          description="TenaFit will use your tracked meals, activity, weight, hydration, and goals to generate useful reports."
        />
      </DashboardSection>
    </DashboardPage>
  );
}