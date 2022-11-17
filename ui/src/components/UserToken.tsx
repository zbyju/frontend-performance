import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Props {
  onReceive?: (_: string) => any;
}

export default function UserTokenDisplay({ onReceive }: Props) {
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

  useEffect(() => {
    onReceive && onReceive(userToken);
  }, [userToken]);
  return <>User: {userToken || "No user token"}</>;
}
