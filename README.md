# 📺 TV Workers

Modern IPTV streaming UI with Cloudflare Worker–based proxy for streaming HLS channels. Features a beautiful, searchable frontend that automatically fetches channel data from iptv-org API.

## 🚀 Features

### Frontend UI
* **Modern Dark Theme** - Glassmorphism design with gradient accents
* **RTL Layout** - Full Persian/Farsi language support with Vazirmatn font
* **Search & Filters** - Search by channel name, filter by category and country
* **Channel Grid** - Beautiful card-based layout with country flags and categories
* **Video Player** - Fullscreen HLS.js player modal for streaming
* **Responsive Design** - Mobile-first, works on all devices

### Backend Proxy
* **Dynamic Stream Proxying** - Proxies any HLS stream URL on-the-fly
* **Automatic Playlist Rewriting** - Rewrites HLS playlists to route through proxy
* **CORS Support** - Enables cross-origin streaming
* **API Integration** - Fetches and merges channels from iptv-org API
* **Backward Compatible** - Still supports static CHANNELS map

---

## 📂 Project Structure

```
worker.js          # Main worker with inline UI
package.json       # NPM configuration
wrangler.toml      # Cloudflare Workers configuration
README.md          # This file
```

---

## 🛠 How It Works

### Routes

1. **`/`** - Serves the complete HTML/CSS/JS UI inline
2. **`/api/channels`** - Fetches and merges `channels.json` + `streams.json` from iptv-org API, returns merged JSON with stream URLs
3. **`/proxy?url=<base64>`** - Dynamic HLS proxy that accepts any stream URL (base64-encoded), fetches it, rewrites playlists, and streams with CORS headers
4. **`/{id}/...`** - Backward compatibility route for manually-configured channels in CHANNELS map

### Data Flow

1. **Page Load**: UI fetches `/api/channels`
2. **Worker**: Fetches `channels.json` and `streams.json` from iptv-org API
3. **Merge**: Worker merges channels with their stream URLs (prioritizes HLS `.m3u8` streams)
4. **Render**: UI displays channels in a searchable, filterable grid
5. **Play**: User clicks a channel → HLS.js loads `/proxy?url=<base64_stream_url>`
6. **Proxy**: Worker fetches stream, rewrites HLS playlist to route segments back through proxy
7. **Stream**: Video plays through the proxy with CORS support

---

## 🚀 Quick Start

### Local Development

1. **Install dependencies** (if needed):
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Run locally**:
   ```bash
   npx wrangler dev
   ```

4. **Open browser**:
   Navigate to `http://localhost:8787/`

### Deploy to Cloudflare

```bash
wrangler deploy
```

After deployment, visit your worker URL (e.g., `https://tv-workers.your-username.workers.dev`) to access the UI.

---

## 🎨 UI Features

### Search
- Real-time search by channel name or alternative names
- Searches in both English and Persian

### Filters
- **Category Filter**: Filter by channel category (News, Sports, Entertainment, etc.)
- **Country Filter**: Filter by country with Persian country names

### Channel Cards
- Country flag emoji
- Channel name
- Category badge
- Country name
- Play button

### Video Player
- Fullscreen modal player
- HLS.js integration for adaptive streaming
- Error handling with user-friendly messages
- Close button to stop playback

---

## ➕ Adding Manual Channels (Backward Compatibility)

The UI automatically loads channels from iptv-org API, but you can still add manual channels for backward compatibility:

Open `worker.js` and locate:

```js
// IPTV Channels (kept for backward compat)
const CHANNELS = {
  "2342": "https://live.livetvstream.co.uk/LS-63503-4",
  // "1001": "https://example.com/live/stream1"
}
```

To add a new IPTV stream:

1. Find the base stream URL (without `/index.m3u8`):
   ```
   https://live.livetvstream.co.uk/LS-63503-4
   ```

2. Add it to `CHANNELS`:
   ```js
   const CHANNELS = {
     "2342": "https://live.livetvstream.co.uk/LS-63503-4",
     "1001": "https://example.com/live/channel"
   }
   ```

3. Access via: `https://your-worker.dev/2342/index.m3u8`

---

## 🔗 API Endpoints

### GET `/api/channels`
Returns merged channel data with stream URLs from iptv-org API.

**Response:**
```json
[
  {
    "id": "channel-id",
    "name": "Channel Name",
    "country": "US",
    "categories": ["News"],
    "streamUrl": "https://example.com/stream.m3u8",
    ...
  }
]
```

**Cache:** 5 minutes

### GET `/proxy?url=<base64_encoded_stream_url>&seg=<segment_path>`
Proxies HLS streams dynamically. The `url` parameter should be base64-encoded.

**Example:**
```
/proxy?url=aHR0cHM6Ly9leGFtcGxlLmNvbS9zdHJlYW0ubTN1OA==
```

---

## 🌐 Language Support

The UI is fully localized in **Persian (Farsi)** with:
- RTL (right-to-left) layout
- Vazirmatn Google Font for native Persian typography
- All labels, buttons, and messages in Farsi
- Persian country names

---

## ⚠️ Notes

* **Stream Availability**: Channels without working stream URLs won't appear in the UI
* **Geo-restrictions**: Some streams may not work due to geo-restrictions or dead URLs - this is expected
* **Permissions**: Only use streams you have permission to proxy
* **Rate Limiting**: The iptv-org API is public but consider rate limiting for production use
* **Caching**: Channel data is cached for 5 minutes, playlists for 30 seconds, segments for 5 minutes

---

## 🧪 Testing

### Browser Testing

1. Start local dev server: `npx wrangler dev`
2. Navigate to `http://localhost:8787/`
3. Verify UI loads with dark theme and channel grid
4. Test search functionality
5. Test category and country filters
6. Test video playback by clicking a channel card
7. Verify `/api/channels` returns JSON data

### Manual Verification

If `wrangler dev` is not feasible:
1. Deploy via `wrangler deploy`
2. Visit the deployed URL
3. Test the same flows as above

---

## 📜 License

[MIT License](./LICENSE)
