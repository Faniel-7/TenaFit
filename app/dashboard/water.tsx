import React from "react";
import DashboardPage, {
  DashboardCard,
  DashboardSection,
  EmptyState,
} from "../../components/dashboard/DashboardPage";

export default function WaterScreen() {
  return (
    <DashboardPage
      title="Water"
      subtitle="Stay hydrated throughout the day."
      icon="water-outline"
    >
      <DashboardSection
        title="Today's Hydration"
        subtitle="Your hydration target will be calculated later."
      >
        <DashboardCard
          icon="water-outline"
          title="Daily Water Goal"
          description="Recommended daily intake"
          value="Not calculated"
        />

        <DashboardCard
          icon="add-circle-outline"
          title="Water Intake"
          description="Track the water you drink"
          value="0"
        />
      </DashboardSection>

      <DashboardSection title="Hydration History">
        <EmptyState
          icon="water-outline"
          title="No hydration history yet"
          description="Your daily water intake and hydration consistency will appear here after tracking is connected."
        />
      </DashboardSection>
    </DashboardPage>
  );
}