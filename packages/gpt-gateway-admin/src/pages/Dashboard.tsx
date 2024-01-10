import * as React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Title } from "react-admin";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [token, setToken] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("credentials")?.split(" ")[1];
    if (token) {
      setToken(token);
    }
  }, [setToken]);
  return (
    <Card>
      <Title title="Welcome to the administration" />
      <CardContent>Welcome</CardContent>
      <CardContent>
        <small>{token}</small>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
