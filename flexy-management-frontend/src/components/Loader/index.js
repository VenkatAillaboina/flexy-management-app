import ClipLoader from "react-spinners/ClipLoader";
import './index.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <ClipLoader
        color={"#007bff"}
        loading={true}
        size={80}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;