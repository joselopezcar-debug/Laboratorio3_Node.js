const fs = require('fs');
const { Transform } = require('stream');

const upperCaseTransform = new Transform({
    transform(chunk, encoding, callback) {
        try {
            const upperChunk = chunk.toString().toUpperCase();
            this.push(upperChunk);
            callback();
        } catch (error) {
            callback(error);
        }
    }
});

const readStream = fs.createReadStream('texto.txt', 'utf8');
const writeStream = fs.createWriteStream('texto_mayusculas.txt');

// 4. Pipeline: leer → transformar → escribir
readStream
    .pipe(upperCaseTransform)
    .pipe(writeStream)
    .on('finish', () => {
        console.log('Transformación completada exitosamente');
        console.log('Archivo guardado como: texto_mayusculas.txt');
        
        // Verificar el resultado
        const resultado = fs.readFileSync('texto_mayusculas.txt', 'utf8');
        console.log('\nContenido del archivo transformado:');
        console.log('---');
        console.log(resultado);
        console.log('---');
    })
    .on('error', (err) => {
        console.error('Error en el proceso:', err.message);
    });

// Manejo de errores individuales
readStream.on('error', (err) => {
    console.error('Error al leer el archivo:', err.message);
});

writeStream.on('error', (err) => {
    console.error('Error al escribir el archivo:', err.message);
});