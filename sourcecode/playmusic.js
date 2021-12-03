/**
 * 1.Render Songs
 * 2.Scroll top
 * Play/pause/seek
 * CD rotatr
 * 5. Next/prev
 * 6. Random
 * 7.Next/Repeat when ended
 * 8.Active song
 * 9.Scroll active song into view
 * 10.Play song when click
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const playlist = $('.playlist')
const player = $('.app')
const heading = $('.header h3')
const cdImg = $('.cd_img')
const audio = $("#audio");
const playBtn = $(".btn_play");
const progress = $('#progress');
const nextBtn = $('.btn_next');
const backBtn = $('.btn_back');
const randomtBtn = $('.btn_random');
const replayBtn = $('.btn_replay')

const app = {
    currentIndex: 0,//lấy chỉ mục đầu tiên của mảng
    isPlaying: false,
    isRandom: false,//mặc định bằng fale , khi nhất play thì sẽ thành true
    isReplay:false,
    songs: [
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
    render: function () {
        //render ra các bài hát
        const htmls = this.songs.map( (song,index)=> {
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
            `;
        });
        playlist.innerHTML = htmls.join('');
    },
   
    handleEvent: function () {
        const _this = this //_this = app
        const cdWidth = cd.offsetWidth;

        //Xử lý CD quay /dừng
        const cdimgAnimate = cdImg.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 100000,//10 giay
            interation: Infinity //vong lap vo han
        })
        cdimgAnimate.pause()//pause để lúc đầu vào nó không quay 
        
        //sroll thì ảnh sẽ nhỏ dần lại,xử lý phóng to / thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth
        }
        //xử lý khi click play 
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }
        //Khi bài hát được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdimgAnimate.play()
            //console.log(cdimgAnimate)=> để xem các phương thức của nó: dừng là gì , hoạt động là gì
        }
        //Khi pause bài hát
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdimgAnimate.pause()
        }
        //Bắt kịp tiến độ của bai hát
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)//Math.floor - làm tròn
                progress.value = progressPercent;//value ở phần html giá trị bằng 0, giờ gán giá trị tỉ lệ % mình tính phía trên vào
                //currentTime -  Đặt hoặc trả về vị trí phát lại hiện tại trong âm thanh / video (tính bằng giây)
                //duration -Trả về thời lượng của âm thanh / video hiện tại (tính bằng giây)
            }
        }
        //Xử lý khi tua bài hát
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime

        }
        //xử lí khi next bài hát
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomsong()
            }
            else {

                _this.nextSong()
            }
            audio.play();
            _this.render();
            _this.scrollActivesong();
        }
        //xử lí khi back bài hát
        backBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomsong()
            }
            else {

                _this.backSong()
            }
            audio.play();
            _this.render();
            _this.scrollActivesong();
        }
        //Xử lí random bài hát
        randomtBtn.onclick = function () {
            _this.isRandom = !_this.isRandom //đảo cái false thành true
           
            randomtBtn.classList.toggle('active', _this.isRandom)
            //đọc kĩ về api toggle của classlist.đối sô thứ hai là bolean
            //nếu đối số thứ 2 là true thì sẽ add, là false thì sẽ remove

        }
        //Xử lý lặp lại 1 bài hát
        replayBtn.onclick = function(){
            _this.isReplay = !_this.isReplay //đảo cái false thành true
           
            replayBtn.classList.toggle('active', _this.isReplay)
        }
        //Xử lí next bài háy khi kết thúc bài hát
        audio.onended = function(){
            if(_this.isReplay){
                audio.play()
            }
            else{

                nextBtn.click(); //hành động tự click vào nút next
            }
        }
        //Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e){//e là sự kiện ,target là đich đến
            const songNode = e.target.closest('.song:not(.active)')
            //nghĩa là khi có sự kiện click chẳng hạn,target là mục tiêu. Nó sẽ trả về chính cái mà bạn click vào 
            if(songNode|| e.target.closest('.option'))
            {//search closest:trả về element của nó hoặc cha của nó

                    //xử lí khi click vào song
                    if(songNode){
                        _this.currentIndex = Number(songNode.dataset.index)//vì nó là chuỗi phải chuyển sang number
                        _this.loadCurrentSong()
                        audio.play()

                    }
            }
        }

    },
    //Khi bài hát active thì nó sẽ hiện lên view(lên đầu)
    scrollActivesong:function(){
        setTimeout(()=>{//đọc scrollintoView API
            $('.song.active').scrollIntoView({
                behavior :'smooth',
                block : 'center'
            })

        },300)
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    playRandomsong: function () {
        let newIndex
        do {
            newIndex =  Math.floor(Math.random() * this.songs.length)
        }
        while (newIndex === this.currentIndex)//trùng với bài cũ thì lặp đến khi nào hết trùng
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    loadCurrentSong: function () {

        heading.textContent = this.currentSong.name;
        cdImg.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    backSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.song.length - 1
        }
        this.loadCurrentSong()
    },
    start: function () {
        this.defineProperties()//định nghĩa cho các thuộc tính

        // khi tương tác với phương thức trong 1 element thì phải get element trước đã
        //get element của audio, audio chưa có bài hát nào.nên ngay từ khi bắt đầu thì phải note được bài đầu tiên vào thẻ audio
        this.currentSong;//lấy ra bài hát hiện tại 
        this.handleEvent();//lắng nghe/xử lý các sự kiện 
        this.loadCurrentSong();//tải thông tin bài hát đầu tiên vào giao diện khi chạy ứng dụng
        this.render();//render lại playlist
    }

}
app.start()


