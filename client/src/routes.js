// import businessProfile from "./views/businessProfile";
import Dashboard from "./views/Dashboard";
// import viewRequests from "./views/viewRequests";
// import MakePayment from "./views/MakePayment";
// import updatebusiness from "./views/updatebusiness";
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
  // {
  //   path: "/businessProfile",
  //   name: "Business Profile",
  //   rtlName: "الرموز",
  //   icon: "tim-icons icon-single-02",
  //   component: businessProfile,
  //   layout: "/admin",
  // },
  // {
  //   path: "/viewRequests",
  //   name: "View Requests",
  //   rtlName: "الرموز",
  //   icon: "tim-icons icon-Requests-02",
  //   component: viewRequests,
  //   layout: "/admin",
  // },

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
  // {
  //   path: "/updatebusiness",
  //   name: "",
  //   rtlName: "الرموز",
  //   icon: "tim-icons",
  //   component: updatebusiness,
  //   layout: "/admin",
  // },
];
export default routes;