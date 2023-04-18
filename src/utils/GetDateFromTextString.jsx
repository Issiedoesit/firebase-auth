import React from 'react'

const getDateFromTextString = (date) => {
    // date input format is Mon, 17 Apr 2023 18:28:32 GMT
    const dateStr = date;
    const dateObj = new Date(dateStr);
    const dateNum = dateObj.getDate()
    const day = dateObj.getDay() + 1
    const dayText = dateObj.toLocaleString("default", { weekday: "long" })
    const month = dateObj.getMonth() + 1
    const monthText = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();

    return {day, dateNum, dayText, month, monthText, year}
}

export default getDateFromTextString