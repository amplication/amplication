import * as React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Title } from "react-admin";
const Dashboard = () => (
  <Card>
    <Title title="Welcome to the administration" />
    <CardContent>Welcome</CardContent>
  </Card>
);

export default Dashboard;
