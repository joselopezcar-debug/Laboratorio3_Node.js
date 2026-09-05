const http = require('http');
const ExcelJS = require('exceljs');

// Datos de ejemplo - 20 filas
const ventas = [
    { producto: 'Laptop Gamer', cantidad: 5, precio: 1200.00 },
    { producto: 'Mouse Inalámbrico', cantidad: 15, precio: 25.50 },
    { producto: 'Teclado Mecánico', cantidad: 10, precio: 45.00 },
    { producto: 'Monitor 24"', cantidad: 8, precio: 299.99 },
    { producto: 'Impresora Multifunción', cantidad: 3, precio: 150.00 },
    { producto: 'Tablet 10"', cantidad: 12, precio: 499.00 },
    { producto: 'Smartphone 128GB', cantidad: 20, precio: 799.99 },
    { producto: 'Auriculares Bluetooth', cantidad: 25, precio: 35.00 },
    { producto: 'Cámara Web 4K', cantidad: 7, precio: 59.99 },
    { producto: 'Disco Duro SSD 1TB', cantidad: 9, precio: 89.99 },
    { producto: 'Memoria USB 64GB', cantidad: 30, precio: 14.99 },
    { producto: 'Router WiFi 6', cantidad: 6, precio: 79.99 },
    { producto: 'Switch de Red', cantidad: 4, precio: 120.00 },
    { producto: 'Cable HDMI 2m', cantidad: 18, precio: 9.99 },
    { producto: 'Adaptador USB-C', cantidad: 14, precio: 19.99 },
    { producto: 'Batería Externa 20000mAh', cantidad: 11, precio: 39.99 },
    { producto: 'Cargador Rápido', cantidad: 22, precio: 24.99 },
    { producto: 'Funda para Laptop', cantidad: 8, precio: 29.99 },
    { producto: 'Mouse Pad Grande', cantidad: 16, precio: 7.99 },
    { producto: 'Soporte para Laptop', cantidad: 5, precio: 34.99 }
];

// Crear servidor HTTP
const server = http.createServer(async (req, res) => {
    // Validación de rutas
    if (req.url === '/reporte') {
        try {
            console.log('Generando reporte Excel...');
            
            // 1. Crear workbook y worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Ventas');

            // 2. Configurar columnas con formato
            worksheet.columns = [
                { 
                    header: 'Producto', 
                    key: 'producto', 
                    width: 25,
                    style: { font: { bold: true } }
                },
                { 
                    header: 'Cantidad', 
                    key: 'cantidad', 
                    width: 15,
                    style: { numFmt: '#,##0' }
                },
                { 
                    header: 'Precio (US$)', 
                    key: 'precio', 
                    width: 15,
                    style: { numFmt: '$#,##0.00' }
                }
            ];

            // 3. Agregar datos
            ventas.forEach(venta => {
                worksheet.addRow(venta);
            });

            // 4. Agregar fila de totales
            const totalProductos = ventas.reduce((sum, v) => sum + v.cantidad, 0);
            const totalVentas = ventas.reduce((sum, v) => sum + (v.cantidad * v.precio), 0);
            
            const totalRow = worksheet.addRow({
                producto: 'TOTAL',
                cantidad: totalProductos,
                precio: totalVentas
            });
            
            // Estilo para la fila de total
            totalRow.eachCell((cell) => {
                cell.font = { bold: true };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE0E0E0' }
                };
            });

            // 5. Configurar cabeceras HTTP
            res.writeHead(200, {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=reporte_ventas.xlsx',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });

            // 6. Enviar el Excel en streaming
            await workbook.xlsx.write(res);
            
            // 7. Cerrar el stream
            res.end();
            
            console.log('Reporte Excel generado y enviado exitosamente');

        } catch (error) {
            // Manejo de errores en la generación del Excel
            console.error('Error al generar el reporte:', error);
            
            // Enviar respuesta de error
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Error al generar el reporte: ' + error.message);
        }
    } else {
        // Ruta no encontrada
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Visita /reporte para descargar el Excel');
    }
});

// Manejo de errores del servidor
server.on('error', (err) => {
    console.error('Error en el servidor:', err);
});

// Iniciar servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:' + PORT);
    console.log('Para descargar el Excel, visita: http://localhost:' + PORT + '/reporte');
    console.log('Para ver el mensaje de bienvenida, visita: http://localhost:' + PORT);
});