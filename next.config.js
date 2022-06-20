/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')

module.exports = withPWA({
  reactStrictMode: true,
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    buildExcludes: [/middleware-manifest\.json$/]
     //register: true,
    // scope: '/app',
    // sw: 'service-worker.js',
    //...
  }
})
