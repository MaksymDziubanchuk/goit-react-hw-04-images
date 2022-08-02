import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { fetchItems } from 'helpers/helpers';
import { Searchbar } from 'components/SearchBar/SearchBar';
import { Loader } from 'components/Loader/Loader';
import { ImageGallery } from 'components/ImageGalery/ImageGallery';
import { Button } from 'components/Button/Button';
import { Modal } from 'components/Modal/Modal';

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
          <Loader />
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
          {buttonVisible && <Button onClick={handleButtonClick} />}
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

// export class App extends Component {
//   state = {
//     searchQuery: '',
//     page: 1,
//     items: [],
//     error: '',
//     status: 'idle',
//     buttonVisible: false,
//     showModal: false,
//     modalUrl: '',
//   };

//   componentDidUpdate(_, prevState) {
//     if (
//       prevState.searchQuery !== this.state.searchQuery ||
//       prevState.page !== this.state.page
//     ) {
//       this.setState({ status: 'pending' });
//       fetchItems(this.state.searchQuery, this.state.page)
//         .then(({ items, buttonVisible }) => {
//           const oldItems = this.state.items;
//           const newItems = [...oldItems, ...items];
//           this.setState({ items: newItems, status: 'resolved', buttonVisible });
//         })
//         .catch(error =>
//           this.setState({ error: error.message, status: 'rejected' })
//         );
//     }
//   }

//   handleFormSubmit = value => {
//     if (this.state.searchQuery !== value) {
//       this.setState({
//         searchQuery: value,
//         page: 1,
//         buttonVisible: false,
//         items: [],
//       });
//     }
//   };

//   handleButtonClick = () => {
//     this.setState(prevState => ({
//       page: prevState.page + 1,
//     }));
//   };

//   handleModalToggle = () => {
//     this.setState(({ showModal }) => ({ showModal: !showModal }));
//   };

//   handleImgClick = url => {
//     this.setState({
//       modalUrl: url,
//       showModal: true,
//     });
//   };

//   render() {
//     if (this.state.status === 'idle') {
//       return (
//         <div className={css.App}>
//           <Searchbar onSubmit={this.handleFormSubmit} />
//           <h1 className={css.Title}>Enter query</h1>
//           <ToastContainer
//             position="top-right"
//             autoClose={2000}
//             hideProgressBar
//             newestOnTop={false}
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//           />
//         </div>
//       );
//     }
//     if (this.state.status === 'pending') {
//       return (
//         <div className={css.App}>
//           <Searchbar onSubmit={this.handleFormSubmit} />
//           <Loader />
//           <ToastContainer
//             position="top-right"
//             autoClose={2000}
//             hideProgressBar
//             newestOnTop={false}
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//           />
//         </div>
//       );
//     }
//     if (this.state.status === 'rejected') {
//       return (
//         <div className={css.App}>
//           <Searchbar onSubmit={this.handleFormSubmit} />
//           <h1 className={css.Title}>{this.state.error}</h1>
//           <ToastContainer
//             position="top-right"
//             autoClose={2000}
//             hideProgressBar
//             newestOnTop={false}
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//           />
//         </div>
//       );
//     }
//     if (this.state.status === 'resolved') {
//       return (
//         <div className={css.App}>
//           <Searchbar onSubmit={this.handleFormSubmit} />
//           <ImageGallery
//             items={this.state.items}
//             onClick={this.handleImgClick}
//           />
//           {this.state.buttonVisible && (
//             <Button onClick={this.handleButtonClick} />
//           )}
//           {this.state.showModal && (
//             <Modal onClose={this.handleModalToggle} url={this.state.modalUrl} />
//           )}
//           <ToastContainer
//             position="top-right"
//             autoClose={2000}
//             hideProgressBar
//             newestOnTop={false}
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//           />
//         </div>
//       );
//     }
//   }
// }
