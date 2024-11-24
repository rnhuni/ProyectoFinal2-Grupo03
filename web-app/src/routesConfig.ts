import React from "react";
import {
  BarChartLine,
  CalendarEvent,
  CashStack,
  People,
  ListCheck,
  TicketDetailed,
  Receipt,
  PersonBadge,
  Person,
} from "react-bootstrap-icons";
import ReportIframe from "./components/Reports/ReportIframe";
import Users from "./pages/Users";
import Incidents from "./pages/Incidents";
import Plans from "./pages/Plans";
import Roles from "./pages/Roles";
import Permissions from "./pages/Permissions";
import SubscriptionPage from "./pages/SuscriptionPage";
import SubscriptionsBase from "./pages/SubscriptionsBase";
import SuscriptionSummary from "./pages/SuscriptionSummary";

// Define el tipo de los elementos de configuración de rutas
interface RouteConfig {
  name: string;
  path: string;
  component: React.FC; // Componente React asociado a la ruta
  roles: string[];
  icon: JSX.Element; // El ícono como componente React
}

export const routesConfig: RouteConfig[] = [
  {
    name: "Resumen",
    path: "/dashboard/summary",
    component: ReportIframe,
    roles: ["admin", "agent"],
    icon: React.createElement(BarChartLine), // Ícono como componente JSX
  },
  {
    name: "Usuario",
    path: "/dashboard/users",
    component: Users,
    roles: ["admin", "agent"],
    icon: React.createElement(Person),
  },
  {
    name: "Incidentes",
    path: "/dashboard/incidents",
    component: Incidents,
    roles: ["admin", "agent", "user"],
    icon: React.createElement(CalendarEvent),
  },
  {
    name: "Planes",
    path: "/dashboard/plans",
    component: Plans,
    roles: ["admin"],
    icon: React.createElement(CashStack),
  },
  {
    name: "Roles",
    path: "/dashboard/roles",
    component: Roles,
    roles: ["admin"],
    icon: React.createElement(People),
  },
  {
    name: "Permisos",
    path: "/dashboard/permissions",
    component: Permissions,
    roles: ["admin"],
    icon: React.createElement(ListCheck),
  },
  {
    name: "Mi suscripción",
    path: "/dashboard/user-plan",
    component: SubscriptionPage,
    roles: ["agent", "user", "client"],
    icon: React.createElement(Receipt),
  },
  {
    name: "Suscripciones",
    path: "/dashboard/suscriptions",
    component: SubscriptionsBase,
    roles: ["admin", "user", "client"],
    icon: React.createElement(TicketDetailed),
  },
  {
    name: "Manejar planes",
    path: "/dashboard/manage-plan",
    component: SuscriptionSummary,
    roles: ["admin", "agent", "client"],
    icon: React.createElement(PersonBadge),
  },
];
