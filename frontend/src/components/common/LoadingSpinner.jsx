const LoadingSpinner = ({ size = "md" }) => {
	const sizeMap = {
	  xs: "w-4 h-4",
	  sm: "w-6 h-6",
	  md: "w-8 h-8",
	  lg: "w-12 h-12",
	  xl: "w-16 h-16",
	};
  
	return <span className={`loading loading-spinner ${sizeMap[size]}`} />;
  };
  export default LoadingSpinner;