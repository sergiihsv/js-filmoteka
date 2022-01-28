const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '25290744-d6d0934bf026089ed7a084fd9';

import axios from 'axios';

export default class ImgApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = 0;
    this.totalImages;
    this.perPage = 40;
  }

  async fetchArticles() {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`,
    );

    const images = await response.data;

    this.incrementPage();
    this.totalImages = images.totalHits;

    return images.hits;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
