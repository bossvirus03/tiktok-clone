import { useMutation } from "@apollo/client";
import { useGeneralStore } from "../stores/generalStore";
import tiktokLogo from "./../assets/images/tiktok-logo.png";
import { LOGOUT_USER } from "../graphql/mutations/Logout";
import { useUserStore } from "../stores/userStore";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineFileSearch,
  AiOutlineSearch,
  AiOutlineUpload,
} from "react-icons/ai";
import { BsFillPersonFill, BsFillSendFill } from "react-icons/bs";
import { BiMessageDetail } from "react-icons/bi";
import { GrLogout } from "react-icons/gr";
function TopNav() {
  const isLoginOpen = useGeneralStore((state) => state.isLoginOpen);
  const setIsLoginOpen = useGeneralStore((state) => state.setLoginIsOpen);
  const [logoutUser] = useMutation(LOGOUT_USER);
  const user = useUserStore((state) => state);
  const setUser = useUserStore((state) => state.setUser);

  console.log(isLoginOpen);
  const getURL = () => {
    return window.location.pathname;
  };
  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser({
        id: undefined,
        email: "",
        fullname: "",
        image: "",
        bio: "",
      });
      setIsLoginOpen(true);
    } catch (error) {
      console.log(error);
    }
  };
  const [showMenu, setShowMenu] = useState(false);
  return (
    <>
      <div
        id="TopNav"
        className="bg-white fixed z-30 flex items-center w-full border-b h-[61px]"
      >
        <div
          className={[
            getURL() === "/" ? "max-w-[1150px]" : "",
            "flex items-center justify-between w-full px-6 mx-auto",
          ].join(" ")}
        >
          <div
            className={[
              getURL() === "/" ? "w-[80%]" : "lg:w-[20%] w-[70%]",
            ].join(" ")}
          >
            <Link to="/">
              <img src={tiktokLogo} width={100} height={100} alt="logo" />
            </Link>
          </div>
          <div className="hidden md:flex items-center bg-[#F1F1F1] p-1 rounded-full max-w-[380px] w-full">
            <input
              type="text"
              className="w-full pl-3 my-2 bg-transparent placeholder-[#838383] text-[15px] focus:outline-none"
            />
            <div className="px-3 py-1 flex items-center border-l border-l-gray-300">
              <AiOutlineSearch size={20} color="#838383" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 min-w-[275px] max-w-[320px] w-full">
            {location.pathname === "/" ? (
              <Link
                to={"/upload"}
                className="flex items-center border rounded-sm px-3 py-[6px]"
              >
                <AiOutlineUpload size={20} color="#161725" />{" "}
                <span className="px-2 font-medium text-[15px] text-[#161724]">
                  Upload
                </span>
              </Link>
            ) : (
              <Link
                to={"/upload"}
                className="flex items-center border rounded-sm px-3 py-[6px]"
              >
                <AiOutlineFileSearch size={20} color="#161725" />{" "}
                <span className="px-2 font-medium text-[15px] text-[#161724]">
                  Feed
                </span>
              </Link>
            )}
            {!user.id && (
              <div className="fex items-center">
                <button
                  className="flex items-center justify-center bg-[#f02C56] text-white border rounded-md py-[6px] min-w-[110px]"
                  onClick={() => setIsLoginOpen(!isLoginOpen)}
                >
                  <span className="mx-4 font-medium text-[15px]">Sign In</span>
                </button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <BsFillSendFill size={20} color="#161725" />
              <BiMessageDetail size={20} color="#161725" />
              <div className="relative">
                <button
                  className="mt-1"
                  onClick={() => {
                    setShowMenu(!showMenu);
                  }}
                >
                  <img
                    className="rounded-full"
                    width={33}
                    src={
                      !user.image
                        ? "https://picsum.photos/id/83/300/320"
                        : user.image
                    }
                    alt="mini-avatar"
                  />
                </button>
                <div
                  id="PopupMenu"
                  className="absolute bg-white rounded-lg py-1.5 w-[200px] shadow-xl border top-[43px] -right-2"
                >
                  <Link
                    to={`/profile/${user.id}`}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 "
                  >
                    <BsFillPersonFill size={20} color="#161725" />
                    <span className="font-semibold text-sm">Profile</span>
                  </Link>
                  {user.id && (
                    <div
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                    >
                      <GrLogout size={20} color="#161725" />
                      <span className="font-semibold text-sm">Log out</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TopNav;
