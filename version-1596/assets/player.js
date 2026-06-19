
import { H as Hls } from './hls-dru42stk.js';
function initPlayer(box){
  const video = box.querySelector('video[data-src]');
  const overlay = box.querySelector('.play-overlay');
  if(!video) return;
  const src = video.dataset.src;
  const setError = (msg)=>{ const n=box.querySelector('.player-note'); if(n) n.textContent = msg; };
  try{
    if(Hls && Hls.isSupported && Hls.isSupported()){
      const hls = new Hls({enableWorker:true, lowLatencyMode:true, backBufferLength:90});
      hls.loadSource(src); hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function(event, data){ if(data && data.fatal){ setError('播放源加载异常，播放器已尝试恢复'); try{ hls.startLoad(); }catch(e){} } });
    }else if(video.canPlayType('application/vnd.apple.mpegurl')){
      video.src = src;
    }else{
      setError('当前浏览器不支持 HLS，可换用 Safari/Chrome 或部署后再试');
    }
  }catch(e){ setError('播放器初始化失败'); }
  const start = async()=>{ overlay && overlay.classList.add('hidden'); try{ await video.play(); }catch(e){ setError('点击播放器控制条开始播放'); } };
  if(overlay) overlay.addEventListener('click', start);
  video.addEventListener('play',()=>overlay&&overlay.classList.add('hidden'));
  video.addEventListener('pause',()=>overlay&&overlay.classList.remove('hidden'));
}
document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('.player-shell').forEach(initPlayer));
