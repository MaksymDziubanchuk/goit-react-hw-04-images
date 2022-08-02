import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { fetchItems } from 'helpers/helpers';
import { Searchbar } from 'components/SearchBar/SearchBar';
import { Loader } from 'components/Loader/Loader';
import { ImageGallery } from 'components/ImageGalery/ImageGallery';
import { Button } from 'components/Button/Button';
import { Modal } from 'components/Modal/Modal';

import { Element, Events, scroller } from 'react-scroll';

import css from 'components/App.module.css';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');
  const [buttonVisible, setButtonVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalUrl, setModalUrl] = useState('');

  useEffect(() => {
    Events.scrollEvent.register('begin', function () {
      console.log('begin', arguments);
    });

    Events.scrollEvent.register('end', function () {
      console.log('end', arguments);
    });
  }, []);

  useEffect(() => {
    return () => {
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
    };
  });

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }
    setStatus('pending');
    fetchItems(searchQuery, page)
      .then(({ data, buttonVisible }) => {
        setItems(prev => [...prev, ...data]);
        setButtonVisible(buttonVisible);
        setStatus('resolved');
      })
      .catch(error => {
        setError(error.message);
        setStatus('rejected');
      });
  }, [page, searchQuery]);

  const scrollTo = () => {
    scroller.scrollTo('scroll-to-element', {
      duration: 1500,
      delay: 0,
      smooth: 'easeInOutQuart',
    });
  };

  const handleFormSubmit = value => {
    if (searchQuery !== value) {
      setItems([]);
      setButtonVisible(false);
      setSearchQuery(value);
      setPage(1);
    }
  };

  const handleButtonClick = () => {
    setPage(page => page + 1);
  };

  const handleModalToggle = () => {
    setShowModal(prev => !prev);
  };

  const handleImgClick = url => {
    setModalUrl(url);
    setShowModal(true);
  };

  switch (status) {
    case 'idle':
      return (
        <div className={css.App}>
          <Searchbar onSubmit={handleFormSubmit} />
          <h1 className={css.Title}>Enter query</h1>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      );
    case 'pending':
      return (
        <div className={css.App}>
          <Searchbar onSubmit={handleFormSubmit} />
          <ImageGallery items={items} onClick={handleImgClick} />
          <Loader />
          {showModal && <Modal onClose={handleModalToggle} url={modalUrl} />}

          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      );
    case 'rejected':
      return (
        <div className={css.App}>
          <Searchbar onSubmit={handleFormSubmit} />
          <h1 className={css.Title}>{error}</h1>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      );
    case 'resolved':
      return (
        <div className={css.App}>
          <Searchbar onSubmit={handleFormSubmit} />
          <ImageGallery items={items} onClick={handleImgClick} />
          {buttonVisible && (
            <div onClick={() => scrollTo()}>
              <Button onClick={handleButtonClick} />
              <Element className="element" name="scroll-to-element" />
            </div>
          )}
          {showModal && <Modal onClose={handleModalToggle} url={modalUrl} />}
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      );
    default:
      return;
  }
};
