import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import trash from './trash.svg';
import './App.css';

const API_URL = 'http://localhost:3001';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortLink, setShortLink] = useState([]);
  const [selectedExpiration, setSelectedExpiration] = useState('1');
  const [refetchData, setRefetchData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setShortLink(result.shortUrls)
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [refetchData]);

  const removeUrl = (id) => {
    fetch(`${API_URL}/api/shorturl/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setShortLink(shortLink.filter((link) => link._id !== id));
      })
      .catch((error) => {
        console.error(error);
      });

  }

  const handleShorten = () => {
    fetch(`${API_URL}/api/short`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: originalUrl, expirationTime: Number(selectedExpiration) }),
    })
      .then((response) => response.json())
      .then((data) => {
        setShortLink([...shortLink, { fullUrl: originalUrl, shortUrl: data.response }]);
        setRefetchData(!refetchData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="shortenlink-container">
      <div className="container">
        <div className="left">
          <img width={197} src={logo} alt="logo" />
          <div className="shorten-link-wrapper">
            <h3>My shortened URLs</h3>

            {shortLink?.map((link, index) => (
              <div
                key={index}
                className="shorter-link"
              >
                <a target="_blank" rel="noreferrer" href={link.fullUrl}>
                  {`${API_URL}/${link.shortUrl}`}
                </a>
                <img
                  src={trash}
                  onClick={() =>
                    removeUrl(link._id)
                  }
                  alt="trash"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="right">
          <h2>URL Shortener</h2>
          <div className="input-wrapper">
            <input
              className="input url-input"
              placeholder="Paste the URL to be shortened"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
            <select
              value={selectedExpiration}
              onChange={setSelectedExpiration}
              className="input select-expiration">
              <option value={1}>1 minute</option>
              <option value={5}>5 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={300}>5 hours</option>
            </select>
          </div>
          <button
            className="button-shorten-url"
            onClick={() => handleShorten()}
          >
            Shorten URL
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
