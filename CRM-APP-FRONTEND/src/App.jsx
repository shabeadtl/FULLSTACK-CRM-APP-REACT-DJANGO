import AppRoutes from "./routes/AppRoutes";
import { NotificationProvider } from "./context/NotificationContext";
import { LeadsProvider } from "./context/LeadsContext";
import { LeadActivitiesProvider } from "./context/LeadActivitiesContext";

const App = () => {
  return (
    <NotificationProvider>
      <LeadsProvider>
        <LeadActivitiesProvider>
          <AppRoutes />
        </LeadActivitiesProvider>
      </LeadsProvider>
    </NotificationProvider>
  );
};

export default App;

