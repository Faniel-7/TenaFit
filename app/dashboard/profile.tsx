import React from "react";
import DashboardPage, {
  DashboardCard,
  DashboardSection,
  EmptyState,
} from "../../components/dashboard/DashboardPage";

export default function ProfileScreen() {
  return (
    <DashboardPage
      title="Profile"
      subtitle="Your personal TenaFit information."
      icon="person-circle-outline"
    >
      <DashboardSection
        title="Personal Information"
        subtitle="Your onboarding information will be displayed here."
      >
        <DashboardCard
          icon="person-outline"
          title="Personal Details"
          description="Name, username, and email"
          value="View"
        />

        <DashboardCard
          icon="calendar-outline"
          title="Age"
          description="Your age"
          value="Saved"
        />

        <DashboardCard
          icon="male-female-outline"
          title="Gender"
          description="Your selected gender"
          value="Saved"
        />
      </DashboardSection>

      <DashboardSection title="Physical Information">
        <DashboardCard
          icon="resize-outline"
          title="Height"
          description="Your height"
          value="Saved"
        />

        <DashboardCard
          icon="scale-outline"
          title="Weight"
          description="Your current weight"
          value="Saved"
        />
      </DashboardSection>

      <DashboardSection title="Goals & Preferences">
        <DashboardCard
          icon="flag-outline"
          title="Goal"
          description="Your weight goal"
          value="Saved"
        />

        <DashboardCard
          icon="fitness-outline"
          title="Activity Level"
          description="Your activity level"
          value="Saved"
        />

        <DashboardCard
          icon="restaurant-outline"
          title="Food Preference"
          description="Local, other, or mixed foods"
          value="Saved"
        />
      </DashboardSection>

      <DashboardSection title="Profile Data">
        <EmptyState
          icon="person-outline"
          title="Profile connection"
          description="The profile screen will be connected directly to the saved UserProfile when we complete the onboarding-data stage."
        />
      </DashboardSection>
    </DashboardPage>
  );
}