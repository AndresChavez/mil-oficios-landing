# Mil Oficios — landing

Reconstrucción de la landing aprobada en Angular 21, componentes standalone y Tailwind CSS v4 mediante PostCSS. Bootstrap se retiró del proyecto. Las fotografías son sintéticas y los testimonios se identifican como ilustrativos, conforme a la autorización del propietario. Se retiraron la etiqueta superior de Lima, las tres insignias del hero, «Ver todas» y el bloque «¿Listo para resolverlo?».

## Desarrollo y validación

Usar Node.js 24 LTS y npm:

```sh
npm ci
npm start
npm run build
npm test -- --watch=false
```

El build estático se genera en `dist/miloficios-landing/browser`. Se mantienen los presupuestos de 500 kB / 1 MB iniciales y 4 kB / 8 kB por componente.

La comprobación E2E `e2e/landing.cjs` requiere Playwright disponible en la resolución de módulos y Chrome instalado. Con el servidor local iniciado, ejecutar `node e2e/landing.cjs`. Se puede configurar `BASE_URL` y `CHROME_PATH`. Las capturas y el informe se escriben en `e2e/test-output` (ignorado por Git). El script intercepta Cloud Run; no escribe en la hoja real. No incluye datos reales de personas.

Para las preguntas frecuentes, ejecutar `node e2e/faq.cjs` con los mismos requisitos. El script compara las ocho preguntas y respuestas con `MIL_OFICIOS_LANDING_FAQ_IMPLEMENTACION.md`, verifica teclado, paneles independientes, movimiento reducido, destino del CTA y siete anchos de 320 a 1440 px. Genera `faq-report.json` y capturas de los paneles cerrados y abiertos en 390 y 1440 px. No envía mensajes ni solicitudes al backend. El proyecto no tiene un script de lint configurado.

## Páginas y componentes

- `/`: servicios y solicitud de especialistas por WhatsApp, proceso, beneficios, testimonios ilustrativos, FAQ y captación de especialistas.
- `/especialistas`: beneficios, cobertura, especialidades y proceso de evaluación.
- `/especialistas/registro`: dos pasos secuenciales y confirmación tras respuesta del receptor. Conserva datos al retroceder, advierte al abandonar y no persiste PII en almacenamiento del navegador.
- `/politicas-privacidad`: política de privacidad y contacto en `info@miloficios.pe`. Los enlaces antiguos a `/privacy` redirigen a esta ruta.
- Rutas desconocidas: vista 404 con regreso al inicio. En hosting SPA el código HTTP dependerá de Nginx.

`layout` contiene header, menú móvil y footer. `core` contiene catálogos, contenido, SEO, contacto y cliente HTTP. `shared/icon.component` consume el sprite SVG y los archivos oficiales de WhatsApp. Las páginas de especialistas, registro y 404 se cargan bajo demanda.

La FAQ permanece dentro de `home`, con datos identificados y estado de apertura independiente mediante señales. Reutiliza `IconComponent`, los estilos de tarjeta y el CTA existente. Por la instrucción más reciente del propietario se muestran dos columnas desde 1024 px y una por debajo, en lugar de la columna única del documento original. El orden de lectura se conserva por filas. Los botones asocian cada respuesta mediante `aria-expanded`, `aria-controls` y `aria-labelledby`; los paneles comienzan ocultos.

## Contrato de registro

La aplicación utiliza exclusivamente el endpoint Cloud Run configurado en `src/environments/environment*.ts`. No se añadió integración con NestJS, PostgreSQL ni endpoints no verificados de `api.miloficios.pe`.

POST JSON:

| Campo | Contenido |
| --- | --- |
| `fullName` | Nombre, 3–120 caracteres en cliente |
| `phone` | Celular peruano, 9 dígitos empezando por 9 |
| `specialty` | Selección múltiple unida con coma; único nombre admitido por el receptor indicado por el propietario |
| `district` | Distritos de Lima seleccionados, unidos con coma |
| `documentType` | `DNI` o `CE` |
| `numberDocument` | DNI de 8 dígitos o CE alfanumérico de 9–12 |
| `description` | Texto opcional, hasta 1000 caracteres en cliente |
| `consent` | Booleano afirmativo obligatorio, sin premarcar |

Catálogo de 43 distritos obtenido del seed local para la provincia de Lima; no incluye Callao. Las especialidades de captación son las cuatro aprobadas y «Otro».

La zona de atención se busca en ese catálogo local al escribir: coincidencia parcial sin distinguir mayúsculas o tildes. Los resultados aparecen como chips de selección múltiple; sin búsqueda no se despliegan los 43 distritos. Al agregar un distrito se limpia el texto, se ocultan las coincidencias y el foco vuelve al buscador para ingresar otra zona. Los elegidos permanecen en chips aparte y pueden quitarse con «×», devolviendo el foco a la búsqueda. Buscar otro nombre, limpiar el texto o retroceder de paso no elimina la selección. Solo los distritos seleccionados se envían en `district`, unidos por coma; no se consulta Cloud Run al escribir.

Seleccionar «Otro» muestra «¿Qué otro oficio realizas?» en el primer paso. Exige entre 3 y 80 caracteres, sin aceptar solo espacios. Se conserva al retroceder y al desmarcar y volver a marcar «Otro», únicamente en memoria. El envío incorpora el texto recortado dentro de `specialty`, por ejemplo `Gasfitería, Otro: Carpintería`. Si «Otro» no está seleccionado, ese texto no se envía. No se añade un campo a la API ni una columna a Sheets. El parámetro `speciality` de los enlaces de preselección pertenece a la navegación y no se envía como propiedad JSON a Cloud Run.

El cliente requiere un 2xx con `message` no vacío. Tiene timeout de 15 segundos, evita doble envío y no reintenta automáticamente. HTTP 400 permite corregir y 429 permite un intento manual posterior. HTTP 409, errores de red, timeout, 5xx o respuesta inválida mantienen los datos y bloquean el reenvío en esa sesión: Sheets append no ofrece idempotencia. Se ofrece consulta por WhatsApp sin trasladar DNI, teléfono o nombre al enlace.

## Requisitos antes de publicar

1. Desplegar y verificar el receptor Node.js 24 en `../mil-oficios-preregistro`, que usa `specialty`, acepta los nuevos campos y escribe `Hoja1!A:I`. Las columnas A:G conservan el orden anterior; H es tipo de documento e I descripción. Verificar `SHEET_RANGE` si existe una variable de entorno previa con A:G y los encabezados de la hoja. El ZIP de distribución está en la raíz del workspace.
2. Verificar la cuenta de servicio, acceso a la hoja, runtime, revisiones y contrato en un entorno autorizado antes de habilitar el formulario público. Esta implementación no ha desplegado Cloud Run ni escrito en Sheets.
3. Verificar Nginx y el fallback a `index.html` para recargas de rutas. No se modificó la infraestructura ni la configuración de producción.
4. Los perfiles de Instagram, TikTok y Facebook, `info@miloficios.pe` y WhatsApp están confirmados e integrados. El footer omite horario, descripción de marca y cobertura por indicación del propietario. La razón social `CORPORACION MIL OFICIOS S.A.C.` y RUC `20615931528` se comparten entre footer y privacidad mediante `core/business-identity.ts`.
5. Revisar el domicilio y confirmar los destinatarios de datos, los flujos internacionales, los plazos de conservación y la gestión de cookies de la política para clientes, especialistas y visitantes. Confirmar que la operación respalda las promesas comerciales autorizadas del diseño. Para las FAQ, confirmar con negocio que la revisión de especialistas, cobertura de Lima Metropolitana y Callao y gestión de garantías descritas reflejan el proceso vigente, según las precauciones de la especificación.
6. Implementar las páginas futuras confirmadas por el propietario: `/garantia-soporte`, `/terminos-condiciones` y `/libro-de-reclamaciones`. Sus destinos están registrados en `FOOTER_DOCUMENTS`, con `available: false`; sus rótulos no generan enlaces ni navegación hasta disponer de contenido y funcionalidad reales. No se creó un formulario ficticio de reclamaciones.

## SEO, privacidad y seguridad

Títulos, descripción, canonical y Open Graph por ruta; sitemap y robots públicos. Registro y 404 usan `noindex`. Se mantiene renderizado en cliente para conservar el despliegue estático existente: prerender es una mejora pendiente si se necesitan metadatos específicos para rastreadores que no ejecutan JavaScript. No se añadió un servidor SSR sin verificar el hosting.

Los enlaces de WhatsApp de la landing precargan «Hola, vi su web y necesito un especialista.». Al activar un enlace, la etiqueta de Google dirige `whatsapp_cta_clicked` al flujo GA4 `G-SR9FYTSKH5`. El evento incluye `cta_location` y, en las tarjetas de servicios, `service_category`. Sus parámetros no incluyen datos personales. Para analizarlos en los informes de GA4, regístralos como dimensiones personalizadas de evento.

Fotografías WebP con dimensiones, carga diferida fuera del hero y fuentes WOFF2 locales. Se incluyen foco visible, menú por teclado/Escape, enlaces de salto, errores accesibles y preferencia de movimiento reducido.

No hay claves de servicio en el navegador. El receptor usa credenciales de Cloud Run, escritura RAW y errores públicos genéricos. Esta actualización no incorpora una barrera DDoS, rate limiting distribuido, CAPTCHA ni deduplicación persistente; CORS no proporciona esas protecciones. Se requiere una decisión de infraestructura antes de atribuir tales garantías al servicio.

Procedencia y licencias: `public/assets/README.md`. Evidencia de validación: `VALIDACION.md`.
