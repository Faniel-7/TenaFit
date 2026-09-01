import React from "react";
import DashboardPage, {
  DashboardCard,
  DashboardSection,
  EmptyState,
} from "../../components/dashboard/DashboardPage";

export default function MealsScreen() {
  return (
    <DashboardPage
      title="Meals"
      subtitle="Manage and track what you eat."
      icon="restaurant-outline"
    >
      <DashboardSection
        title="Today's Meals"
        subtitle="Your recommended meals will appear here."
      >
        <DashboardCard
          icon="sunny-outline"
          title="Breakfast"
          description="Morning meal"
          value="Not added"
        />

        <DashboardCard
          icon="restaurant-outline"
          title="Lunch"
          description="Midday meal"
          value="Not added"
        />

        <DashboardCard
          icon="moon-outline"
          title="Dinner"
          description="Evening meal"
          value="Not added"
        />

        <DashboardCard
          icon="nutrition-outline"
          title="Snacks"
          description="Snacks throughout the day"
          value="Not added"
        />
      </DashboardSection>

      <DashboardSection title="Food Database">
        <EmptyState
          icon="search-outline"
          title="Food database connection comes next"
          description="Your Ethiopian and international food data will be connected to this screen when we reach the Food Database step."
        />
      </DashboardSection>
    </DashboardPage>
  );
}