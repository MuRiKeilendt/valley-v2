const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { MongoClient } = require('mongodb')
const app = express()
const port = process.env.PORT || 3000

// Habilita CORS para todas las rutas
app.use(cors())


// Middleware para parsear el cuerpo de la solicitud como JSON
app.use(bodyParser.json())

// Conexión a la base de datos MongoDB
const uri = 'mongodb+srv://keilendtmauricio:yqoyeQ2m7cDVxgAm@nullvalley.qpzxjad.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: { version: 'ServerApiVersion.v1', strict: true, deprecationErrors: true, } })

client.connect(err => {
    if (err) {
        console.error('Error de conexión a MongoDB:', err)
        process.exit(1) // Salir de la aplicación si hay un error de conexión
    } else {
        console.log('Conexión exitosa a MongoDB')
    }
})

// Función para obtener una colección específica
const getCollection = (collectionName) => {
    const database = client.db('valley')
    return database.collection(collectionName)
}

// Ruta para obtener datos desde MongoDB
app.get('/api/data/:collection', async (req, res) => {
    try {
        const collectionName = req.params.collection
        const collection = getCollection(collectionName)
        res.setHeader('Content-Type', 'application/json'); // Configura el tipo de contenido
        const result = await collection.find().toArray()
        res.json(result)
    } catch (error) {
        console.error('Error al obtener datos de MongoDB:', error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})

// Ruta para insertar datos a MongoDB
app.post('/api/data/:collection', async (req, res) => {
    try {
        const collectionName = req.params.collection
        const collection = getCollection(collectionName)

        const dataToInsert = req.body

        console.log({ req: req.body })

        // Inserta los datos en la colección
        const result = await collection.insertOne(dataToInsert)

        res.status(201).json({ message: 'Datos agregados correctamente', insertedId: result.insertedId })
    } catch (error) {
        console.error('Error al agregar datos a MongoDB:', error)
        res.status(500).json({ error: 'Error interno del servidor' + error.message })
    }
})

// Reiniciar las bases de datos
app.post('/api/reset-databases', async (req, res) => {
    try {

        const voteCollection = getCollection('vote')

        // Elimina todos los documentos en la colección 'vote'
        const deleteVoteResult = await voteCollection.deleteMany({})

        res.status(200).json({
            message: 'Bases de datos reiniciadas correctamente',
            deletedVotesCount: deleteVoteResult.deletedCount,
        })
    } catch (error) {
        console.error('Error al reiniciar las bases de datos:', error.message)
        res.status(500).json({ error: 'Error interno del servidor' + error.message })
    }
})


app.listen(port, () => {
    console.log(`Servidor Node.js escuchando`)
})
