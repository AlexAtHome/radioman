const getRandomTrack = (playlist, prevTrack = null) => {
  const rand = ~~(playlist.length * Math.random())
  if (rand !== prevTrack) {
    prevTrack = rand
    return playlist[rand]
  } else {
    return getRandomTrack()
  }
}

module.exports = getRandomTrack
