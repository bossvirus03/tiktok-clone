import AuthModal from "./components/AuthModal";
import { useGeneralStore } from "./stores/generalStore";

function App() {
  const isLoginOpen = useGeneralStore((state) => state.isLoginOpen);
  console.log(isLoginOpen);
  return (
    <>
      <div className="h-full">{isLoginOpen && <AuthModal />}</div>
    </>
  );
}

export default App;
