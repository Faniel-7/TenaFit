import React from "react";
import DashboardPage, {
  DashboardCard,
  DashboardSection,
  EmptyState,
} from "../../components/dashboard/DashboardPage";

export default function WorkoutsScreen() {
  return (
    <DashboardPage
      title="Workouts"
      subtitle="Stay active and keep moving toward your goal."
      icon="barbell-outline"
    >
      <DashboardSection
        title="Today's Workout"
        subtitle="Your exercise plan will be based on your activity and commitment."
      >
        <DashboardCard
          icon="fitness-outline"
          title="Today's Activity"
          description="Your personalized workout"
          value="Not planned"
        />

        <DashboardCard
          icon="time-outline"
          title="Duration"
          description="Based on your commitment"
          value="Not set"
        />
      </DashboardSection>

      <DashboardSection title="Workout History">
        <EmptyState
          icon="barbell-outline"
          title="No workouts tracked yet"
          description="Your completed workouts and activity history will appear here once workout tracking is connected."
        />
      </DashboardSection>
    </DashboardPage>
  );
}