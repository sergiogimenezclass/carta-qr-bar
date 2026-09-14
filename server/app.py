"""
===============================================================================
SERVIDOR BACKEND PARA EL DASHBOARD DOCENTE
===============================================================================
Este servidor en Python (usando la librería Flask y SQLite) almacena de forma
global los comercios del curso para que docentes y alumnos puedan acceder y
ver las actualizaciones desde cualquier computadora o dispositivo.

Funciona como una API REST que devuelve y recibe datos en formato JSON.
===============================================================================
"""

import sqlite3
import os
from flask import Flask, jsonify, request
from flask_cors import CORS

# Inicializamos la aplicación de Flask
app = Flask(__name__)

# Habilitamos CORS para que el HTML/JS desplegado en Netlify o localmente
# pueda comunicarse con este servidor sin ser bloqueado por el navegador.
CORS(app)

# Ruta donde se guardará el archivo de la base de datos SQLite
DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'database.db')

def get_db_connection():
    """
    Función auxiliar para conectarnos a la base de datos SQLite.
    Devuelve una conexión donde las filas se pueden consultar como diccionarios.
    """
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """
    Inicializa la base de datos creando la tabla 'comercios' e insertando
    los 10 comercios iniciales de ejemplo si la tabla está vacía.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Creamos la tabla de comercios si no existe
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS comercios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            tipo TEXT NOT NULL,
            netlify_name TEXT DEFAULT '',
            url TEXT DEFAULT '',
            estado TEXT DEFAULT 'en-construccion'
        )
    ''')
    
    # Verificamos si la tabla ya tiene datos
    cursor.execute('SELECT COUNT(*) FROM comercios')
    count = cursor.fetchone()[0]
    
    # Si la base de datos está vacía, cargamos los 10 comercios de prueba
    if count == 0:
        comercios_iniciales = [
            ("Café Nómade", "Cafetería", "cafe-nomade-cfp27-2026-01", "https://cafe-nomade-cfp27-2026-01.netlify.app", "en-construccion"),
            ("Bruma Café", "Cafetería", "bruma-cafe-cfp27-2026-02", "https://bruma-cafe-cfp27-2026-02.netlify.app", "en-construccion"),
            ("Patio Central", "Bar", "patio-central-cfp27-2026-03", "https://patio-central-cfp27-2026-03.netlify.app", "en-construccion"),
            ("La Esquina Verde", "Restaurante", "esquina-verde-cfp27-2026-04", "https://esquina-verde-cfp27-2026-04.netlify.app", "en-construccion"),
            ("Tostado Club", "Cafetería", "tostado-club-cfp27-2026-05", "https://tostado-club-cfp27-2026-05.netlify.app", "en-construccion"),
            ("Bodega Urbana", "Bar", "bodega-urbana-cfp27-2026-06", "https://bodega-urbana-cfp27-2026-06.netlify.app", "en-construccion"),
            ("Miga y Miel", "Café y pastelería", "miga-miel-cfp27-2026-07", "https://miga-miel-cfp27-2026-07.netlify.app", "en-construccion"),
            ("Fuego Lento", "Restaurante", "fuego-lento-cfp27-2026-08", "https://fuego-lento-cfp27-2026-08.netlify.app", "en-construccion"),
            ("Estación Café", "Cafetería", "estacion-cafe-cfp27-2026-09", "https://estacion-cafe-cfp27-2026-09.netlify.app", "en-construccion"),
            ("Terraza Sur", "Bar y restaurante", "terraza-sur-cfp27-2026-10", "https://terraza-sur-cfp27-2026-10.netlify.app", "en-construccion"),
        ]
        
        cursor.executemany('''
            INSERT INTO comercios (nombre, tipo, netlify_name, url, estado)
            VALUES (?, ?, ?, ?, ?)
        ''', comercios_iniciales)
        
        conn.commit()
    
    conn.close()

# Inicializamos la base de datos al arrancar el servidor
init_db()

# -----------------------------------------------------------------------------
# ENDPOINTS REST DE LA API
# -----------------------------------------------------------------------------

@app.route('/api/comercios', methods=['GET'])
def get_comercios():
    """
    Endpoint para obtener el listado completo de todos los comercios.
    """
    conn = get_db_connection()
    comercios = conn.execute('SELECT * FROM comercios ORDER BY id ASC').fetchall()
    conn.close()
    
    # Convertimos los registros de SQLite a una lista de diccionarios Python
    resultado = []
    for row in comercios:
        resultado.append({
            'id': row['id'],
            'nombre': row['nombre'],
            'tipo': row['tipo'],
            'netlifyName': row['netlify_name'],
            'url': row['url'],
            'estado': row['estado']
        })
        
    return jsonify(resultado)

@app.route('/api/comercios', methods=['POST'])
def add_comercio():
    """
    Endpoint para crear un nuevo comercio (Alta).
    Recibe un JSON con { nombre, tipo, netlifyName, url }.
    """
    data = request.get_json() or {}
    nombre = data.get('nombre', '').strip()
    tipo = data.get('tipo', 'Cafetería').strip()
    netlify_name = data.get('netlifyName', '').strip()
    url = data.get('url', '').strip()
    estado = 'publicado' if url != '' else 'en-construccion'
    
    if not nombre:
        return jsonify({'error': 'El nombre del comercio es obligatorio'}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO comercios (nombre, tipo, netlify_name, url, estado)
        VALUES (?, ?, ?, ?, ?)
    ''', (nombre, tipo, netlify_name, url, estado))
    
    nuevo_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({
        'id': nuevo_id,
        'nombre': nombre,
        'tipo': tipo,
        'netlifyName': netlify_name,
        'url': url,
        'estado': estado
    }), 201

@app.route('/api/comercios/<int:comercio_id>', methods=['PUT'])
def update_comercio(comercio_id):
    """
    Endpoint para actualizar los datos de un comercio existente (Modificación).
    """
    data = request.get_json() or {}
    nombre = data.get('nombre', '').strip()
    tipo = data.get('tipo', '').strip()
    netlify_name = data.get('netlifyName', '').strip()
    url = data.get('url', '').strip()
    estado = 'publicado' if url != '' else 'en-construccion'
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verificamos si existe el comercio
    cursor.execute('SELECT * FROM comercios WHERE id = ?', (comercio_id,))
    comercio_actual = cursor.fetchone()
    
    if not comercio_actual:
        conn.close()
        return jsonify({'error': 'Comercio no encontrado'}), 404
        
    nombre_final = nombre if nombre else comercio_actual['nombre']
    tipo_final = tipo if tipo else comercio_actual['tipo']
    
    cursor.execute('''
        UPDATE comercios
        SET nombre = ?, tipo = ?, netlify_name = ?, url = ?, estado = ?
        WHERE id = ?
    ''', (nombre_final, tipo_final, netlify_name, url, estado, comercio_id))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        'id': comercio_id,
        'nombre': nombre_final,
        'tipo': tipo_final,
        'netlifyName': netlify_name,
        'url': url,
        'estado': estado
    })

@app.route('/api/comercios/<int:comercio_id>', methods=['DELETE'])
def delete_comercio(comercio_id):
    """
    Endpoint para eliminar un comercio de la base de datos (Baja).
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM comercios WHERE id = ?', (comercio_id,))
    filas_afectadas = cursor.rowcount
    conn.commit()
    conn.close()
    
    if filas_afectadas == 0:
        return jsonify({'error': 'Comercio no encontrado'}), 404
        
    return jsonify({'mensaje': f'Comercio {comercio_id} eliminado correctamente'})

if __name__ == '__main__':
    # Ejecutamos el servidor en el puerto 5000 con modo debug desactivado
    print("Iniciando servidor de Comercios en http://localhost:5000 ...")
    app.run(host='0.0.0.0', port=5000, debug=True)
