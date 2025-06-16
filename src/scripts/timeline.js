import { parseCoordinates } from './geolocation';
import { recordAudio, recordVideo } from './media';

class Timeline {
  constructor() {
    this.posts = [];
    this.currentText = '';
    this.initElements();
    this.initEventListeners();
  }

  initElements() {
    this.timelineEl = document.querySelector('.timeline');
    this.postInput = document.querySelector('.post-input');
    this.modal = document.getElementById('coordinates-modal');
    this.coordinatesInput = document.getElementById('coordinates-input');
    this.confirmBtn = document.getElementById('confirm-btn');
    this.cancelBtn = document.getElementById('cancel-btn');
  }

  initEventListeners() {
    this.postInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && this.postInput.value.trim()) {
        this.currentText = this.postInput.value.trim();
        this.createTextPost(this.currentText);
      }
    });

    document.querySelector('.record-audio').addEventListener('click', () => {
      this.createMediaPost('audio');
    });

    document.querySelector('.record-video').addEventListener('click', () => {
      this.createMediaPost('video');
    });

    this.confirmBtn.addEventListener('click', () => {
      this.handleManualCoordinates(this.currentText, this.coordinatesInput.value);
      this.hideModal();
    });

    this.cancelBtn.addEventListener('click', () => {
      this.hideModal();
      this.postInput.value = this.currentText;
    });
  }

  async createTextPost(text) {
    this.postInput.value = '';
    try {
      const position = await this.getPosition();
      this.addPost({
        type: 'text',
        content: text,
        coordinates: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        date: new Date()
      });
    } catch (error) {
      this.showModal();
    }
  }

  async createMediaPost(type) {
    try {
      const position = await this.getPosition();
      const mediaFunction = type === 'audio' ? recordAudio : recordVideo;
      
      mediaFunction()
        .then(mediaUrl => {
          this.addPost({
            type,
            content: mediaUrl,
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
            date: new Date()
          });
        })
        .catch(error => {
          console.error(`Error recording ${type}:`, error);
        });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }

  getPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    });
  }

  showModal() {
    this.modal.style.display = 'flex';
    this.coordinatesInput.focus();
  }

  hideModal() {
    this.modal.style.display = 'none';
    this.coordinatesInput.value = '';
  }

  handleManualCoordinates(text, coordinatesInput) {
    try {
      const coords = parseCoordinates(coordinatesInput);
      this.addPost({
        type: 'text',
        content: text,
        coordinates: coords,
        date: new Date()
      });
    } catch (error) {
      alert('Неверный формат координат. Пожалуйста, используйте формат: "широта, долгота"');
      this.coordinatesInput.focus();
    }
  }

  addPost(post) {
    this.posts.unshift(post);
    this.renderPosts();
  }

  renderPosts() {
    this.timelineEl.innerHTML = '';
    
    this.posts.forEach(post => {
      const postEl = document.createElement('div');
      postEl.className = 'post';
      
      const dateStr = post.date.toLocaleString();
      const coordsStr = `[${post.coordinates.latitude}, ${post.coordinates.longitude}]`;
      
      postEl.innerHTML = `
        <div class="post-header">
          <span class="post-date">${dateStr}</span>
        </div>
        <div class="post-content">
          ${this.getPostContent(post)}
        </div>
        <div class="post-coordinates">${coordsStr}</div>
      `;
      
      this.timelineEl.appendChild(postEl);
    });
  }

  getPostContent(post) {
    switch (post.type) {
      case 'text':
        return `<p>${post.content}</p>`;
      case 'audio':
        return `
          <div class="media-player">
            <audio src="${post.content}" controls></audio>
          </div>
        `;
      case 'video':
        return `
          <div class="media-player">
            <video src="${post.content}" controls width="100%"></video>
          </div>
        `;
      default:
        return '';
    }
  }
}

export default Timeline;