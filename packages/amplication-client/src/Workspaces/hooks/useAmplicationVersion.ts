import React, { useEffect, useState } from "react";

export function useAmplicationVersion() {
  const [version, setVersion] = useState(null);

  useEffect(() => {
    if (!version) {
      fetch(
        "https://api.github.com/repos/amplication/amplication/releases/latest",
        {
          method: "GET",
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          if (typeof data !== "undefined" && data.name) {
            setVersion(data.name);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  return {
    version,
  };
}
