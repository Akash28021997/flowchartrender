import { useEffect, useState, useRef } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowUp,
  faLongArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import curvy_arrow from "./curvy_arrow_image.png";

function App() {
  const [inputString, setInputString] = useState("");
  const [outputStrings, setOutputStrings] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState();
  const [longarrow, setLongarrow] = useState(false);
  const [arrow, setArrow] = useState(false);
  const [refNum, setRefNum] = useState("100");

  const [imageRendered, setImageRendered] = useState(false);

  const handleSubmit = async () => {
    setError("");
    console.log("hii");
    try {
      const response = await fetch(
        `http://localhost:5001?currentPage=${currentPage}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputString: inputString, refNum: refNum }),
        }
      );

      // Check if the response status is not OK (i.e., status is not in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      if (result.message) setError(result.message);
      else setOutputStrings(result);
    } catch (error) {
      // Handle both network and HTTP errors
      console.error("Fetch error: ", error);
      //console.log("error", error.error.error);
      // Optionally set an error state to display an error message in your UI
      setError(error.error);
    }
  };

  useEffect(() => {
    if (inputString != "") handleSubmit();

    //

    if (outputStrings) {
      const shouldRenderImage = outputStrings.outputString.some(
        (string) => string.length === 1 || string === "Start"
      );
      if (shouldRenderImage) {
        setImageRendered(true);
      }
    }
  }, [currentPage, imageRendered, outputStrings]);

  let imageRenderedFlag = false;

  const divRef = useRef();

  const downloadDiv = () => {
    if (divRef.current === null) {
      return;
    }

    toPng(divRef.current, { backgroundColor: "#ffffff" })
      .then((dataUrl) => {
        download(dataUrl, "div-image.png");
      })
      .catch((error) => {
        console.error("oops, something went wrong!", error);
      });
  };
  return (
    <div className="App min-h-screen flex justify-center items-center bg-gray-100">
      <div className="flex flex-row w-full max-w-6xl space-x-4 p-4 bg-white shadow-md rounded-lg">
        <div className="card w-1/3 flex flex-col space-y-6 p-6 bg-gray-50 rounded-md shadow">
          <div>
            <textarea
              type="text"
              placeholder="Input field for method process"
              onChange={(e) => setInputString(e.target.value)}
              className=" w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 font-times new roman text-12px "
              style={{ height: "425px" }}
            />
          </div>
          <div>
            <label for="refNo">Enter Method Reference No.: </label>
            <input
              id="refNo"
              class="w-15 font-times new roman text-12px"
              type="text"
              placeholder="Eg.: 100, 200, 300..."
              onChange={(e) => setRefNum(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center h-full">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              Submit
            </button>
          </div>
        </div>
        <div className="card w-2/3 flex flex-col space-y-8 p-6 bg-gray-50 rounded-md shadow items-center ">
          <div
            ref={divRef}
            style={{ backgroundColor: "#ffffff", padding: "20px" }}
          >
            {error ? (
              <div className="outputTextBox p-4 border border-gray-300 rounded-md bg-gray-50 w-full font-times new roman text-12px ">
                {error}
              </div>
            ) : (
              outputStrings?.outputString.map((string, index) => (
                <div key={index} className="flex flex-col items-center ml-12">
                  {!imageRenderedFlag &&
                    imageRendered &&
                    (string.length === 1 || string === "Start") && (
                      <div
                        style={{
                          display: "inline-block",
                          position: "relative",
                        }}
                      >
                        <img
                          src={curvy_arrow}
                          alt="Arrow"
                          style={{
                            transform:
                              "rotate(-35deg) translateX(85px) translateY(85px)",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "20%",
                            left: "275%",
                            transform: "translateY(-50%) translateX(10px)",
                          }}
                        >
                          {refNum}
                        </div>
                      </div>
                    )}
                  {!imageRenderedFlag &&
                    imageRendered &&
                    (string.length === 1 || string === "Start") &&
                    (imageRenderedFlag = true)}

                  {string.length == 1 ||
                  string == "Start" ||
                  string == "End" ? (
                    <div class="pr-8 mr-6 bg-white text-black font-times new roman text-12px flex items-center justify-center">
                      <div class="w-12 h-12 border border-black rounded-full flex items-center justify-center">
                        {string}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center w-full break-words whitespace-pre-wrap text-center">
                      <div className=" outputTextBox p-4 border border-black bg-white w-full font-times new roman text-12px flex justify-center">
                        {string}
                      </div>
                      <div>
                        {outputStrings.outputString.length !== index && (
                          <div className="flex flex-col ">
                            <div className="ml-2">
                              <div>
                                <input
                                  class="w-10 font-times new roman text-12px"
                                  type="text"
                                  placeholder={outputStrings.ref_dict[string]}
                                ></input>
                              </div>
                              <div>
                                <FontAwesomeIcon
                                  icon={faLongArrowUp}
                                  style={{
                                    transform:
                                      "rotate(230deg) translateX(10px) translateY(-10px)",
                                    fontSize: "20px",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {outputStrings.outputString.length - 1 !== index && (
                    <div className="pr-8 mr-6">
                      <FontAwesomeIcon
                        icon={faLongArrowDown}
                        style={{ fontSize: "24px" }}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {!error && (
            <div>
              {Number(outputStrings?.totalPages) > 1 && (
                <div className="flex flex-row gap-5">
                  {currentPage != 1 && (
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Prev
                    </button>
                  )}
                  {currentPage !== 1 && (
                    <>
                      <span>
                        <button
                          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-blue-300"
                          onClick={() => setCurrentPage(1)}
                        >
                          {1}
                        </button>
                      </span>
                      <span className="mx-1">...</span>
                    </>
                  )}
                  {Array.from(
                    { length: Number(outputStrings.totalPages) },
                    (_, index) => index
                  )
                    .slice(
                      Number(currentPage),
                      Math.min(
                        Number(currentPage) + 5,
                        Number(outputStrings.totalPages)
                      )
                    )
                    .map((pageNumber) => (
                      <span key={pageNumber}>
                        <button
                          className={`px-3 py-1 ${
                            pageNumber === currentPage
                              ? "bg-blue-500 text-white"
                              : "bg-white border border-gray-300 hover:bg-blue-300"
                          } rounded`}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      </span>
                    ))}
                  {currentPage !== outputStrings.totalPages + 1 && (
                    <>
                      <span className="mx-1">...</span>
                      <span>
                        <button
                          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-blue-300"
                          onClick={() =>
                            setCurrentPage(outputStrings.totalPages)
                          }
                        >
                          {outputStrings.totalPages}
                        </button>
                      </span>
                    </>
                  )}
                  {currentPage != outputStrings.totalPages && (
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <div>
            <button
              className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-600"
              onClick={downloadDiv}
            >
              Download as Image
            </button>
            {longarrow && <FontAwesomeIcon icon={faLongArrowDown} />}
            {arrow && <FontAwesomeIcon icon={faLongArrowUp} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
