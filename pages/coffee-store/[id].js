import { useRouter } from "next/router";
import React from "react";

const CoffeeStore = () => {
  const router = useRouter();
  console.log("router", router);
  return (
    <div>
      <h2>Coffee Store</h2>
    </div>
  );
};

export default CoffeeStore;
