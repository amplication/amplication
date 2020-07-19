import fetch from "node-fetch";

const HOST = "http://localhost:3000";

(async () => {
  const email = `${Math.random().toString()}@amplication.com`;
  // Create customer
  console.log("Creating customer...");
  let res = await fetch(`${HOST}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      lastName: "Hazaz",
      firstName: "Yuval",
    }),
  });
  if (res.status !== 201) {
    throw new Error(await res.text());
  }
  console.log("Created customer");

  console.log("Getting customers...");
  // Get customers
  res = await fetch(`${HOST}/customers`, {
    headers: {
      Accept: "application/json",
    },
  });
  if (res.status !== 200) {
    throw new Error(await res.text());
  }
  const customers = await res.json();
  if (customers.length === 0) {
    throw new Error("Did not receive customers");
  }
  console.log("Got customers");
  const [firstCustomer] = customers;

  console.log("Getting customer...");
  // Get customer
  res = await fetch(`${HOST}/customers/${firstCustomer.id}`, {
    headers: {
      Accept: "application/json",
    },
  });
  if (res.status !== 200) {
    throw new Error(await res.text());
  }
  console.log("Got customer");
})();
