import farmerProfile from "./views/farmerProfile";
import Dashboard from "./views/Dashboard";
import ContractInfoFarmer from "./views/ContractInfoFarmer";
// import MakePayment from "./views/MakePayment";
import updateFarmer from "./views/updateFarmer";
import Help from "./Help";

var routes = [
  {
    path: "/dashboard",
    name: "Farmer Dashboard",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/farmerProfile",
    name: "Farmer Profile",
    rtlName: "الرموز",
    icon: "tim-icons icon-single-02",
    component: farmerProfile,
    layout: "/admin",
  },
  {
    path: "/ContractInfoFarmer",
    name: "Contracts Info",
    rtlName: "الرموز",
    icon: "tim-icons icon-Requests-02",
    component: ContractInfoFarmer,
    layout: "/admin",
  },

  // {
  //   path: "/MakePayment",
  //   name: "Make Payment",
  //   rtlName: "الرموز",
  //   icon: "tim-icons icon-money-coins",
  //   component: MakePayment,
  //   layout: "/admin",
  // },
  {
    path: "/Help",
    name: "Help",
    rtlName: "الرموز",
    icon: "tim-icons icon-single-02",
    component: Help,
    layout: "/admin",
  },
  {
    path: "/updateFarmer",
    name: "Update Farmer",
    rtlName: "الرموز",
    icon: "tim-icons",
    component: updateFarmer,
    layout: "/admin",
  },
];
export default routes;