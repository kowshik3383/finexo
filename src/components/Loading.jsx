
const Loading = () => {
  return (
    <section className="font-poppins">
      <style>{`
        .ctn-preloader {
          align-items: center;
          display: flex;
          height: 100%;
          justify-content: center;
          position: fixed;
          left: 0;
          top: 0;
          width: 100%;
          z-index: 999999;
  
        }
        .ctn-preloader .animation-preloader {
          position: absolute;
          z-index: 100;
          text-align: center;
        }
        .ctn-preloader .animation-preloader .icon {
          display: inline-block;
          position: relative;
        }
        .ctn-preloader .animation-preloader .txt-loading {
          user-select: none;
        }
        .ctn-preloader .animation-preloader .txt-loading .letters-loading:before {
          animation: letters-loading 4s infinite;
          color: white;
          content: attr(data-text-preloader);
          left: 0;
          opacity: 0;
          top: 0;
          position: absolute;
          font-size: 70px; /* Increased size */
          font-weight: bold; /* Added bold */
        }
        .ctn-preloader .animation-preloader .txt-loading .letters-loading {
          font-family: 'Arial', sans-serif;
          letter-spacing: 20px;
          display: inline-block;
          color:black;
          position: relative;
          font-size: 70px; /* Increased size */
          line-height: 70px; /* Match font size */
          font-weight: bold; /* Added bold */
        }
        .ctn-preloader .animation-preloader .txt-loading .letters-loading:nth-child(2):before {
          animation-delay: 0.2s;
        }
        .ctn-preloader .animation-preloader .txt-loading .letters-loading:nth-child(3):before {
          animation-delay: 0.4s;
        }
        .ctn-preloader .animation-preloader .txt-loading .letters-loading:nth-child(4):before {
          animation-delay: 0.6s;
        }
        .ctn-preloader .animation-preloader .txt-loading .letters-loading:nth-child(5):before {
          animation-delay: 0.8s;
        }
        .loaded .animation-preloader {
          opacity: 0;
          transition: 0.3s ease-out;
        }
        @keyframes spinner {
          to {
            transform: rotateZ(360deg);
          }
        }
        @keyframes letters-loading {
          0%, 75%, 100% {
            opacity: 0;
            transform: rotateY(-90deg);
          }
          25%, 50% {
            opacity: 1;
            transform: rotateY(0deg);
          }
        }
        @media screen and (max-width: 500px) {
          .ctn-preloader .animation-preloader .txt-loading .letters-loading {
            font-size: 50px;
            letter-spacing: 15px;
          }
        }
      `}</style>
      <div id="preloader">
        <div id="ctn-preloader" className="ctn-preloader">
          <div className="animation-preloader">
            <div className="icon">
           <img src="https://finexo.in/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Ftb3xbyw3%2Fproduction%2Ff1ae2cc3f9fcdcb2fc581ec6960b60c656fb7a70-700x150.png%3Fw%3D700%26auto%3Dformat&w=640&q=75" alt="" />
            </div>
   
            <div className="txt-loading mt-2">
              {["F", "I","N", "E", "X", "O"].map((letter, index) => (
                <span
                  key={index}
                  data-text-preloader={letter}
                  className="letters-loading"
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Loading;
