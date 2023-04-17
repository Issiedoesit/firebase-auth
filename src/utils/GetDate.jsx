const timeSince = (date) =>  {
    const seconds = Math.floor((new Date() - date.toDate()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return formatTime(interval, "year", seconds % 31536000);
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return formatTime(interval, "month", seconds % 2592000);
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return formatTime(interval, "day", seconds % 86400);
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return formatTime(interval, "hr", seconds % 3600);
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return formatTime(interval, "min", seconds % 60);
    }
    
    return "just now";
  }
  
  const formatTime = (interval, unit, remainder) => {
    let timeString = "";
    if (interval > 1) {
      timeString = `${interval} ${unit}s`;
    } else {
      timeString = `${interval} ${unit}`;
    }
    
    if (remainder >= 60) {
      const hours = Math.floor(remainder / 3600);
      remainder %= 3600;
      if (hours > 0) {
        if (hours > 1) {
          timeString += `, ${hours} hrs`;
        } else {
          timeString += `, ${hours} hr`;
        }
      }
    }
    
    if (remainder >= 60) {
      const minutes = Math.floor(remainder / 60);
      if (minutes > 0) {
        if (minutes > 1) {
          timeString += `, ${minutes} mins`;
        } else {
          timeString += `, ${minutes} min`;
        }
      }
    }
    
    return timeString + " ago";
  }
  
  export default timeSince;
  