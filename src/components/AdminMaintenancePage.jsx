import { Typography } from '@mui/material';
import AdminMaintenancePanel from './pageComponents/AdminMaintenancePanel';
import Header from './pageComponents/Header';
import Footer from './pageComponents/Footer';

const AdminMaintenancePage = () => {
  return (
    <>
      <Header />
      <Typography variant="h4" gutterBottom sx={{ mt: 2, ml: 2 }}>
        Admin Maintenance Management
      </Typography>
      <AdminMaintenancePanel />
      <Footer />
    </>
  );
};

export default AdminMaintenancePage;
