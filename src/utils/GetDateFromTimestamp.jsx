import React from 'react'
import timeSince from './getDate';

const getDateFromTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    const createdAtDate = `${date.toLocaleDateString()}`;
    const createdAtTime = `${date.toLocaleTimeString()}`;
    console.log(timeSince(timestamp));
    return {"date":createdAtDate, "time":createdAtTime, "interval":timeSince(timestamp)}
}

export default getDateFromTimestamp