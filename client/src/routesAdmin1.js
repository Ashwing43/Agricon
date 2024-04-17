import Admin1Dashboard from "./views/Admin1Dashboard";
// import ApproveContract from "./views/ApproveContract";
import BusinessInfo from "./views/BusinessInfo";
import FarmerInfo from "./views/FarmerInfo";
import ContractInfo from "./views/ContractInfo";

var routes = [
  {
    path: "/Admin1Dashboard",
    name: "Admin Dashboard",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: Admin1Dashboard,
    layout: "/Admin1",
  },

  {
    path: "/BusinessInfo",
    name: "Business Info",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-single-02",
    component: BusinessInfo,
    layout: "/Admin1",
  },
  {
    path: "/FarmerInfo",
    name: "Farmer Info",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-single-02",
    component: FarmerInfo,
    layout: "/Admin1",
  },
  {
    path: "/ContractInfo",
    name: "Contracts Info",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-send",
    component: ContractInfo,
    layout: "/Admin1",
  },
];
export default routes;