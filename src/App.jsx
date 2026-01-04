import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Home";
import Missions from "./pages/Missions";
import Customer from "./pages/Customer";
import CustomerDetail from "./pages/CustomerDetails"; 
import OrdersPage from "./pages/Orders";
import CampañasPage from "./pages/campaña";



function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path= "/data/missions" element = {<Missions/>} />
        <Route path= "/data/customers" element = {<Customer/>} />
        <Route path= "/data/customers/detail/:id" element = {<CustomerDetail/>} />
        <Route path= "/orders" element = {<OrdersPage/>} />
        <Route path= "/data/campañas" element = {<CampañasPage/>} />
      </Route>
    </Routes>
  );
}

export default App;
