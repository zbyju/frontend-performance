import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { userToken } from "../stores/token";

export default function UserTokenDisplay() {
  const $userToken = useStore(userToken);
  useEffect(() => {
    const token = window.localStorage.getItem("userToken");
    if (!token) {
      const newToken = uuidv4();
      userToken.set(newToken);
      window.localStorage.setItem("userToken", newToken);
    } else {
      userToken.set(token);
    }
  }, []);

  return <>User: {$userToken || "No user token"}</>;
}
