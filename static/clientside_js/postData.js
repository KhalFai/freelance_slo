async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin', 
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async function getData(url="") {
    let response = await fetch(url, {
      method: 'GET',
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin', 
      referrerPolicy: 'no-referrer',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }