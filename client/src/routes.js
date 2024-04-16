import farmerProfile from "./views/farmerProfile";
import Dashboard from "./views/Dashboard";
import ViewContractsFarmer from "./views/ViewContractsFarmer";
// import MakePayment from "./views/MakePayment";
import updateFarmer from "./views/updateFarmer";
import Help from "./Help";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
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
    path: "/ViewContractsFarmer",
    name: "View Contracts",
    rtlName: "الرموز",
    icon: "tim-icons icon-Requests-02",
    component: ViewContractsFarmer,
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
    name: "",
    rtlName: "الرموز",
    icon: "tim-icons",
    component: updateFarmer,
    layout: "/admin",
  },
];
export default routes;