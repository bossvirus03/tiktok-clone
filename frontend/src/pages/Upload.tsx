import { useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { CREATE_POST } from "../graphql/mutations/CreatePost";
import UploadError from "../components/UploadError";
import { FiUploadCloud } from "react-icons/fi";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { GiBoxCutter } from "react-icons/gi";

function Upload() {
  const fileRef = useRef(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileDisplay(URL.createObjectURL(e.target.files[0]));
      setFileData(e.target.files[0]);
    }
  };
  const [caption, setCaption] = useState<string>("");
  const [fileDisplay, setFileDisplay] = useState<string | undefined>(undefined);
  const [show, setShow] = useState(false);
  const [fileData, setFileData] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onError: (err) => {
      console.log(err);
      setErrors(err.graphQLErrors[0].extensions?.errors as string[]);
    },
    variables: {
      text: caption,
      video: fileData,
    },
  });

  const handleCreatePost = async () => {
    try {
      console.log("FILE DATA", fileData);
      setIsUploading(true);
      await createPost();
      setIsUploading(false);
      setShow(true);
      clearVideo();
    } catch (error) {
      console.log(error);
    }
  };
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    setErrorType(null);
    setFile(e.dataTransfer.files[0]);
    // setFileData(e.dataTransfer.files[0])

    const extension = e.dataTransfer.files[0].name.split(".").pop();
    if (extension !== "mp4") {
      setErrorType("file");
      return;
    }

    setFileDisplay(URL.createObjectURL(e.dataTransfer.files[0]));
    console.log(fileDisplay);
  };

  const discard = () => {
    setFile(null);
    setFileDisplay(undefined);
    setCaption("");
  };

  const clearVideo = () => {
    setFile(null);
    setFileDisplay(undefined);
  };

  useEffect(() => {
    console.log(caption.length);
    if (caption.length === 150) {
      setErrorType("caption");
      return;
    }

    setErrorType(null);
    console.log("caption", errorType);
  }, [errorType, caption]);
  return (
    <>
      <UploadError errorType={errorType} />
      <div className="w-full mt-[80px] bg-white shadow-lg rounded-md py-6 md:px-4">
        <div>
          <div className="text-[23px] font-semibold">Upload Video</div>
          <div className="text-gray-400 mt-1">Post a video to your account</div>
        </div>
      </div>
      <div className="mt-8 md:flex gap-6 justify-around">
        {!fileDisplay ? (
          <label
            className="md:mx-0 mx-auto mt-4 flex flex-col items-center justify-center w-full min-w-[260px] h-[470px] text-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer"
            htmlFor="fileInput"
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onDrop(e);
              console.log("drop");
            }}
          >
            <FiUploadCloud size={50} color="#b3b3b1" />
            <div className="mt-4 text-[17px]">Select a video to upload</div>
            <div className="mt-1.5 text-gray-500 text-[13px]">
              Or drag and drop a file
            </div>
            <div className="mt-12 text-gray-400 text-sm">MP4</div>
            <div className="mt-2 text-gray-400 text-sm">Up to 30 minutes</div>
            <div className="mt-2 text-gray-400 text-sm">Less than 2 GB</div>
            <div className="px-2 py-1.5 mt-8 text-white text-[15px] w-[80%] bg-[#f02c56] rounded-sm">
              Select File
            </div>
            <input
              type="file"
              ref={fileRef}
              id="fileInput"
              className="hidden"
              accept=".mp4"
              onChange={(e) => handleFileChange(e)}
            />
          </label>
        ) : (
          <>
            <div className="md:mx-0 mx-auto mt-4 md:mb-12 mb-6 flex flex-col items-center justify-center w-full max-w-[260px] h-[550px] text-center p-3 rounded-2xl cursor-pointer relative">
              <div className="bg-black h-full w-full" />
              <img
                src={"src/assets/images/mobile-case.png"}
                alt=""
                className="absolute pointer-events-none z-20"
              />
              <img
                src={"src/assets/images/tiktok-logo-white.png"}
                alt=""
                width={90}
                className="absolute right-4 bottom-6 z-20"
              />
              <video
                autoPlay
                loop
                muted
                src={fileDisplay}
                className="absolute rounded-xl object-cover z-10 p-[13px] w-full h-full"
              />
              <div className="absolute -bottom-12 flex items-center justify-between border-gray-300 w-full p-2 border rounded-xl z-50">
                <div className="flex justify-center items-center">
                  <IoCheckmarkDoneCircleOutline size={16} className="min-w-4" />
                  <div className="text-[11px] pl-1 truncate text-ellipsis">
                    {fileData?.name}
                  </div>
                </div>
                <button
                  onClick={clearVideo}
                  className="text-[11px] ml-4 font-semibold"
                >
                  Change
                </button>
              </div>
            </div>

            <div className="mt-4 mb-6">
              <div className="flex bg-[#f8f8f8] py-4 px-6 md:mt-[50px] mt-[70px]">
                <GiBoxCutter className="mr-4" size={20} />
                <div>
                  <div className="font-semibold text-[15px] mb-1.5">
                    Devide video and edit
                  </div>
                  <div className="font-semibold text-[13px] text-gray-400">
                    You can quickly devide videos into multiple clips and edit
                    them
                  </div>
                </div>
                <div className="flex justify-end max-w-[130px] w-full h-full text-center my-auto">
                  <button className="px-8 py-1.5 text-white text-[15px] bg-[#f02c56] rounded-sm">
                    Edit
                  </button>
                </div>
              </div>
              <div className="mt-5">
                <div className="mb-1 text-[15px] ">Caption</div>
                <div className="text-gray-400 text-[12px]">
                  {caption.length}
                </div>
              </div>
              <input
                type="text"
                onChange={(e) => setCaption(e.target.value)}
                maxLength={150}
                className="w-full border p-2.5 rounded-md focus:outline-none"
              />
              <div className="flex gap-3 justify-center md:justify-start pb-[70px] md:pb-0">
                <button
                  onClick={discard}
                  className="px-10 py-2.5 mt-8 border text-[16px] hover:bg-gray-100 rounded-sm"
                >
                  Discard
                </button>
                <button
                  onClick={handleCreatePost}
                  className="px-10 py-2.5 mt-8 border text-[16px] bg-[#f02c56] rounded-sm"
                >
                  Post
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Upload;
