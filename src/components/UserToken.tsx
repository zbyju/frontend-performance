import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function UserTokenDisplay() {
  const [userToken, setUserToken] = useState("");
  useEffect(() => {
    const token = window.localStorage.getItem("userToken");
    if (!token) {
      const newToken = uuidv4();
      setUserToken(newToken);
      window.localStorage.setItem("userToken", newToken);
    } else {
      setUserToken(token);
    }
  }, []);
  return <>User: {userToken || "No user token"}</>;
}
