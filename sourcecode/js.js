const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playlist = $('.playlist')
const cd = $('.cd');
const playBtn = $('.btn_play')
const heading = $('.header h3')
const cdImg =$('.cd_img')
const audio = $('#audio')
const player = $('.app')
const progress = $('.progress')
const nextBtn =$('.btn_next')
const backBtn =$('.btn_back')
const randomBtn = $('.btn_random')
const replayBtn =$('.btn_replay')


const app = {
  currentIndex : 0,
  isPlaying:false,
  isRandom :false,
  isReplay : false,
  songs:[
    {
      name: 'Bước qua nhau',
      singer: 'Vũ',
      path: '/music/buocquanhau.mp3',
      image: '/img/buocquanhau.jpg'

  },
  {
      name: 'Candy',
      singer: 'Doja Cat',
      path: '/music/happyforyou.mp3',
      image: '/img/candy.jpg'

  },
  {
      name: 'Kiss me more',
      singer: 'Doja Cat',
      path: '/music/kissmemore.mp3',
      image: '/img/kissmemore.jpg'

  },
  {
      name: 'Taste',
      singer: 'Tyga',
      path: '/music/taste.mp3',
      image: '/img/taste.jpg'

  },
  {
      name: 'Havana',
      singer: 'Camilla Cabello',
      path: '/music/camillacabello.mp3',
      image: '/img/havana.jpg'

  },
  {
      name: 'Cheap Thrills',
      singer: 'Sia',
      path: '/music/sia.mp3',
      image: '/img/cheap.jpg'

  },
  {
      name: 'Moneys',
      singer: 'Lalalisa',
      path: '/music/lisa.mp3',
      image: '/img/money.jpg'

  },
  {
      name: 'Red',
      singer: 'Taylor Swift',
      path: '/music/red.mp3',
      image: '/img/red.jpg'

  },
  {
      name: 'Natural',
      singer: 'Imagine Dragons',
      path: '/music/imaginedragons.mp3',
      image: '/img/natural_dragons.jpg'

  },
  {
      name: 'Sugar',
      singer: 'Maroon 5',
      path: '/music/sugar.mp3',
      image: '/img/sugar.jpg'

  },
  {
      name: 'Wildest Dreams',
      singer: 'Taylor Swift',
      path: '/music/wildestdreams.mp3',
      image: '/img/wildestdreams.jpg'

  },

  ],
  render : function(){
    const htmls = this.songs.map((song,index)=> {
        return ` 
        <div class="song ${
          index === this.currentIndex ? "active" : ""
        }" data-index="${index}">
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `
    })
    playlist.innerHTML = htmls.join('')
  },
  handleEvent:function ( ) {
    //Xử lý scroll ảnh thì cũng thu nhỏ và mờ theo
    const _this = this //_this = app
        const cdWidth = cd.offsetWidth;

           
        //sroll thì ảnh sẽ nhỏ dần lại,xử lý phóng to / thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth
        }
        playBtn.onclick = function(){
          if(_this.isPlaying){
            audio.pause()
          }
          else{

            audio.play()
          }
        }
        audio.onplay = function(){
          _this.isPlaying = true;
          player.classList.add('playing')
          cdimgAnimate.play()
        }
        audio.onpause = function(){
          _this.isPlaying = false;
          player.classList.remove('playing')
          cdimgAnimate.pause()
        }
        audio.ontimeupdate = function(){
          if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime/audio.duration * 100)
            progress.value = progressPercent
          }
        }
        progress.oninput = function(e){
          const seekTime = audio.duration/100 * e.target.value
          audio.currentTime = seekTime
        }
        const cdimgAnimate  = cdImg.animate(
          [
            {transform: 'rotate(360deg)'}
          ],{
            duration :10000,
            iterations :Infinity
          }
        )
        cdimgAnimate.pause();
        nextBtn.onclick =function(){
          if(_this.isRandom){
            _this.randomSong()
          }
          else{

            _this.nextSong();
          }
          audio.play();
          _this.render();
          _this.scrollActivesong();
        };
        backBtn.onclick = function(){
          if(_this.isRandom){
            _this.randomSong()
          }else{

            _this.backSong();
          }
          audio.play();
          _this.render();
          _this.scrollActivesong();
        }
        randomBtn.onclick = function(){
          _this.isRandom = !_this.isRandom
          randomBtn.classList.toggle('active',_this.isRandom)
        }
        replayBtn.onclick = function(){
          _this.isReplay = !_this.isReplay;
          replayBtn.classList.toggle('active',_this.isReplay)
        }
        audio.onended = function(){
          if(_this.isReplay){
            audio.play();
          }
          else{
            nextBtn.click()
          }
        }
        playlist.onclick = function(e){
          const songNode = e.target.closest('.song:not(.active)')
          if(songNode||e.target.closest('.option'))
          {
            if(songNode){
              _this.currentIndex = Number(songNode.dataset.index)
              _this.loadCrurrentSong();
              _this.activeSong()
              audio.play();
            }
          }
        }
        
  },
  // active song:
  activeSong: function(){
    var loopSongs = $$('.song');
    for (song of loopSongs){
            song.classList.remove('active')
    }
    const activeSong = loopSongs[this.currentIndex]
    activeSong.classList.add('active')
},

  loadCrurrentSong :function(){
    heading.textContent = this.currentSong.name;
    cdImg.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
  },
  scrollActivesong:function(){
    setTimeout(()=>{//đọc scrollintoView API
        $('.song.active').scrollIntoView({
            behavior :'smooth',
            block : 'center'
        })

    },300)
},
  defineProperties : function(){
    Object.defineProperty(this , "currentSong" , {
      get:function(){
        return this.songs[this.currentIndex]
      }
    } )
  },
  nextSong :function(){
    this.currentIndex++;
    if(this.currentIndex >= this.songs.length){
      this.currentIndex = 0;
    }
    this.loadCrurrentSong();
  },
  backSong :function(){
    this.currentIndex--;
    if(this.currentIndex < 0 ){
      this.currentIndex = 0;
    }
    this.loadCrurrentSong();
  },
  randomSong : function(){
    let newIndex
    do{
      newIndex = Math.floor(Math.random() * this.songs.length)

    }while(newIndex === this.currentIndex)
    this.currentIndex = newIndex;
    this.loadCrurrentSong();

  },
  start : function(){
    this.render();
    this.handleEvent()
    this.defineProperties()
    this.loadCrurrentSong();
  }
}
app.start()

