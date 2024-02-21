import BusinessDashboard from "./views/BusinessDashboard";
import AddRequirement from "./views/AddRequirement";
import ApproveRequest from "./views/ApproveRequest";
import BusinessProfile from "./views/BusinessProfile";
// import viewRequest from "./views/viewRequest";
import updateBusiness from "./views/updateBusiness";
import Help from "./Help";

var routes = [
  {
    path: "/BusinessDashboard",
    name: "BusinessDashboard",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: BusinessDashboard,
    layout: "/Business",
  },
  {
    path: "/AddRequirement",
    name: "Add Requirement",
    rtlName: "الرموز",
    icon: "tim-icons icon-world",
    component: AddRequirement,
    layout: "/Business",
  },
  {
    path: "/BusinessProfile",
    name: "Business Profile",
    rtlName: "الرموز",
    icon: "tim-icons icon-single-02",
    component: BusinessProfile,
    layout: "/Business",
  },
  {
    path: "/ApproveRequest",
    name: "Crop Requirement",
    rtlName: "الرموز",
    icon: "tim-icons icon-badge",
    component: ApproveRequest,
    layout: "/Business",
  },
  // {
  //   path: "/viewRequests",
  //   name: "Requirements Sent",
  //   rtlName: "الرموز",
  //   icon: "tim-icons icon-image-02",
  //   component: viewImage,
  //   layout: "/Business",
  // },
  {
    path: "/Help",
    name: "Help",
    rtlName: "الرموز",
    icon: "tim-icons icon-image-02",
    component: Help,
    layout: "/Business",
  },
  {
    path: "/updateBusiness",
    name: "",
    rtlName: "الرموز",
    icon: "tim-icons",
    component: updateBusiness,
    layout: "/Business",
  },
];
export default routes;