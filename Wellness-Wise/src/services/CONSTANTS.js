const dateToString = (currentDate) =>{
    // Extract date components
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
    const day = currentDate.getDate();
    // Format month and day with leading zeros if needed
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    
    // Construct the current date string in YYYY-MM-DD format
    const currentDateStr = `${year}-${formattedMonth}-${formattedDay}`;
    
    return currentDateStr;
};


const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };


export{
    formatTime,
    dateToString
};
