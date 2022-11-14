import { useEffect, useState } from "react";

export default function UserTokenDisplay() {
  const [userToken, setUserToken] = useState("");
  useEffect(() => {
    setUserToken(window.localStorage.getItem("userToken"));
  });
  return <>User: {userToken || "No user token"}</>;
}
