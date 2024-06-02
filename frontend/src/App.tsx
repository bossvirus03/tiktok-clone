import AuthModal from "./components/AuthModal";
import EditProfile from "./components/EditProfile";
import { useGeneralStore } from "./stores/generalStore";

function App() {
  const isLoginOpen = useGeneralStore((state) => state.isLoginOpen);
  const isEditProfileOpen = useGeneralStore((state) => state.isEditProfileOpen);
  console.log(isLoginOpen);
  return (
    <>
      <div className="h-full">
        {isEditProfileOpen && <EditProfile />}
        {isLoginOpen && <AuthModal />}
      </div>
    </>
  );
}

export default App;
