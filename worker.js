// IPTV Channels (kept for backward compat)
const CHANNELS = {
  "2342": "https://live.livetvstream.co.uk/LS-63503-4",
  // "1001": "https://example.com/live/stream1"
}

// IPTV-org API endpoints
const IPTV_API_BASE = "https://iptv-org.github.io/api"

// HTML UI (inline)
const HTML_UI = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>پخش زنده IPTV</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --bg-primary: #0a0e27;
      --bg-secondary: #141b2d;
      --bg-card: rgba(255, 255, 255, 0.05);
      --bg-card-hover: rgba(255, 255, 255, 0.1);
      --text-primary: #ffffff;
      --text-secondary: #b4b9c8;
      --accent: #6366f1;
      --accent-hover: #818cf8;
      --border: rgba(255, 255, 255, 0.1);
      --shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      --gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    body {
      font-family: 'Vazirmatn', sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      min-height: 100vh;
      padding: 20px;
      background-image: 
        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
        radial-gradient(at 100% 100%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    header {
      text-align: center;
      margin-bottom: 40px;
      padding: 30px 0;
    }
    
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      background: var(--gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
    }
    
    .subtitle {
      color: var(--text-secondary);
      font-size: 1rem;
    }
    
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 30px;
      justify-content: center;
    }
    
    .search-box {
      flex: 1;
      min-width: 250px;
      position: relative;
    }
    
    .search-box input {
      width: 100%;
      padding: 15px 45px 15px 15px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      color: var(--text-primary);
      font-family: 'Vazirmatn', sans-serif;
      font-size: 1rem;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }
    
    .search-box input:focus {
      outline: none;
      border-color: var(--accent);
      background: var(--bg-card-hover);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    
    .search-box input::placeholder {
      color: var(--text-secondary);
    }
    
    .filter-select {
      padding: 15px 20px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      color: var(--text-primary);
      font-family: 'Vazirmatn', sans-serif;
      font-size: 1rem;
      backdrop-filter: blur(10px);
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 180px;
    }
    
    .filter-select:focus {
      outline: none;
      border-color: var(--accent);
      background: var(--bg-card-hover);
    }
    
    .filter-select option {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }
    
    .channel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }
    
    .channel-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    
    .channel-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--gradient);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }
    
    .channel-card:hover {
      transform: translateY(-5px);
      background: var(--bg-card-hover);
      border-color: var(--accent);
      box-shadow: var(--shadow);
    }
    
    .channel-card:hover::before {
      transform: scaleX(1);
    }
    
    .channel-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 15px;
    }
    
    .channel-flag {
      width: 32px;
      height: 24px;
      border-radius: 4px;
      object-fit: cover;
      border: 1px solid var(--border);
    }
    
    .channel-name {
      font-size: 1.1rem;
      font-weight: 600;
      flex: 1;
    }
    
    .channel-category {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(99, 102, 241, 0.2);
      border-radius: 20px;
      font-size: 0.85rem;
      color: var(--accent);
      margin-top: 10px;
    }
    
    .play-button {
      width: 100%;
      padding: 12px;
      margin-top: 15px;
      background: var(--gradient);
      border: none;
      border-radius: 10px;
      color: white;
      font-family: 'Vazirmatn', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .play-button:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
    }
    
    .channel-sources {
      margin-top: 10px;
    }
    
    .channel-sources label {
      display: block;
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-bottom: 4px;
    }
    
    .channel-sources select {
      width: 100%;
      padding: 8px 10px;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text-primary);
      font-family: 'Vazirmatn', sans-serif;
      font-size: 0.9rem;
      cursor: pointer;
    }
    
    .channel-sources select:focus {
      outline: none;
      border-color: var(--accent);
    }
    
    .loading {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-secondary);
    }
    
    .loading-spinner {
      border: 3px solid var(--border);
      border-top: 3px solid var(--accent);
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error {
      text-align: center;
      padding: 40px 20px;
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
      border-radius: 12px;
      margin: 20px 0;
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-secondary);
    }
    
    .empty-state svg {
      width: 80px;
      height: 80px;
      margin-bottom: 20px;
      opacity: 0.5;
    }
    
    /* Video Player Modal */
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 1000;
      backdrop-filter: blur(10px);
    }
    
    .modal.active {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .modal-content {
      width: 95%;
      max-width: 1200px;
      background: var(--bg-secondary);
      border-radius: 20px;
      padding: 30px;
      position: relative;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .modal-title {
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .close-button {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 8px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1.5rem;
      color: var(--text-primary);
    }
    
    .close-button:hover {
      background: var(--bg-card-hover);
      border-color: var(--accent);
    }
    
    .video-container {
      width: 100%;
      aspect-ratio: 16/9;
      background: #000;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
    }
    
    .video-container video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .player-error {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #ef4444;
      text-align: center;
      padding: 20px;
    }
    
    @media (max-width: 768px) {
      h1 {
        font-size: 1.8rem;
      }
      
      .channel-grid {
        grid-template-columns: 1fr;
      }
      
      .controls {
        flex-direction: column;
      }
      
      .search-box,
      .filter-select {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <script type="application/json" id="initial-channels">__CHANNELS_PAYLOAD__</script>
  <div class="container">
    <header>
      <h1>📺 پخش زنده IPTV</h1>
      <p class="subtitle">جستجو و تماشای کانال‌های تلویزیونی از سراسر جهان</p>
    </header>
    
    <div class="controls">
      <div class="search-box">
        <input type="text" id="searchInput" placeholder="جستجوی کانال..." autocomplete="off">
      </div>
      <select class="filter-select" id="categoryFilter">
        <option value="">همه دسته‌بندی‌ها</option>
      </select>
      <select class="filter-select" id="countryFilter">
        <option value="">همه کشورها</option>
      </select>
    </div>
    
    <div id="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>در حال بارگذاری کانال‌ها...</p>
    </div>
    
    <div id="error" class="error" style="display: none;"></div>
    
    <div id="channelGrid" class="channel-grid"></div>
    
    <div id="emptyState" class="empty-state" style="display: none;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>کانالی یافت نشد</p>
    </div>
  </div>
  
  <!-- Video Player Modal -->
  <div id="playerModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title" id="playerTitle">پخش ویدیو</h2>
        <button class="close-button" id="closeModal">&times;</button>
      </div>
      <div class="video-container">
        <video id="videoPlayer" controls></video>
        <div id="playerError" class="player-error" style="display: none;"></div>
      </div>
    </div>
  </div>
  
  <script>
    let allChannels = [];
    let filteredChannels = [];
    
    // Country code to flag emoji mapping
    const countryFlags = {
      'IR': '🇮🇷', 'US': '🇺🇸', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷',
      'IT': '🇮🇹', 'ES': '🇪🇸', 'RU': '🇷🇺', 'CN': '🇨🇳', 'JP': '🇯🇵',
      'KR': '🇰🇷', 'IN': '🇮🇳', 'BR': '🇧🇷', 'MX': '🇲🇽', 'CA': '🇨🇦',
      'AU': '🇦🇺', 'TR': '🇹🇷', 'AE': '🇦🇪', 'SA': '🇸🇦', 'EG': '🇪🇬',
      'IQ': '🇮🇶', 'AF': '🇦🇫', 'PK': '🇵🇰', 'BD': '🇧🇩', 'ID': '🇮🇩',
      'MY': '🇲🇾', 'TH': '🇹🇭', 'VN': '🇻🇳', 'PH': '🇵🇭', 'SG': '🇸🇬'
    };
    
    function getCountryFlag(countryCode) {
      if (!countryCode) return '🌍';
      return countryFlags[countryCode.toUpperCase()] || '🌍';
    }
    
    function getCountryName(countryCode) {
      const names = {
        'IR': 'ایران', 'US': 'آمریکا', 'GB': 'انگلستان', 'DE': 'آلمان', 'FR': 'فرانسه',
        'IT': 'ایتالیا', 'ES': 'اسپانیا', 'RU': 'روسیه', 'CN': 'چین', 'JP': 'ژاپن',
        'KR': 'کره جنوبی', 'IN': 'هند', 'BR': 'برزیل', 'MX': 'مکزیک', 'CA': 'کانادا',
        'AU': 'استرالیا', 'TR': 'ترکیه', 'AE': 'امارات', 'SA': 'عربستان', 'EG': 'مصر',
        'IQ': 'عراق', 'AF': 'افغانستان', 'PK': 'پاکستان', 'BD': 'بنگلادش', 'ID': 'اندونزی',
        'MY': 'مالزی', 'TH': 'تایلند', 'VN': 'ویتنام', 'PH': 'فیلیپین', 'SG': 'سنگاپور'
      };
      return names[countryCode?.toUpperCase()] || countryCode || 'نامشخص';
    }
    
    function getChannelsFromPage() {
      var el = document.getElementById('initial-channels');
      if (!el || !el.textContent) return [];
      try {
        return JSON.parse(el.textContent);
      } catch (e) {
        console.error('Parse initial channels:', e);
        return [];
      }
    }
    
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    function renderChannels(channels) {
      const grid = document.getElementById('channelGrid');
      const emptyState = document.getElementById('emptyState');
      
      if (channels.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
      }
      
      grid.style.display = 'grid';
      emptyState.style.display = 'none';
      
      // Clear and rebuild
      grid.innerHTML = '';
      
      function getSourceLabel(url, index) {
        try {
          var host = new URL(url).hostname.replace(/^www\\./, '');
          if (host.length > 22) host = host.slice(0, 19) + '…';
          return 'منبع ' + (index + 1) + ' (' + host + ')';
        } catch (e) {
          return 'منبع ' + (index + 1);
        }
      }
      
      channels.forEach(channel => {
        const flag = getCountryFlag(channel.country);
        const countryName = getCountryName(channel.country);
        const category = channel.categories?.[0] || 'عمومی';
        const channelName = channel.name || 'بدون نام';
        const urls = channel.streamUrls && channel.streamUrls.length ? channel.streamUrls : (channel.streamUrl ? [channel.streamUrl] : []);
        const hasMultiple = urls.length > 1;
        
        const card = document.createElement('div');
        card.className = 'channel-card';
        card.innerHTML = 
          '<div class="channel-header">' +
          '<span style="font-size: 1.5rem;">' + flag + '</span>' +
          '<div class="channel-name">' + escapeHtml(channelName) + '</div>' +
          '</div>' +
          '<div class="channel-category">' + escapeHtml(category) + '</div>' +
          '<div style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 8px;">' +
          escapeHtml(countryName) +
          '</div>';
        
        if (hasMultiple) {
          const wrap = document.createElement('div');
          wrap.className = 'channel-sources';
          wrap.innerHTML = '<label for="src-' + channel.id + '">انتخاب منبع / کیفیت</label>';
          const sel = document.createElement('select');
          sel.id = 'src-' + channel.id;
          urls.forEach(function(u, i) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = getSourceLabel(u, i);
            sel.appendChild(opt);
          });
          wrap.appendChild(sel);
          card.appendChild(wrap);
        }
        
        const playBtn = document.createElement('button');
        playBtn.className = 'play-button';
        playBtn.textContent = '▶ پخش';
        playBtn.onclick = function() {
          var url = channel.streamUrl || '';
          if (hasMultiple) {
            var s = card.querySelector('select');
            var idx = s ? parseInt(s.value, 10) : 0;
            url = urls[idx] || url;
          }
          playChannel(channel.id, channelName, url);
        };
        card.appendChild(playBtn);
        
        grid.appendChild(card);
      });
    }
    
    function populateFilters(channels) {
      const categories = new Set();
      const countries = new Set();
      
      channels.forEach(channel => {
        if (channel.categories) {
          channel.categories.forEach(cat => categories.add(cat));
        }
        if (channel.country) {
          countries.add(channel.country);
        }
      });
      
      const categoryFilter = document.getElementById('categoryFilter');
      const countryFilter = document.getElementById('countryFilter');
      
      [...categories].sort().forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
      });
      
      [...countries].sort().forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = getCountryName(country);
        countryFilter.appendChild(option);
      });
    }
    
    function filterChannels() {
      const searchTerm = document.getElementById('searchInput').value.toLowerCase();
      const categoryFilter = document.getElementById('categoryFilter').value;
      const countryFilter = document.getElementById('countryFilter').value;
      
      filteredChannels = allChannels.filter(channel => {
        const matchesSearch = !searchTerm || 
          (channel.name && channel.name.toLowerCase().includes(searchTerm)) ||
          (channel.alternativeNames && channel.alternativeNames.some(name => 
            name.toLowerCase().includes(searchTerm)));
        
        const matchesCategory = !categoryFilter || 
          (channel.categories && channel.categories.includes(categoryFilter));
        
        const matchesCountry = !countryFilter || channel.country === countryFilter;
        
        return matchesSearch && matchesCategory && matchesCountry && channel.streamUrl;
      });
      
      renderChannels(filteredChannels);
    }
    
    function playChannel(channelId, channelName, streamUrl) {
      if (!streamUrl) {
        alert('آدرس پخش برای این کانال موجود نیست');
        return;
      }
      
      const modal = document.getElementById('playerModal');
      const playerTitle = document.getElementById('playerTitle');
      const videoPlayer = document.getElementById('videoPlayer');
      const playerError = document.getElementById('playerError');
      
      playerTitle.textContent = channelName;
      modal.classList.add('active');
      playerError.style.display = 'none';
      
      // Legacy route (e.g. /2342/index.m3u8) works directly — no proxy needed
      const isLegacyUrl = streamUrl.startsWith('/') || streamUrl.startsWith(window.location.origin);
      const hlsSourceUrl = isLegacyUrl ? (streamUrl.startsWith('/') ? streamUrl : new URL(streamUrl).pathname) : ('/proxy?url=' + btoa(streamUrl));
      
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        
        hls.loadSource(hlsSourceUrl);
        hls.attachMedia(videoPlayer);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoPlayer.play().catch(err => {
            console.error('Play error:', err);
            showPlayerError('خطا در شروع پخش');
          });
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
          if (data.fatal) {
            switch(data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                showPlayerError('خطا در اتصال به سرور');
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                showPlayerError('خطا در پخش ویدیو');
                break;
              default:
                showPlayerError('خطای نامشخص در پخش');
                break;
            }
          }
        });
        
        // Clean up on close
        document.getElementById('closeModal').onclick = () => {
          hls.destroy();
          modal.classList.remove('active');
          videoPlayer.pause();
          videoPlayer.src = '';
        };
      } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        videoPlayer.src = hlsSourceUrl;
        videoPlayer.play().catch(err => {
          console.error('Play error:', err);
          showPlayerError('خطا در شروع پخش');
        });
        
        document.getElementById('closeModal').onclick = () => {
          modal.classList.remove('active');
          videoPlayer.pause();
          videoPlayer.src = '';
        };
      } else {
        showPlayerError('مرورگر شما از پخش HLS پشتیبانی نمی‌کند');
      }
    }
    
    function showPlayerError(message) {
      const playerError = document.getElementById('playerError');
      playerError.textContent = message;
      playerError.style.display = 'block';
    }
    
    // Make playChannel available globally
    window.playChannel = playChannel;
    
    // Close modal on background click
    document.getElementById('playerModal').addEventListener('click', (e) => {
      if (e.target.id === 'playerModal') {
        document.getElementById('closeModal').click();
      }
    });
    
    // Event listeners
    document.getElementById('searchInput').addEventListener('input', filterChannels);
    document.getElementById('categoryFilter').addEventListener('change', filterChannels);
    document.getElementById('countryFilter').addEventListener('change', filterChannels);
    
    // Initialize (channels loaded by worker into the page, no client fetch)
    (function () {
      try {
        var channels = getChannelsFromPage();
        allChannels = channels;
        filteredChannels = channels;
        
        document.getElementById('loading').style.display = 'none';
        populateFilters(channels);
        renderChannels(channels);
      } catch (error) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').textContent = 'خطا در بارگذاری کانال‌ها: ' + error.message;
      }
    })();
  </script>
</body>
</html>`

// Helper function to merge channels and streams
async function mergeChannelsAndStreams() {
  try {
    const [channelsRes, streamsRes] = await Promise.all([
      fetch(`${IPTV_API_BASE}/channels.json`),
      fetch(`${IPTV_API_BASE}/streams.json`)
    ])
    
    if (!channelsRes.ok || !streamsRes.ok) {
      throw new Error('Failed to fetch from iptv-org API')
    }
    
    const channels = await channelsRes.json()
    const streams = await streamsRes.json()
    
    // Create a map of channel_id -> stream URLs
    const streamMap = new Map()
    streams.forEach(stream => {
      if (stream.channel && stream.url) {
        if (!streamMap.has(stream.channel)) {
          streamMap.set(stream.channel, [])
        }
        streamMap.get(stream.channel).push(stream.url)
      }
    })
    
    // Merge channels with their stream URLs
    const merged = channels
      .map(channel => {
        const streamUrls = streamMap.get(channel.id) || []
        // Filter for HLS streams (.m3u8)
        const hlsStreams = streamUrls.filter(url => 
          url.includes('.m3u8') || url.includes('m3u8')
        )
        
        const list = hlsStreams.length > 0 ? hlsStreams : streamUrls
        return {
          ...channel,
          streamUrl: list[0] || null,
          streamUrls: list
        }
      })
      .filter(channel => channel.streamUrl) // Only include channels with valid streams
    
    return merged
  } catch (error) {
    console.error('Error merging channels and streams:', error)
    throw error
  }
}

// Combined channels: iptv-org merge + manual CHANNELS (for both / and /api/channels)
async function getCombinedChannels(origin) {
  const merged = await mergeChannelsAndStreams()
  const manualEntries = Object.entries(CHANNELS).map(([id, baseUrl]) => {
    const streamUrl = `${origin}/${id}/index.m3u8`
    return {
      id,
      name: id,
      country: '',
      categories: ['دستی'],
      streamUrl,
      streamUrls: [streamUrl],
      _legacy: true
    }
  })
  const byId = new Map(merged.map(c => [c.id, c]))
  manualEntries.forEach(entry => {
    byId.set(entry.id, { ...(byId.get(entry.id) || {}), ...entry })
  })
  return Array.from(byId.values())
}

// Helper function to rewrite HLS playlist
function rewriteHLSPlaylist(playlistText, proxyBaseUrl, originalBaseUrl, encodedBaseUrl) {
  const baseUrlObj = new URL(originalBaseUrl)
  const basePath = baseUrlObj.pathname.replace(/\/[^\/]*$/, '') || '/'
  
  // Split into lines to process each line individually
  const lines = playlistText.split('\n')
  const rewrittenLines = lines.map(line => {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || !line.trim()) {
      return line
    }
    
    // Skip if already a full URL starting with http
    if (line.trim().startsWith('http://') || line.trim().startsWith('https://')) {
      // Rewrite absolute URLs to use our proxy
      if (line.includes(baseUrlObj.origin)) {
        const segmentUrl = line.trim()
        return `${proxyBaseUrl}&seg=${encodeURIComponent(segmentUrl)}`
      }
      return line
    }
    
    // Handle relative URLs
    const segmentPath = line.trim()
    if (segmentPath && (segmentPath.endsWith('.ts') || segmentPath.endsWith('.m4s') || 
        segmentPath.endsWith('.vtt') || segmentPath.endsWith('.aac') || segmentPath.endsWith('.mp4'))) {
      // Construct full URL for the segment
      let segmentUrl
      if (segmentPath.startsWith('/')) {
        segmentUrl = baseUrlObj.origin + segmentPath
      } else {
        segmentUrl = baseUrlObj.origin + basePath + '/' + segmentPath
      }
      return `${proxyBaseUrl}&seg=${encodeURIComponent(segmentUrl)}`
    }
    
    return line
  })
  
  return rewrittenLines.join('\n')
}

export default {
  async fetch(request) {
    try {
      const url = new URL(request.url)
      const pathname = url.pathname
      
      // Root route - serve UI with channel data injected (everything loaded on worker)
      if (pathname === '/' || pathname === '') {
        const combined = await getCombinedChannels(url.origin)
        const payload = JSON.stringify(combined).replace(/<\/script/gi, '<\\/script')
        const body = HTML_UI.replace('__CHANNELS_PAYLOAD__', payload)
        return new Response(body, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=60'
          }
        })
      }
      
      // API route - same data as injected (optional, e.g. for refresh)
      if (pathname === '/api/channels') {
        const combined = await getCombinedChannels(url.origin)
        return new Response(JSON.stringify(combined), {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=300'
          }
        })
      }
      
      // Proxy route - dynamic HLS proxy
      if (pathname === '/proxy') {
        const corsHeaders = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*'
        }
        try {
          const streamUrlParam = url.searchParams.get('url')
          const segParam = url.searchParams.get('seg')
          
          if (!streamUrlParam) {
            return new Response('Missing url parameter', { status: 400, headers: corsHeaders })
          }
          
          let originalUrl
          try {
            originalUrl = atob(streamUrlParam)
          } catch (e) {
            return new Response('Invalid url parameter', { status: 400, headers: corsHeaders })
          }
          
          const originalUrlObj = new URL(originalUrl)
          let targetUrl
          
          if (segParam) {
            const segPath = decodeURIComponent(segParam)
            if (segPath.startsWith('http://') || segPath.startsWith('https://')) {
              targetUrl = new URL(segPath)
            } else {
              const basePath = originalUrlObj.pathname.replace(/\/[^\/]*$/, '') || '/'
              const baseUrl = originalUrlObj.origin + basePath + '/'
              targetUrl = new URL(segPath, baseUrl)
            }
          } else {
            targetUrl = originalUrlObj
          }
          
          const ua = request.headers.get("User-Agent") || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          const referer = originalUrlObj.origin + (originalUrlObj.pathname || '/')
          const headers = {
            "User-Agent": ua,
            "Referer": referer,
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.9"
          }
          
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 15000)
          let response
          try {
            response = await fetch(targetUrl.toString(), {
              headers,
              redirect: 'follow',
              signal: controller.signal
            })
          } finally {
            clearTimeout(timeoutId)
          }
          
          if (!response.ok) {
            const body = await response.text().catch(() => '')
            return new Response(
              JSON.stringify({ error: 'Upstream error', status: response.status, details: body.slice(0, 200) }),
              {
                status: 502,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            )
          }
          
          const contentType = response.headers.get("content-type") || ""
          const isM3u8 = contentType.includes("application/vnd.apple.mpegurl") ||
            contentType.includes("application/x-mpegURL") ||
            targetUrl.pathname.endsWith(".m3u8") ||
            targetUrl.pathname.includes(".m3u8")
          
          if (isM3u8) {
            const text = await response.text()
            const proxyBaseUrl = `${url.origin}/proxy?url=${streamUrlParam}`
            const rewritten = rewriteHLSPlaylist(text, proxyBaseUrl, originalUrl, streamUrlParam)
            return new Response(rewritten, {
              headers: {
                "Content-Type": "application/vnd.apple.mpegurl",
                ...corsHeaders,
                "Cache-Control": "public, max-age=30"
              }
            })
          }
          
          return new Response(response.body, {
            status: response.status,
            headers: {
              "Content-Type": contentType,
              ...corsHeaders,
              "Cache-Control": "public, max-age=300"
            }
          })
        } catch (err) {
          const message = err.name === 'AbortError' ? 'Upstream timeout' : (err.message || 'Proxy error')
          return new Response(JSON.stringify({ error: message }), {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
      }
      
      // Backward compatibility - existing /{id}/... routes
      const parts = pathname.split('/').filter(Boolean)
      const id = parts[0]
      const rest = parts.slice(1).join('/')
      
      const base = CHANNELS[id]
      if (base) {
        const baseUrl = new URL(base)
        
        // Build target URL dynamically
        let targetUrl
        if (rest) {
          targetUrl = new URL(rest, baseUrl + '/')
        } else {
          targetUrl = new URL('index.m3u8', baseUrl + '/')
        }
        
        // Dynamic headers based on origin
        const headers = {
          "User-Agent": request.headers.get("User-Agent") || "Mozilla/5.0",
          "Referer": baseUrl.origin + "/",
          "Origin": baseUrl.origin
        }
        
        const response = await fetch(targetUrl.toString(), { headers })
        
        const contentType = response.headers.get("content-type") || ""
        
        // 🔥 Rewrite HLS playlists
        if (
          contentType.includes("application/vnd.apple.mpegurl") ||
          contentType.includes("application/x-mpegURL") ||
          targetUrl.pathname.endsWith(".m3u8")
        ) {
          let text = await response.text()
          
          // Rewrite absolute URLs
          text = text.replaceAll(
            baseUrl.origin,
            `${url.origin}/${id}`
          )
          
          // Rewrite relative segment paths
          text = text.replaceAll(
            baseUrl.pathname.replace(/\/$/, '') + '/',
            `${url.origin}/${id}/`
          )
          
          return new Response(text, {
            headers: {
              "Content-Type": "application/vnd.apple.mpegurl",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "*"
            }
          })
        }
        
        // 🎥 Stream segments (.ts, .m4s, etc.)
        return new Response(response.body, {
          status: response.status,
          headers: {
            "Content-Type": contentType,
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=30"
          }
        })
      }
      
      return new Response('Not found', { status: 404 })
      
    } catch (err) {
      return new Response("Error: " + err.message, { status: 500 })
    }
  }
}
