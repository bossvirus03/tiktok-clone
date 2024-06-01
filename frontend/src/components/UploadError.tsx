import { useEffect, useState } from "react";

function UploadError({ errorType }: { errorType: string | null }) {
  const [error, setError] = useState("");
  useEffect(() => {
    switch (errorType) {
      case "caption":
        setError("Max to 150 characters");
        break;
      case "bio":
        setError("Max to 80 characters");
        break;
      case "file":
        setError("Only mp4 files are allowed");
        break;
      default:
        setError("");
        break;
    }
  }, [error, errorType]);
  return (
    <>
      <div className="w-full relative flex justify-center">
        <div
          className={[
            "absolute top-6 z-50 mx-auto bg-black text-white bg-opacity-70 px-14 py-3",
            errorType ? "visible" : "invisible",
          ].join(" ")}
        >
          {error}
        </div>
      </div>
    </>
  );
}

export default UploadError;
