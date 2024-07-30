const EventSkeleton = () => {
    return (
      <div className="card lg:card-side bg-base-100 shadow-xl p-2 animate-pulse">
        <figure className="w-72 h-72 bg-gray-300 rounded-lg"></figure>
        <div className="card-body flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-32 h-6 bg-gray-300 rounded"></div>
            <div className="w-48 h-4 bg-gray-300 rounded"></div>
            <div className="w-48 h-4 bg-gray-300 rounded"></div>
            <div className="w-48 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="card-actions justify-end mt-4">
            <div className="w-24 h-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  };
  
  export default EventSkeleton;
  

