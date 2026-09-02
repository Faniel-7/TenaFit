import React from "react";
import DashboardPage, {
  DashboardCard,
  DashboardSection,
} from "../../components/dashboard/DashboardPage";

export default function PlanScreen() {
  return (
    <DashboardPage
      title="Your Plan"
      subtitle="Your personalized plan for today."
      icon="calendar-outline"
    >
      <DashboardSection
        title="Today's Plan"
        subtitle="Your daily activities will appear here."
      >
        <DashboardCard
          icon="restaurant-outline"
          title="Meals"
          description="Your personalized meal plan"
          value="Coming soon"
        />

        <DashboardCard
          icon="barbell-outline"
          title="Workout"
          description="Your planned activity for today"
          value="Coming soon"
        />

        <DashboardCard
          icon="water-outline"
          title="Water"
          description="Your daily hydration target"
          value="Coming soon"
        />
      </DashboardSection>

      <DashboardSection
        title="Daily Checklist"
        subtitle="Complete your plan throughout the day."
      >
        <DashboardCard
          icon="checkmark-circle-outline"
          title="Complete your meals"
        />

        <DashboardCard
          icon="checkmark-circle-outline"
          title="Reach your water goal"
        />

        <DashboardCard
          icon="checkmark-circle-outline"
          title="Complete your workout"
        />
      </DashboardSection>
    </DashboardPage>
  );
}