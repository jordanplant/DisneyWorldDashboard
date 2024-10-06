import React from 'react';
import PropTypes from 'prop-types';
import styles from './ModalForm.module.css';

const ModalForm = ({
  formTitle,
  pages,
  currentPage,
  handleSave,
  onClose,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  goToNextPage,
  goToPreviousPage,
}) => {
  if (!Array.isArray(pages) || currentPage < 0 || currentPage >= pages.length) {
    return null;
  }

  const isLastPage = currentPage === pages.length - 1;
  const hasMultiplePages = pages.length > 1;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.setupModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalTopSection}>
          <h1 className={styles.modalTitle}>{formTitle}</h1>
        </div>
        <div className={styles.formWrapper}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isLastPage) {
                handleSave();
              }
            }}
          >
{pages[currentPage].map((field) => (
  <div key={field.id}>
    <label htmlFor={field.id}>{field.label}</label>
    <div className={styles.inputWrapper}>
      {field.type === 'select' ? (
        <select
          id={field.id}
          value={field.value || ''} 
          className={`${field.className} ${styles.formInput}`} 
          onChange={field.onChange}
          required={field.required}
        >
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea
          id={field.id}
          value={field.value || ''}
          className={`${field.className} ${styles.formInput}`} 
          onChange={field.onChange}
          placeholder={field.placeholder || ''}
          required={field.required}
        />
      ) : (
        <input
          type={field.type}
          id={field.id}
          value={field.value || ''}
          className={`${field.className} ${styles.formInput}`} 
          onChange={field.onChange}
          placeholder={field.placeholder || ''}
          min={field.min || ''}
          required={field.required || false}
        />
      )}
    </div>
  </div>
))}



            <div className={styles.submitButtons}>
              {currentPage > 0 && (
                <button 
                  type="button" 
                  onClick={goToPreviousPage} 
                  className={styles.saveButton}
                >
                  Back
                </button>
              )}
              {hasMultiplePages && !isLastPage && (
                <button 
                  type="button" 
                  onClick={goToNextPage} 
                  className={styles.saveButton}
                >
                  Next
                </button>
              )}
              {isLastPage && (
                <button type="submit" className={styles.saveButton}>
                  {submitLabel}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
              >
                {cancelLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

ModalForm.propTypes = {
  formTitle: PropTypes.string.isRequired,
  pages: PropTypes.arrayOf(PropTypes.array).isRequired,
  currentPage: PropTypes.number.isRequired,
  handleSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  goToNextPage: PropTypes.func.isRequired,
  goToPreviousPage: PropTypes.func.isRequired,
};

export default ModalForm;