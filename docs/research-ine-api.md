# Investigación: API del INE

Fecha: 2026-10-17

## Resumen

El INE ofrece una API JSON pública para consultar la información estadística publicada en INEbase. La base de la API es:

```text
https://servicios.ine.es/wstempus/js/{idioma}/{función}/{input}[?parámetros]
```

Los idiomas documentados son `ES` y `EN`. La API agrega datos procedentes de Tempus3, ficheros PC-Axis y ficheros tpx; el INE indica que la información publicada puede consultarse mediante este servicio.

Fuentes oficiales:

- [API JSON del INE](https://www.ine.es/dyngs/DAB/es/index.htm?cid=1099)
- [Referencia completa de la API](https://www.ine.es/dyngs/DAB/es/index.htm?cid=1100)
- [Obtener datos de una tabla](https://www.ine.es/dyngs/DAB/es/index.htm?cid=1102)
- [Códigos de tablas y series](https://www.ine.es/dyngs/DAB/es/index.htm?cid=1104)
- [Datos abiertos y licencia](https://www.ine.es/datosabiertos/)

## Endpoints principales

### Datos

```text
GET https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/{tabla}
GET https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/{serie}
```

Parámetros útiles:

- `nult=N`: últimos `N` periodos.
- `date=AAAAMMDD:AAAAMMDD`: intervalo de fechas; se puede dejar un extremo vacío.
- `tip=A`: salida amigable.
- `tip=M`: metadatos.
- `tip=AM`: salida amigable y metadatos.
- `det=0|1|2`: nivel de detalle.
- `tv=id_variable:id_valor`: filtro de tabla.

Ejemplos oficiales:

```text
https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/50902?nult=1&tip=AM
https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/IPC251856?nult=5&tip=AM
```

### Descubrimiento de metadatos

```text
GET .../OPERACIONES_DISPONIBLES
GET .../OPERACION/{operacion}
GET .../VARIABLES
GET .../VARIABLES_OPERACION/{operacion}
GET .../VALORES_VARIABLE/{variable}
GET .../VALORES_VARIABLEOPERACION/{variable}/{operacion}
GET .../TABLAS_OPERACION/{operacion}
GET .../SERIE/{serie}
```

Las respuestas paginadas tienen un máximo documentado de 500 elementos por página; usar `page` para recorrer páginas adicionales.

### Tablas y filtros

Para una tabla se pueden consultar sus grupos y valores:

```text
GET .../GRUPOS_TABLA/{tabla}
GET .../VALORES_GRUPOSTABLA/{tabla}/{grupo}
```

El flujo recomendado es: localizar la operación, listar sus tablas, inspeccionar variables/valores y finalmente pedir datos de una tabla o serie con `nult`, `date` y filtros.

## Formatos alternativos

Para tablas también existen rutas oficiales de descarga en JSON, CSV, PC-Axis y XLSX. Por ejemplo, para la tabla `67196`:

```text
https://servicios.ine.es/wstempus/js/es/DATOS_TABLA/67196
https://servicios.ine.es/wstempus/csv/es/DATOS_TABLA/67196
https://servicios.ine.es/wstempus/csv_sc/es/DATOS_TABLA/67196
https://servicios.ine.es/wstempus/px/es/DATOS_TABLA/67196
https://servicios.ine.es/wstempus/xlsx/es/DATOS_TABLA/67196
```

## Licencia y uso

El portal de datos abiertos del INE indica una licencia Creative Commons Attribution 4.0 International, que permite copiar, distribuir, modificar y reutilizar los datos, incluidos usos comerciales, con atribución.

La documentación oficial recomienda el paquete de R `INEapir` para acceder a datos y metadatos desde R. Para este proyecto, una integración HTTP directa en Python/TypeScript es suficiente y evita añadir una dependencia de R.

## Recomendación para Entrelineas

Implementar un cliente pequeño con:

1. `get_table(table_id, *, nult=None, date=None, tip="AM", det=None)`.
2. `get_series(series_id, *, nult=None, date=None, tip="AM", det=None)`.
3. Métodos de descubrimiento para operaciones, tablas, variables y valores.
4. Timeout explícito, reintentos limitados y caché de respuestas de metadatos.
5. Validación de identificadores antes de construir URLs.
6. Tests con respuestas JSON almacenadas localmente, para que la suite no dependa del servicio externo.

No se ha confirmado en la documentación consultada un contrato de límites de frecuencia ni un mecanismo de autenticación; el cliente debe tratar los errores HTTP y evitar consultas masivas innecesarias.
