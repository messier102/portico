# Portico

Portico is a source-agnostic infinite-scrolling media gallery. It can be
used to easily browse Reddit, Danbooru, and other sites.

It is based around a system of adapters - small components that perform two core
functions:
1. Fetch media from a source in a way the source understands; and
2. Convert fetched data into an internal Portico format.

Portico can be used with any appropriately adapted source, and will provide the
same baseline user experience for all sources.

A live version is currently hosted at https://portico.tskoll.com.

(**Note:** videos are currently not supported - only images and gifs.)

## Screenshots

![Main view screenshot](/assets/screenshot.jpg)

![Lightbox screenshot](/assets/lightbox_screenshot.png)

## Controls

### In lightbox mode
- `A` or `left arrow` or `swipe down` - go to previous image.
- `D` or `right arrow` or `swipe up` - go to next image.
- `Q` - rotate the image 90 degrees counter-clockwise.
- `E` - rotate the image 90 degrees clockwise.
- `Esc` or `click` or `tap` - exit lightbox mode.

## Supported sources

### Reddit
#### Paths
- `/r/{subreddit}`
- `/r/{subreddit1}+{subreddit2}+...`
- `/u/{user}/{feed}` - for custom feeds.

#### Subpaths
- `/new` - default for custom feeds.
- `/hot` - default for subreddits.
- `/rising`
- `/top?t={hour|day|week|month|year|all}` - default value of `t` is `day`.
- `/controversial?t={hour|day|week|month|year|all}` - default value of `t` is `day`.

#### Notes
- Rate limit of up to 300 page fetches every 10 minutes across all subreddits.

### Danbooru posts
#### Paths
- `/danbooru`

#### Query parameters
- `tags={tag1 tag2}` - filters images by provided tags; space separated.
- `random` - each page shows a random sample of images. May contain repeats.

#### Notes
- Up to two tags per query. Some tags don't count towards the limit -
  see [Danbooru
  documentation](https://danbooru.donmai.us/wiki_pages/help%3Acheatsheet#dtext-n5)
  for details.
- Up to 1000 pages per query.


### Danbooru boards
#### Paths
- `/danbooru/curated`
- `/danbooru/popular`
- `/danbooru/viewed`

#### Query parameters
- `scale={day,month,year}` - sets the time scope of the board.
- `date={YYYY-MM-DD}` - shows a board for a certain date. If `scale` is set to
  `month`, will show images for the *calendar* month `MM`; same for `year`.

### Hentsu starboard <span style="color: orange">**(NSFW)**</span>
#### Paths
- `/starboard`
- `/starboard/random` - redirects to `/starboard?before={randomTimestamp}`

#### Query parameters
- `before={timestamp}` - sets the starting offset.

#### Notes
- Oldest valid timestamp is `1593860599395`.
- Due to uneven distribution, `/random` tends to result in the same set of
  images near the beginning of the collection.


## Developing

```bash
npm install
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

```bash
npm run build
```

> You can preview the built app with `npm run preview`.