import React from 'react'

const detectUrls = (text) => { 
    const urlRegex = /(https?:\/\/[^\s]+)/g; 
    return text.match(urlRegex); 
  }

  const formatPostUrl = (postText) =>  { 
    const urls = detectUrls(postText); 
    let formattedPostText = postText; 
    if (urls !== null) { 
      for(let i = 0; i < urls.length; i++) 
      { formattedPostText = formattedPostText.replace(urls[i], `<a class="text-blue-500" href="${urls[i]}" target="_blank" rel="noopener noreferrer">${urls[i]}</a>`); } 
    } 
    return formattedPostText; 
  }

export default formatPostUrl