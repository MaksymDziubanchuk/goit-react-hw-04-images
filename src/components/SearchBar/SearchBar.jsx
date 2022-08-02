import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import css from 'components/SearchBar/SearchBar.module.css';

export const Searchbar = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = e => {
    const value = e.target.value;

    setInputValue(value);
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    const query = inputValue.trim();

    if (query === '') {
      toast.error('Query can not be empty!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,

        draggable: true,
        progress: undefined,
      });
      return;
    }

    onSubmit(query.toLowerCase());
    setInputValue('');
  };
  return (
    <header className={css.Searchbar}>
      <form className={css.SearchForm} onSubmit={handleFormSubmit}>
        <button type="submit" className={css.SearchForm_button}>
          <span className={css.SearchForm_button_label}>Search</span>
        </button>

        <input
          value={inputValue}
          onChange={handleInputChange}
          className={css.SearchForm_input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
