import './css/styles.css';

import ImgApiService from './img-api-service';
import articlesTpl from './templates/photo-card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

putLoadMoreBtn();

const imgApiService = new ImgApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function onSearch(event) {
  event.preventDefault();

  imgApiService.query = event.currentTarget.elements.searchQuery.value;

  if (imgApiService.query.trim() === '') {
    Notiflix.Notify.info('Please, enter you search query.');

    clearArticlesContainer();

    return;
  }

  imgApiService.resetPage();
  imgApiService.fetchArticles().then(hits => {
    clearArticlesContainer();
    notFindImages(hits);
    appendArticlesMarkup(hits);
    countOfImages();
    galleryModal.refresh();
  });
}

function onLoadMoreBtn() {
  imgApiService.fetchArticles().then(appendArticlesMarkup).then(renderMoreImages);
}

function appendArticlesMarkup(hits) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', articlesTpl(hits));
  galleryModal.refresh();
}

function clearArticlesContainer() {
  refs.galleryContainer.innerHTML = '';
}

function putLoadMoreBtn() {
  document.querySelector('.load-more').classList.add('is-hidden');
}

function showLoadMoreBtn() {
  document.querySelector('.load-more').classList.remove('is-hidden');
}

function notFindImages(hits) {
  putLoadMoreBtn();
  if (hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
}

function renderMoreImages(hits) {
  if (imgApiService.totalImages <= imgApiService.perPage * (imgApiService.page - 1)) {
    putLoadMoreBtn();
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
  refs.galleryContainer.insertAdjacentHTML('beforeend', articlesTpl(hits));
}

function countOfImages() {
  const totalImages = imgApiService.totalImages;

  if (totalImages > 0) {
    Notiflix.Notify.success(`Hooray! We found ${totalImages} images.`);
  }

  if (totalImages > imgApiService.perPage && imgApiService.page > 1) {
    showLoadMoreBtn();
  }
}

const galleryModal = new SimpleLightbox('.gallery a', {});
