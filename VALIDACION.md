# Validación de la reconstrucción

Fecha inicial: 31 de octubre de 2026. Última comprobación visual: 1 de noviembre de 2026. Entorno: Windows, Node.js 24.22.2, Angular 21.1.x, Chrome con Playwright.

## Resultados ejecutados

| Comprobación | Resultado |
| --- | --- |
| `npm run build` (producción) | Aprobado sin advertencias, paquete inicial 323,35 kB; presupuestos originales conservados |
| `npm test -- --watch=false` | 17 pruebas aprobadas, 4 archivos, 0 fallos |
| `node e2e/landing.cjs` | Aprobado: 20 combinaciones de 5 rutas por 4 anchos; escenarios funcionales adicionales |
| `node e2e/faq.cjs` | Aprobado: contenido exacto de la especificación, teclado, apertura simultánea, CTA, movimiento reducido y 7 anchos |
| Receptor Node.js 24 | 22 pruebas aprobadas con Sheets simulado, según informe del módulo de preregistro |

Las primeras ejecuciones de Vitest dentro del aislamiento fallaron por permisos sobre temporales, antes de ejecutar pruebas; la ejecución con permisos adecuados pasó. No se modificaron las reglas de pruebas para eludir fallos.

## Cobertura de navegador

- Rutas `/`, `/especialistas`, `/especialistas/registro`, `/privacy` y desconocida, con entrada directa, en 360, 390, 768 y 1440 px: un h1, imágenes cargadas y sin desbordamiento horizontal.
- Los cuatro elementos retirados por el propietario no aparecen. El hero no contiene etiqueta superior ni grupo de insignias. Los iconos de WhatsApp consumen el SVG oficial.
- Menú móvil, cierre con Escape, foco de vuelta y navegación a servicios con cierre de menú y desplazamiento al ancla.
- Enlace «Saltar al contenido»: aparece al recibir Tab y Enter transfiere foco al contenido. Se corrigió su ocultación para evitar superposición en la captura del formulario.
- Formulario: selección múltiple, búsqueda de distritos, regreso al paso anterior conservando campos, estado de envío y confirmación únicamente tras respuesta positiva.
- Contrato HTTP: `speciality` sin alias; DNI, distritos, consentimiento y descripción. Una solicitud en el recorrido exitoso, sin reintento automático.
- Errores 400 y 429 conservan datos y permiten corrección/intento posterior. Error 500 conserva datos y bloquea el reenvío incierto. Vitest cubre además red, respuesta inválida, duplicado, validación de documentos, consentimiento y doble submit.
- No se encontraron errores JavaScript durante el recorrido ni los datos sintéticos del formulario en localStorage/sessionStorage. El servidor de desarrollo puede usar almacenamiento técnico de Vite.

## Evidencia visual

Capturas reales en `e2e/test-output`:

- `landing-390.png` y `landing-1440.png`.
- `registro-paso-1.png`, `registro-paso-2.png` y `registro-confirmacion.png`.
- `report.json`, resumen sin PII de las comprobaciones E2E.

Revisión visual de ambas landing y del paso 2 completada. Se añadió un tono semántico más claro para el texto grande del hero: #7de0d6 sobre #4c5bd4, contraste calculado 3,60:1. Los colores de marca permanecen en los demás acentos y recursos oficiales. No se declara certificación WCAG a partir de estas comprobaciones.

## Límites y condiciones de publicación

Las solicitudes E2E fueron interceptadas; no se realizaron escrituras reales en Sheets ni cambios remotos. La prueba no acredita permisos IAM, CORS o persistencia de la revisión desplegada. Se debe desplegar y verificar primero el receptor Node.js 24 con `speciality` y rango A:I, luego publicar la landing. Si existe `SHEET_RANGE` con A:G, debe ajustarse explícitamente.

Sin despliegue ni cambios de Nginx, DNS, cuentas Google, NestJS o PostgreSQL. No se hizo prueba de carga ni se implementó protección DDoS o idempotencia persistente. Safari/Firefox, lector de pantalla y evaluación exhaustiva de accesibilidad quedan fuera de la evidencia ejecutada.

El propietario confirmó los perfiles de Instagram, TikTok y Facebook, `info@miloficios.pe` y el horario «Todos los días del año»; se incorporaron en el footer. Sigue pendiente la verificación del contenido legal preexistente. Se conserva el Google tag anterior sin agregar eventos. El renderizado continúa en cliente; los metadatos específicos por ruta requieren JavaScript y el fallback de Nginx debe comprobarse antes de publicar.

## Hero — Texto limpio aprobado

Se integró bajo el CTA el mensaje «¿No sabes por dónde empezar? Cuéntanos el problema. Te orientamos.», sin ícono adicional y con el logo de WhatsApp preservado. Build de producción aprobado sin advertencias. Verificación dirigida en Chrome a 360, 390, 768 y 1440 px: alineación con el CTA, texto dentro del hero, sin desbordamiento horizontal ni errores JavaScript. Capturas reales actualizadas en e2e/test-output/landing-390.png y landing-1440.png, más hero-texto-limpio-390.png y hero-texto-limpio-1440.png. No se repitieron las pruebas de registro para este cambio de presentación ni se realizaron envíos a la API.

## Beneficios centrados en escritorio

La cuadrícula de «¿Por qué Mil Oficios?» utiliza columnas ajustadas al contenido y centrado horizontal desde 1024 px. Se conserva la disposición móvil. Chrome: comprobados 360, 390, 768, 1024, 1440 y 1905 px sin desbordamiento; el contenido visible queda centrado con desviación inferior a 1 px en los tres anchos de escritorio. Build aprobado sin advertencias. Capturas en e2e/test-output/beneficios-centrados-390.png, beneficios-centrados-1440.png y beneficios-centrados-1905.png.

## Pasos — Ícono con número aprobado

Los tres pasos de «Así de simple» agrupan ícono y número en un marcador circular de 52 px. El número queda sobre el borde, fuera del dibujo; se conserva el recurso oficial de WhatsApp y la lista ordenada. Se ajustó la curva inferior para mantener el texto sobre el fondo claro. Build aprobado sin advertencias. Verificación dirigida en Chrome a 360, 390, 768, 1024, 1440 y 1905 px: sin solapamientos entre número, ícono y texto; sin desbordamiento; disposición vertical móvil y tres columnas desde 768 px; sin errores JavaScript. Capturas reales en e2e/test-output/pasos-unificados-390.png, pasos-unificados-1440.png y pasos-unificados-1905.png. No se realizaron envíos a la API ni cambios de producción.

## Reseñas — Tres tarjetas visibles en escritorio

Desde 1024 px se muestran los tres testimonios ilustrativos en una cuadrícula fija de tres columnas, con altura uniforme y sin flechas ni indicadores de carrusel. En móvil/tablet se conserva una tarjeta con navegación manual y anuncio de estado. La fotografía sintética existente se usa solo en su tarjeta; las otras muestras tienen un icono de su servicio. Build aprobado sin advertencias. Chrome: comprobados 360, 390, 768, 1024, 1440 y 1905 px; tarjetas visibles y controles adecuados por ancho, sin desbordamiento, navegación móvil con flechas e indicadores, vuelta al primer elemento, teclado y cambio de tamaño correctos; sin errores JavaScript. Capturas en e2e/test-output/resenas-390.png, resenas-1440.png y resenas-1905.png. No se realizaron envíos a la API.

## Footer — Organización, TikTok blanco y retirada del botón flotante

Footer organizado en tres columnas de escritorio (marca/redes, contacto y enlaces), con agrupación adaptable en tablet y una columna móvil. TikTok utiliza la variante blanca oficial, con forma y proporción conservadas. Se retiraron el enlace flotante de WhatsApp, su estilo y el espacio inferior reservado. Se mantienen los cuatro canales sociales, correo y horario confirmados. Build aprobado sin advertencias. Chrome: seis anchos de 360 a 1905 px sin desbordamiento ni errores JavaScript; tres columnas alineadas en escritorio; enlaces internos a privacidad, especialistas y servicios verificados; activo TikTok comprobado con píxeles visibles blancos. Capturas en e2e/test-output/footer-mejorado-390.png, footer-mejorado-1440.png y footer-mejorado-1905.png. No se realizaron envíos a la API ni despliegues.

## Footer con identidad fiscal y altura compacta

Integrada la propuesta aprobada y su ajuste posterior: tres columnas desde 768 px; especialistas bajo marca/redes, soporte bajo contacto y FAQ/privacidad/términos/libro en la tercera columna. Se retiraron descripción, dominio, cobertura y horario del footer; se conserva solo la línea inferior. Identidad compartida: CORPORACION MIL OFICIOS S.A.C., RUC 20615931528; corregidos también esos campos y la fecha en privacidad. Rutas futuras /garantia-soporte, /terminos-condiciones y /libro-de-reclamaciones registradas como no disponibles, sin enlaces ficticios. Build aprobado sin advertencias. Chrome a 360, 390, 768, 1024, 1209, 1440 y 1905 px: sin overflow ni errores; desde 768 px, footer de 327 px de alto y tres columnas en una fila. Verificados navegación interna, identidad consistente en privacidad y objetivos táctiles de al menos 44 px. Capturas en e2e/test-output/footer-compacto-390.png, footer-compacto-1209.png y footer-compacto-1440.png. No se realizaron envíos a API ni despliegues; domicilio y cláusulas legales restantes requieren revisión independiente.

## Footer — Cuatro columnas por responsabilidad

Distribución final solicitada: primera columna solo logo y redes; segunda datos de contacto; tercera Ayuda (FAQ, garantía/soporte y especialistas); cuarta Legal (privacidad, términos y Libro de Reclamaciones). Se preservan identidad fiscal y estado inactivo de documentos pendientes. Cuatro columnas desde 1024 px, dos desde 640 px y una por debajo. Build aprobado sin advertencias. Chrome a 360, 390, 640, 768, 1024, 1209, 1440 y 1905 px: agrupación correcta, sin overflow ni errores, navegación interna verificada. Altura desktop: 293 px. Capturas en e2e/test-output/footer-cuatro-columnas-390.png, footer-cuatro-columnas-768.png y footer-cuatro-columnas-1440.png.

## Banner de especialistas — Composición aprobada

Se integró la propuesta con texto e imagen en proporción 55/45 en escritorio, fotografía sintética más grande, fondo diagonal menta y mensaje «Conecta con nuevas oportunidades de trabajo según tu especialidad y tu zona». El banner mide 330 px de alto en escritorio y se adapta a móvil mediante consultas de contenedor. Se mantiene el CTA «Quiero unirme» hacia /especialistas.

Build de producción aprobado sin advertencias y con los presupuestos originales. Verificación dirigida en Chrome a 320, 360, 390, 640, 768, 1024, 1440 y 1905 px: sin desbordamiento horizontal, CTA dentro del banner y sin obstrucciones, imágenes cargadas y sin errores JavaScript. Navegación por teclado al CTA y apertura de especialistas comprobadas. Revisión visual de capturas reales en e2e/test-output/banner-especialistas-390.png, banner-especialistas-768.png y banner-especialistas-1440.png. No se repitió la suite del formulario para este cambio de presentación ni se realizaron envíos a API o despliegues.

## Qué es Mil Oficios — Presentación y beneficios aprobados

La sección anterior de beneficios ahora presenta «¿Qué es Mil Oficios?» con la descripción aprobada, sin menciones de inteligencia artificial. Integra fotografía sintética identificada como ilustrativa, diagonal de marca y cuatro beneficios: Técnicos verificados, Coordina por WhatsApp, Atención con confianza y Cerca de ti. Se conserva el escudo con check original y el recurso oficial de WhatsApp; el apretón de manos se incorpora al sprite existente desde Lucide, sin dependencia adicional. Se retiran de este bloque Garantía del servicio y Cotización sin costo. El único CTA del bloque queda centrado después de los beneficios y conserva el enlace real de WhatsApp con mensaje predefinido.

Build aprobado sin advertencias. Verificación dirigida en Chrome a 320, 360, 390, 640, 768, 1024, 1440 y 1905 px: sin desbordamiento ni errores JavaScript, texto y recursos correctos, fotografía debajo del texto en móvil y al lado en escritorio. Los beneficios pasan de una a dos y cuatro columnas según el espacio disponible. CTA dentro de la sección y después de los beneficios en todos los anchos; foco de teclado visible y destino, número y mensaje de WhatsApp comprobados sin abrir una conversación. Capturas revisadas en e2e/test-output/conoce-mil-oficios-390.png, conoce-mil-oficios-768.png y conoce-mil-oficios-1440.png; capturas completas de landing actualizadas. La ejecución aislada inicialmente no pudo acceder al servidor local; la comprobación con permisos adecuados pasó. No se repitió la suite de registro para este cambio de presentación ni se realizaron envíos a API o despliegues.

## WhatsApp — Ajuste de color y tamaño en beneficios

El beneficio «Coordina por WhatsApp» reutiliza el contorno oficial mediante una máscara CSS que hereda el mismo azul profundo de los otros tres iconos. Su caja pasa de 25 a 20 px para equilibrar el tamaño visible con los dibujos de línea de 24 px. No se alteran los trazos del logo ni los recursos de WhatsApp utilizados en los CTA y el resto de la landing.

Build aprobado sin advertencias. Comprobados los ocho anchos anteriores, carga del recurso, color calculado RGB(42,47,106), tamaño de 20 px y capturas actualizadas, sin errores JavaScript ni desbordamiento. No se realizaron envíos a API. Se preparó por separado una propuesta visual con fotografía sintética de manos escribiendo una consulta en WhatsApp; el recurso y su prompt están en design/whatsapp-enquiry.webp y design/whatsapp-enquiry-prompt.md. Esa fotografía todavía no sustituye la del técnico en Angular.

## Imagen de contacto — WhatsApp con Isotipo 1

Integrada en «¿Qué es Mil Oficios?» la fotografía sintética de manos con un celular escribiendo a Mil Oficios por WhatsApp. El perfil circular usa como referencia el archivo indicado por el propietario: Identidad Digital/1.LOGO/JPG/Isotipo 1.png, con símbolo blanco y menta sobre fondo violeta. El nombre permanece en la cabecera; la escena muestra un borrador sin enviar y se identifica como «Conversación ilustrativa». Recurso activo: public/assets/photos/whatsapp-contact-isotipo.webp, 800 × 965 px, 101.432 bytes, con transparencia. Prompt final conservado en design/whatsapp-contact-isotipo-prompt.md. Las variantes anteriores quedan como referencia.

Build aprobado sin advertencias con los presupuestos originales. Chrome a 320, 360, 390, 640, 768, 1024, 1440 y 1905 px: recurso cargado, imagen dentro de su contenedor y sin desbordamiento; altura de 300 px en móvil y 380 px en escritorio/tablet. Se verificaron disposición, beneficios, color/tamaño del icono de WhatsApp, CTA y foco de teclado, sin errores JavaScript. Revisión visual del avatar y capturas reales de 390 y 1440 px completada; capturas de sección y landing actualizadas en e2e/test-output. No se repitió la suite de registro para este cambio visual ni se enviaron mensajes, solicitudes a la API o despliegues.

## Imagen de contacto — Interior del hogar

Se completó el fondo doméstico planteado: sala suavemente desenfocada detrás de las manos y el celular, conservando el Isotipo 1 en el perfil. Se mantiene la etiqueta «Conversación ilustrativa». Recurso activo: public/assets/photos/whatsapp-home-isotipo.webp, 800 × 965 px, 92.164 bytes. Se conserva la variante transparente como referencia y se documenta el prompt de fondo en design/whatsapp-home-isotipo-prompt.md.

Build aprobado sin advertencias. Comprobación dirigida en Chrome en los mismos ocho anchos de 320 a 1905 px: imagen cargada y contenida, disposición responsive, CTA y foco conservados, sin desbordamiento ni errores JavaScript. Capturas de escritorio y móvil revisadas y actualizadas. No se realizaron envíos a la API, mensajes de WhatsApp ni despliegues.

## Mujer solicitando ayuda — Diagonal de sección aprobada

1 de noviembre de 2026. Integrada la propuesta aprobada con la mujer solicitando ayuda por WhatsApp junto al grifo y un plano violeta que recorre el fondo completo de «¿Qué es Mil Oficios?». En móvil se reduce a un acento lateral. La fotografía conserva el encuadre 4:3 y el Isotipo 1 en el perfil del chat; se retiran la placa menta anterior y toda leyenda visible de la imagen por solicitud expresa del propietario. La procedencia sintética permanece en el texto alternativo y en la documentación. Recurso activo: public/assets/photos/woman-whatsapp-help.webp, copia de la propuesta aprobada, 800 × 600 px y 80.760 bytes.

Build aprobado sin advertencias, conservando los presupuestos originales y el CSS del componente en 3.644 bytes. Chrome a 320, 360, 390, 640, 660, 661, 768, 1024, 1440 y 1905 px: fotografía cargada y sin recortes, diagonal del tamaño de la sección, adaptación en el punto de cambio, ausencia de leyenda, sin desbordamiento ni errores JavaScript. Comprobados beneficios, enlace real de WhatsApp, CTA centrado y sin obstrucciones; foco blanco visible sobre ambos fondos. Capturas de sección a 390, 768 y 1440 px y de landing completa a 390 y 1440 px actualizadas y revisadas. Se reinició el servidor de desarrollo en la misma dirección para incorporar el archivo nuevo. No se repitió la suite de registro para este cambio visual ni se enviaron mensajes, solicitudes a API o despliegues.

## FAQ — Especificación implementada y distribución responsive

1 de noviembre de 2026. Sustituidas las tres preguntas existentes por las ocho de MIL_OFICIOS_LANDING_FAQ_IMPLEMENTACION.md, respetando literalmente contenido y orden. Se añaden el subtítulo y el cierre «¿Aún tienes dudas?» con «Solicitar un especialista», que reutiliza contactUrl y el mismo destino del CTA principal. Dos columnas desde 1024 px y una por debajo, siguiendo la indicación más reciente del propietario sobre la columna única del documento. Se conservan los componentes y estilos existentes; se retiran únicamente los selectores obsoletos del acordeón anterior. No se modifican rutas, formularios ni integraciones.

Los acordeones usan botones nativos con controles y paneles asociados, foco visible y flecha de estado. Todos comienzan cerrados y mantienen aperturas independientes. Dos pruebas de componente verifican la asociación accesible inicial y que cerrar un panel conserva el otro abierto. Vitest: 17 pruebas aprobadas en cuatro archivos. La primera ejecución aislada falló por permisos EPERM sobre temporales antes de ejecutar pruebas; la ejecución con permisos adecuados aprobó. No se alteraron las comprobaciones para eludir esa limitación.

Build de producción aprobado sin advertencias: 323,36 kB iniciales; CSS de Home 3.359 bytes; presupuestos originales conservados y sin dependencias nuevas. Regresión E2E existente aprobada: 20 combinaciones de rutas y anchos más navegación, contrato del formulario y errores simulados. E2E FAQ a 320, 360, 390, 768, 1023, 1024 y 1440 px: las ocho preguntas y respuestas coinciden exactamente con el Markdown; teclado Enter/Espacio, cierre y apertura simultánea correctos; respuestas cerradas ocultas del árbol accesible; columnas correctas, sin desbordamiento ni errores JavaScript; movimiento reducido y CTA compartido verificados. El script espera que Angular actualice el DOM antes de comprobar el estado tras las pulsaciones.

Evidencia revisada: e2e/test-output/faq-cerradas-390.png, faq-cerradas-1440.png, faq-abiertas-390.png, faq-abiertas-1440.png y faq-report.json. Las capturas completas de landing y report.json se actualizaron con la regresión general. No se enviaron mensajes ni se escribieron datos reales en Sheets. No hay script de lint configurado. Antes de publicar queda la confirmación de negocio indicada en el documento sobre revisión de especialistas, cobertura y garantías; la prueba no verifica esos procesos operativos. No se realizó despliegue.

## Botones de servicios — Solicitar un especialista

Los cuatro botones de servicios sustituyen «Solicitar por WhatsApp» por «Solicitar un especialista». El nombre accesible incorpora la especialidad y conserva el texto visible como prefijo. Se mantienen los enlaces y mensajes contextuales existentes de WhatsApp. Build aprobado sin advertencias y comprobación dirigida en Chrome a 320, 360, 390, 768 y 1440 px: texto completo dentro del botón, sin solapamiento con la flecha, sin desbordamiento ni errores JavaScript. Capturas en e2e/test-output/servicios-cta-390.png y servicios-cta-1440.png. No se repitieron las suites del formulario para este cambio de texto ni se enviaron mensajes a WhatsApp o solicitudes a la API.

## Especialistas — Propuesta integrada y accesos por especialidad

1 de noviembre de 2026. Implementada la página de captación aprobada: hero con diagonal y fotografía existente, beneficios, especialidades, proceso de evaluación, seis FAQ independientes y cierre de registro. Se reutilizan tokens, fuentes, botones, iconos y footer de cuatro columnas. El encabezado de esta ruta prioriza el registro, con menú desplegable hasta 1023 px; la navegación de clientes se conserva en la home.

La sección «¿Cuál es tu especialidad?» contiene Gasfitería, Electricidad, Línea blanca, Pintura y «Otro oficio». Cada tarjeta es un único enlace accesible a /especialistas/registro?speciality=..., sin controles anidados. En escritorio desde 1024 px hay cinco columnas; de 768 a 1023 px hay tres; por debajo hay dos y «Otro oficio» ocupa una fila compacta completa. Se omiten las filas inferiores «Lima Metropolitana» y «Ten a mano tus datos» de la propuesta: la cobertura permanece en el hero y los requisitos en las FAQ.

El formulario acepta como preselección inicial solo un valor exacto del catálogo vigente en el parámetro speciality; ignora valores desconocidos, vacíos, repetidos y el alias specialty. «Otro oficio» corresponde al valor existente «Otro». La selección puede modificarse o ampliarse, se conserva al retroceder entre pasos y no premarca consentimiento ni considera datos personales editados por abrir el enlace. No se modifican el contrato de envío, backend, base de datos ni dependencias.

Archivos de implementación modificados en esta entrega:
- src/app/features/specialists/specialists.component.ts
- src/app/features/specialists/specialists.component.html
- src/app/features/specialists/specialists.component.css
- src/app/features/registration/registration.component.ts
- src/app/features/registration/registration.component.spec.ts
- src/app/layout/layout.component.ts
- src/app/layout/layout.component.html
- e2e/specialists.cjs (nuevo)
- VALIDACION.md

Validación: build de producción aprobado sin advertencias, 327,29 kB iniciales, conservando los presupuestos originales de JavaScript y CSS. Vitest: 28 pruebas aprobadas en cuatro archivos, incluidas once nuevas sobre preselección y edición. El primer intento aislado falló antes de ejecutar pruebas por EPERM al renombrar temporales; la ejecución con permisos adecuados aprobó sin alterar las comprobaciones. Chrome: ocho anchos (320, 360, 390, 640, 768, 1023, 1024 y 1440 px), cinco accesos por teclado, correspondencia de oficio preseleccionado, apertura independiente de FAQ, foco, menú móvil, edición de la multiselección y conservación de datos en ambos pasos. Regresión general: 20 combinaciones de rutas y anchos, navegación y escenarios de error del formulario aprobados. Sin desbordamiento horizontal ni errores JavaScript. Todos los envíos de prueba se interceptaron; no se escribieron datos reales en Sheets ni se desplegó producción.

Evidencia actualizada y revisada: e2e/test-output/especialistas-390.png, especialistas-1440.png, especialidades-390.png, especialidades-1440.png y especialistas-report.json. La regresión también actualiza las capturas y report.json existentes. La maqueta de conversación queda como referencia de diseño; la versión implementada puede probarse en http://127.0.0.1:4200/especialistas.

### Ajuste de mensajes del hero y evaluación

Retirados del hero el enlace secundario «Cómo funciona» y la nota de evaluación por indicación del propietario. Se conserva la aclaración en «Así comienza tu registro» y las FAQ. En el segundo paso del formulario se añade, antes de las acciones de envío: «Tu solicitud estará sujeta a evaluación. Enviarla no implica aceptación en la red ni verificación completada». El botón de envío referencia ese texto mediante aria-describedby; el aviso no aparece en el primer paso. La confirmación existente conserva su aclaración. Cambios en specialists.component.html, specialists.component.css y registration.component.html, además de esta documentación.

Build final aprobado sin advertencias. Comprobación dirigida en Chrome a 390 y 1440 px: ausencia del aviso en el hero, conservación en el proceso, aparición antes del botón de envío únicamente en el paso dos, asociación accesible y ausencia de desbordamiento. No se enviaron formularios ni se repitieron las pruebas unitarias para este ajuste de contenido.

### Proceso de especialistas — Contenido centrado por columna

Centrados ícono con número, título y descripción de cada paso en las tres columnas desde 768 px, utilizando utilidades responsive existentes en specialists.component.html. El ícono se coloca encima del texto y se limita el ancho de lectura a 290 px. En móvil se conserva el recorrido vertical con ícono lateral y texto a la izquierda. El título de sección y la aclaración de evaluación conservan su alineación.

Build aprobado sin advertencias: 327,44 kB iniciales. Chrome a 390, 768, 1024, 1440 y 1905 px: centros de ícono y texto a menos de 0,01 px del eje de cada columna, tres columnas desde 768 px y una debajo, sin desbordamiento ni errores JavaScript. Capturas revisadas en e2e/test-output/proceso-centrado-1440.png y proceso-centrado-390.png. No se añadieron pruebas unitarias para este ajuste de alineación.

## Testimonios — Dos retratos sintéticos y contenido de ejemplo

Retirado el subtítulo «Testimonios ilustrativos de la propuesta» indicado por el propietario. Las tarjetas de electricidad y pintura sustituyen los iconos por dos retratos sintéticos independientes generados con image_gen. Se añaden recomendaciones de ejemplo, nombres ficticios, distritos y especialidad. Las tres tarjetas conservan sample: true y la indicación visible «Reseña ilustrativa», además del texto alternativo y los nombres accesibles de las estrellas y los controles. No son reseñas verificadas. Se mantiene el diseño de tres tarjetas en escritorio y carrusel en móvil.

Archivos modificados: src/app/core/content.ts y src/app/home/home.component.html. Nuevos recursos finales: public/assets/photos/testimonial-carlos-illustration.webp (384 × 384, 18.306 bytes) y public/assets/photos/testimonial-patricia-illustration.webp (384 × 384, 20.566 bytes). Prompts finales y procedencia en design/testimonial-portraits-prompts.md. Se conserva el primer retrato existente. La plantilla usa las tres fotografías directamente y elimina la rama de iconos que quedó obsoleta.

Build aprobado sin advertencias, 327,55 kB iniciales. Vitest: 28 pruebas aprobadas en cuatro archivos. Chrome a 320, 390, 768, 1024 y 1440 px: tres imágenes cargadas, avatares uniformes de 76 × 76, subtítulo retirado, etiquetas ilustrativas presentes, tres tarjetas visibles desde 1024 px y una debajo. Verificados teclado en indicadores y avance/retroceso circular del carrusel. Sin desbordamiento horizontal ni errores JavaScript. Capturas de escritorio y móvil revisadas: e2e/test-output/testimonios-1440.png y testimonios-390.png; informe en testimonios-report.json. No se enviaron solicitudes reales ni se desplegó producción.

Ajuste posterior solicitado por el propietario: retirados «Reseña ilustrativa» y su separador de los tres pies de tarjeta, dejando únicamente la especialidad en esa línea. Se conserva el origen ficticio en los datos y la documentación. Build final aprobado sin advertencias, 327,45 kB iniciales. No se repitieron las pruebas unitarias ni la revisión de carrusel para este cambio de texto; las capturas anteriores corresponden a la versión con etiqueta.

## Registro — Campo condicional para otro oficio

1 de noviembre de 2026. Implementada la propuesta aprobada: al seleccionar «Otro» aparece «¿Qué otro oficio realizas?» debajo de las especialidades. Campo obligatorio de 3 a 80 caracteres, sin aceptar solo espacios; error asociado al input, etiqueta y ayuda accesibles, sin cambiar el foco al marcar la casilla. La entrada desde la tarjeta «Otro oficio» también muestra el campo inicialmente vacío. Se oculta al desmarcar y conserva el texto en memoria para una nueva selección o al retroceder entre pasos. Sin «Otro» seleccionado, el texto oculto no bloquea el registro ni se envía.

El oficio recortado se incorpora en el campo existente speciality, por ejemplo «Gasfitería, Otro: Carpintería». No se añaden propiedades al POST, columnas a Sheets, dependencias ni endpoints. Se conserva description para la experiencia opcional del segundo paso. La respuesta positiva limpia el campo; una respuesta de error conserva su contenido. No se modifica ni se despliega el receptor Cloud Run. Actualizada la FAQ de especialistas para explicar el nuevo campo del primer paso.

Archivos modificados: src/app/features/registration/registration.component.ts, registration.component.html y registration.component.spec.ts; src/app/features/specialists/specialists.component.ts; README.md; VALIDACION.md. Nuevo script e2e/other-speciality.cjs.

Validación final: build aprobado sin advertencias, 325,66 kB iniciales y registro lazy de 64,23 kB. Vitest: 33 pruebas aprobadas en cuatro archivos, incluidas cinco nuevas sobre validación condicional, conservación, envío, exclusión de datos ocultos y rechazo 422. E2E dirigido en Chrome a 320, 360, 390, 768, 1024 y 1440 px: aparición y ocultación, teclado, errores, preselección, retención entre pasos y reintento después de rechazo simulado. El script espera que Angular retire el campo antes de comprobar su ausencia. Envíos de prueba interceptados: el POST contiene «Otro: Carpintería, Pintura» en speciality y conserva la descripción. No hay otros nombres de campo, datos en localStorage/sessionStorage, desbordamiento ni errores JavaScript.

Regresión general aprobada: 20 combinaciones de rutas y anchos más escenarios de navegación y error del registro. Regresión de especialistas aprobada: ocho anchos, cinco enlaces de entrada, FAQ, menú y multiselección. Capturas revisadas en e2e/test-output/registro-otro-390.png y registro-otro-1440.png; informe en registro-otro-report.json. Todas las respuestas de Cloud Run fueron simuladas, sin escrituras reales en Sheets ni despliegue de producción.

### Corrección posterior: Cloud Run recibe specialty

El propietario confirmó el nombre `specialty` para el JSON del servicio desplegado. El payload y su interfaz ahora usan exclusivamente `specialty`; no se envía `speciality`. El oficio escrito continúa dentro de ese texto, por ejemplo «Gasfitería, Otro: Carpintería». Los nombres internos del formulario y el parámetro de navegación de preselección siguen siendo independientes del JSON. Se actualizan las pruebas HTTP, las de componente, los tres scripts E2E y el README.

También se alinea la copia local del receptor Node.js 24, su documentación, pruebas y ZIP de distribución. La columna C de Sheets conserva su posición y la escritura RAW. El receptor local rechaza un cuerpo que solo incluya el nombre anterior. No se realizó despliegue remoto ni escritura real en Sheets.

Validación del contrato corregido: build sin advertencias, 33 pruebas de landing y 23 del receptor en Node.js v24.22.2 aprobadas. Pasaron nuevamente la regresión de 20 combinaciones de rutas/anchos, los ocho anchos de especialistas y el campo «Otro» en seis anchos, con respuesta de rechazo 422 y posterior éxito simulados. Las comprobaciones de POST verifican specialty y ausencia de speciality. Informes E2E actualizados.

## Registro — Búsqueda de distritos con chips

1 de noviembre de 2026. La búsqueda del segundo paso actualiza chips de coincidencias parciales conforme se escribe, usando el catálogo local de 43 distritos y normalización de tildes y mayúsculas. «sur» muestra Santiago de Surco y Surquillo; «surc» solo Santiago de Surco. Sin texto se muestra una ayuda para buscar, en lugar de desplegar todo el catálogo. Los resultados usan casillas nativas dentro de chips con foco visible y objetivos táctiles de al menos 44 px. Se conserva la selección múltiple.

Los distritos elegidos aparecen aparte con botones «Quitar [distrito]». Cambiar o limpiar la búsqueda no elimina selecciones; quitar una zona devuelve el foco a la búsqueda. Se conservan los datos al retroceder. Hay contador de coincidencias, contador de selección y estados sin resultados accesibles. Durante envío o bloqueo los controles no pueden modificar el formulario. Solo los elegidos se serializan en el campo district existente. No hay nuevas llamadas a Cloud Run, columnas de Sheets ni dependencias.

Archivos modificados: src/app/features/registration/registration.component.ts, registration.component.html, registration.component.css y registration.component.spec.ts; README.md; VALIDACION.md. Nuevo e2e/district-chips.cjs. Ajustada también la espera del script e2e/other-speciality.cjs para comprobar el estado del botón después de que Angular actualice el DOM.

Vitest: 35 pruebas aprobadas en cuatro archivos. E2E dirigido a 320, 360, 390, 768, 1024 y 1440 px: coincidencias al editar, tildes/mayúsculas, selección por teclado, chips persistentes, eliminación y devolución de foco, ausencia de coincidencias y retención entre pasos. Envío simulado con district «Miraflores, Santiago de Surco», specialty «Gasfitería» y controles bloqueados durante el envío. Sin desbordamiento ni errores JavaScript. Regresión general: 20 combinaciones de rutas y anchos aprobadas. Regresión de «Otro» con rechazo 422 y éxito simulados aprobada. Capturas revisadas: e2e/test-output/distritos-chips-390.png y distritos-chips-1440.png; informe en distritos-chips-report.json. Build final sin advertencias, 326,61 kB iniciales. No se enviaron registros a Sheets ni se desplegó producción.

### Restablecimiento al elegir un distrito

Al agregar un distrito se vacía districtSearch, se retiran los chips de coincidencia y el foco vuelve al textbox. Los chips seleccionados permanecen y pueden seguir quitándose con «×». El cambio se aplica únicamente al agregar distritos, sin afectar la selección de especialidades ni borrar otras zonas. Se actualizan registration.component.ts, su prueba de componente, README y las comprobaciones E2E.

Validación final: 36 pruebas unitarias aprobadas y build sin advertencias. En navegador, el restablecimiento y la devolución de foco pasaron con clic y teclado en los seis anchos del script de distritos. También aprobaron las regresiones de 20 combinaciones de rutas/anchos, ocho anchos de especialistas y seis del oficio personalizado. Las pruebas de selección esperan ahora el chip elegido: la casilla de coincidencia desaparece por diseño tras agregar el distrito. Capturas e informe de distritos actualizados, sin escrituras reales a Sheets ni despliegue de producción.

## Auditoría de publicación del 16 de noviembre de 2026

**Veredicto: la versión está lista para revisión en un entorno de pruebas. La publicación queda pendiente de corregir los hallazgos y verificar el registro en la infraestructura de destino.**

| Validación | Resultado |
| --- | --- |
| Build de producción con Node.js 24.22.2 | Aprobado sin advertencias. 330,09 kB iniciales y 87,42 kB de transferencia estimada. |
| Pruebas automatizadas | 36 de la landing y 23 del receptor local aprobadas. Pasaron las cinco suites E2E contra el build estático local con Cloud Run simulado. Cubren 20 combinaciones generales de rutas y anchos, navegación, casos de éxito y error del registro, FAQ, preselección de oficios, «Otro» y chips de distritos. |
| Registro integrado | El formulario del build se conectó al handler local con Sheets simulado. Generó una única fila A:I con escritura RAW, documento con ceros iniciales y el oficio personalizado. La confirmación apareció después de la respuesta de éxito. |
| WhatsApp, privacidad y SEO | Los 10 enlaces de la portada contienen el texto aprobado. El script real de Google generó el evento de prueba con el destino GA4 correcto y los parámetros de ubicación y servicio. Se interceptó el envío. La ruta de privacidad, la redirección local desde /privacy, el correo, robots.txt y el sitemap del build pasaron. |
| Accesibilidad y revisión visual | Revisadas las capturas de portada a 390 y 1440 px. Axe 4.14.1 detectó la misma discrepancia entre el nombre accesible y el texto visible en cinco tarjetas de especialidades a ambos anchos. Quedaron comprobaciones manuales de contraste en inicio y especialistas. El resto de estados probados no presentó infracciones automáticas. |
| Auditoría de dependencias de producción | npm audit identificó seis paquetes Angular con severidad alta en el lockfile de la landing. Angular core está en 21.1.2. Algunos avisos corresponden a SSR, que no usa este build. El audit del receptor local informó cero vulnerabilidades. |

Hallazgos que deben resolverse antes de publicar:

1. **Testimonios.** La portada presenta tres relatos de muestra, retratos sintéticos y cinco estrellas bajo «Lo que dicen nuestros clientes». Retirar ese bloque para producción o sustituirlo por reseñas reales y autorizadas. Confirmar también las afirmaciones de verificación, atención y cobertura con el equipo que presta el servicio. [Decreto Legislativo 1044, artículo 8](https://cdn.www.gob.pe/uploads/document/file/2325241/Decreto%20Legislativo%201044.pdf.pdf)
2. **Enlaces legales.** «Libro de Reclamaciones», «Términos y condiciones» y «Garantía y soporte» aparecen sin destino habilitado. Confirmar el alcance legal aplicable al flujo por WhatsApp y habilitar un Libro de Reclamaciones operativo para el servicio cuando corresponda. Los términos y el soporte deben corresponder al contenido aprobado. [Ley 32495](https://busquedas.elperuano.pe/dispositivo/NL/2457203-1)
3. **Privacidad y analítica.** El build genera page_view de Google Ads y GA4 al cargar la página y el código revisado no ofrece un mecanismo de preferencias de cookies. Validar el tratamiento de DNI, domicilios y material audiovisual de clientes, el plazo de conservación, los destinatarios y el consentimiento de analítica que corresponda. [Ley 29733, artículo 18](https://www.congreso.gob.pe/Docs/DGP/DIDP/files/ley_29733.pdf) · [Reglamento de protección de datos](https://www.gob.pe/institucion/anpd/normas-legales/6554453-16-2024-jus)
4. **Cloud Run y Sheets.** El receptor público respondió 204 al preflight, con Access-Control-Allow-Origin abierto, y 405 a GET. Se requiere verificar la revisión remota, la cuenta de servicio, la escritura real con datos sintéticos en una hoja de pruebas y las columnas H/I. El código local no limita solicitudes ni deduplica de forma persistente. Validar las medidas contra abuso antes de abrir el formulario. La auditoría no envió registros reales a Google Sheets.
5. **Hosting y dominio canónico.** El sitio público actual redirige www.miloficios.pe a miloficios.pe. El sitemap y las rutas directas /especialistas/registro y /politicas-privacidad respondieron 404 en el sitio desplegado. El build revisado funcionó al aplicar fallback a index.html en un servidor de prueba. Configurar y verificar ese comportamiento en el hosting de destino. Alinear la URL canónica, Open Graph, robots.txt y sitemap con el dominio elegido. Verificar recargas, recursos estáticos y HTTPS después de preparar el hosting.
6. **Angular y accesibilidad.** Actualizar Angular dentro de la versión principal 21 a una versión con parches y repetir el audit y las pruebas. Corregir la discrepancia de etiquetas de las tarjetas y completar las comprobaciones manuales. [Ejemplo de aviso de Angular](https://github.com/angular/angular/security/advisories/GHSA-hh8m-fm6v-7cvg) · [WCAG 2.2, etiqueta en el nombre](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html)

Los informes E2E, las capturas y la salida de axe quedaron en e2e/test-output. Esta auditoría registra el estado de la copia local y comprobaciones públicas de solo lectura. El veredicto de publicación requiere repetir las pruebas sobre el build corregido y verificar el recorrido completo en el entorno de destino.
