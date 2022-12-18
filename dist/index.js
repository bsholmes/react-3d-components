if (process.env.NODE_ENV === 'production') {
  module.exports = [
    require('./prod/MediaRender.js')
  ];
} else {
  module.exports = [
    require('./dev/MediaRender.js')
  ];
}
