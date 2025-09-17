const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  const io = new Server(httpServer, {
    cors: {
      origin: dev ? "http://localhost:3000" : process.env.APP_BASE_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  })

  // Store the io instance globally so we can access it from API routes
  global.io = io

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id)

    // Join order room for tracking
    socket.on('join-order', (orderId) => {
      socket.join(`order-${orderId}`)
      console.log(`Client ${socket.id} joined order room: order-${orderId}`)
    })

    // Join tracking room
    socket.on('join-tracking', (trackingCode) => {
      socket.join(`track-${trackingCode}`)
      console.log(`Client ${socket.id} joined tracking room: track-${trackingCode}`)
    })

    // Join rider room
    socket.on('join-rider', (riderId) => {
      socket.join(`rider-${riderId}`)
      console.log(`Client ${socket.id} joined rider room: rider-${riderId}`)
    })

    // Handle rider location updates
    socket.on('rider-location', (data) => {
      // Broadcast location to order room
      socket.to(`order-${data.orderId}`).emit('rider:location', data)
      console.log(`Rider location update for order ${data.orderId}:`, data)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  httpServer.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
