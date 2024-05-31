import { ReactNode, useEffect } from "react";
import { useUserStore } from "../stores/userStore";
import { useNavigate } from "react-router-dom";
import { useGeneralStore } from "../stores/generalStore";

function ProtectedRoutes({ children }: { children: ReactNode }) {
  const user = useUserStore((state) => state);
  const navigate = useNavigate();
  const setLoginIsOpen = useGeneralStore((state) => state.setLoginIsOpen);
  useEffect(() => {
    if (!user.id) {
      navigate("/");
      setLoginIsOpen(true);
    }
  }, [user, navigate, setLoginIsOpen]);
  if (!user) {
    return <> No Access</>;
  }
  return <>{children}</>;
}

export default ProtectedRoutes;
