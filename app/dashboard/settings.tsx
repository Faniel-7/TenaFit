import React from "react";
import DashboardPage, {
  DashboardCard,
  DashboardSection,
} from "../../components/dashboard/DashboardPage";

export default function SettingsScreen() {
  return (
    <DashboardPage
      title="Settings"
      subtitle="Manage your TenaFit experience."
      icon="settings-outline"
    >
      <DashboardSection title="Preferences">
        <DashboardCard
          icon="moon-outline"
          title="Appearance"
          description="Manage light and dark mode"
          value="Dark"
        />

        <DashboardCard
          icon="language-outline"
          title="Language"
          description="Choose your preferred language"
          value="English"
        />

        <DashboardCard
          icon="notifications-outline"
          title="Notifications"
          description="Manage reminders and notifications"
        />
      </DashboardSection>

      <DashboardSection title="Account">
        <DashboardCard
          icon="person-outline"
          title="Profile"
          description="Manage your personal information"
        />

        <DashboardCard
          icon="shield-checkmark-outline"
          title="Privacy"
          description="Manage your privacy preferences"
        />
      </DashboardSection>

      <DashboardSection title="Premium">
        <DashboardCard
          icon="diamond-outline"
          title="TenaFit Premium"
          description="Manage your premium features"
          value="Free"
        />
      </DashboardSection>
    </DashboardPage>
  );
}