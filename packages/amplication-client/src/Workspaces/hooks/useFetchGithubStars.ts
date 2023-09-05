import React, { useEffect, useState } from "react";

const AMP_GITHUB_API_URL =
  "https://api.github.com/repos/amplication/amplication";

const useFetchGithubStars = () => {
  const [stars, setStars] = useState<string | number>();

  const formatNumWithSuffix = (num: number) => {
    const absNum = Math.abs(num);
    const thousandToDecimal = absNum / 1000;
    return absNum > 999 ? `${thousandToDecimal.toFixed(1)}k` : absNum;
  };

  useEffect(() => {
    async function fetchGithubStars() {
      const response = await fetch(AMP_GITHUB_API_URL);
      const data = await response.json();
      const num = formatNumWithSuffix(data.stargazers_count);
      setStars(num);
    }

    fetchGithubStars();
  }, []);

  return stars;
};

export default useFetchGithubStars;
