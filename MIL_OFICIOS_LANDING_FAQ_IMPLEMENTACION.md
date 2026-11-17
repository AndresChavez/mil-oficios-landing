# Mil Oficios — Implementación de preguntas frecuentes (FAQ) en la landing

**Estado:** Especificación lista para implementar  
**Alcance:** Sección «Preguntas frecuentes» de la landing pública de Mil Oficios (`www.miloficios.pe`).  
**Objetivo:** Reducir objeciones, generar confianza y facilitar la conversión de visitantes en solicitudes de servicio.

## 1. Instrucciones para el agente implementador

1. Revisar la implementación actual de la landing y localizar la sección existente «Preguntas frecuentes». **Modificar la sección existente**; no crear una sección duplicada.
2. Conservar la identidad visual, tipografía, espaciado, paleta, bordes y patrones de interacción ya empleados en el proyecto. La captura de referencia utiliza acordeones blancos de borde suave con una flecha a la derecha.
3. Reemplazar las tres preguntas actuales por las **ocho preguntas y respuestas** del apartado 2, respetando su orden y contenido.
4. Implementar acordeones accesibles, responsive y navegables por teclado. Por defecto, todos deben comenzar cerrados; se pueden abrir varios al mismo tiempo.
5. Colocar debajo de los acordeones un bloque de cierre con texto y CTA según el apartado 3. **Reutilizar el destino y la lógica del CTA principal de solicitud de especialista ya existente en la landing**; no inventar una URL o un número de WhatsApp.
6. Utilizar el stack y los componentes del repositorio (Angular/Tailwind si están configurados); no agregar librerías sin necesidad. Mantener preguntas y respuestas en una estructura de datos fácil de mantener y renderizar.
7. No modificar rutas, formularios, integraciones ni otras secciones fuera del alcance, salvo lo imprescindible para lograr una integración visual consistente.

## 2. Contenido definitivo y orden de visualización

### FAQ-01 — ¿Cuánto cuesta solicitar una cotización?

Puedes enviarnos tu solicitud sin compromiso. Si el especialista necesita realizar una visita técnica para evaluar el trabajo, te informaremos previamente si tiene algún costo y cuáles son sus condiciones.

### FAQ-02 — ¿Cómo funciona Mil Oficios?

Cuéntanos qué trabajo necesitas, en qué distrito y cuándo te gustaría realizarlo. Te ayudaremos a encontrar especialistas que puedan atender tu solicitud para que elijas la opción que mejor se adapte a tus necesidades.

### FAQ-03 — ¿Cómo sé que el especialista es confiable?

En Mil Oficios buscamos trabajar con especialistas que pasan por un proceso de revisión de información y experiencia. Te compartiremos los datos disponibles del especialista para ayudarte a tomar una decisión informada.

### FAQ-04 — ¿Qué tan rápido responden?

Revisamos tu solicitud para ayudarte a encontrar un especialista disponible. El tiempo de respuesta puede variar según el tipo de trabajo, la ubicación y la disponibilidad de nuestros especialistas.

### FAQ-05 — ¿Puedo elegir al especialista que realizará el trabajo?

Sí. Cuando encontremos especialistas disponibles, te presentaremos las alternativas para que puedas elegir con quién deseas coordinar el servicio.

### FAQ-06 — ¿Qué sucede si tengo un problema después del servicio?

Puedes comunicarte con Mil Oficios para reportar lo ocurrido. Revisaremos tu caso y te orientaremos sobre las condiciones de garantía o solución que correspondan al trabajo realizado.

### FAQ-07 — ¿Qué tipos de servicios puedo solicitar?

Puedes solicitar servicios de gasfitería, electricidad, carpintería, pintura, melamina, drywall, reparación de electrodomésticos y otros trabajos de mantenimiento o mejora del hogar.

### FAQ-08 — ¿En qué distritos atienden?

Recibimos solicitudes en Lima Metropolitana y Callao. La atención dependerá de la disponibilidad de especialistas que cubran tu distrito.

## 3. Encabezado y cierre comercial

**Título de la sección:** Preguntas frecuentes  
**Subtítulo:** Resolvemos tus dudas para que contrates con tranquilidad.

**Bloque posterior a los acordeones:**

- **Título:** ¿Aún tienes dudas?
- **Descripción:** Cuéntanos qué necesitas y te ayudaremos a encontrar un especialista para tu hogar.
- **Texto del CTA:** Solicitar un especialista
- **Acción:** Ejecutar la misma navegación/acción que el CTA principal existente de la landing.

## 4. Comportamiento UX/UI

- Presentar ocho filas de acordeón en una sola columna, manteniendo la anchura del contenedor actual.
- Estado inicial: todas las preguntas cerradas.
- Al activar una pregunta, desplegar su respuesta debajo del título dentro del mismo panel; al activarla nuevamente, cerrarla.
- Permitir que varias respuestas permanezcan abiertas simultáneamente.
- Mantener el indicador de despliegue a la derecha y cambiar su orientación/estado de forma coherente.
- Las respuestas deben tener espaciado y contraste suficientes; evitar bloques densos.
- Respetar el diseño adaptable en móvil, tablet y escritorio; evitar desbordes horizontales y saltos de layout innecesarios.
- Respetar `prefers-reduced-motion` si se usan animaciones.
- Accesibilidad: controles `<button>` semánticos o equivalentes, `aria-expanded`, asociación con el panel mediante `aria-controls`, foco visible y funcionamiento con Enter/Espacio.

## 5. Criterios de aceptación / QA

- [ ] La landing muestra exactamente ocho FAQ, en el orden del apartado 2.
- [ ] El contenido de cada pregunta y respuesta coincide con esta especificación, sin cambiar promesas comerciales.
- [ ] Los acordeones se abren y cierran correctamente; permiten varias preguntas abiertas.
- [ ] Los acordeones son utilizables con teclado y lectores de pantalla.
- [ ] El diseño se ve correctamente en desktop y mobile, sin scroll horizontal ni textos truncados.
- [ ] Se conserva la consistencia visual con la sección FAQ anterior y el resto de la landing.
- [ ] El CTA final utiliza el flujo existente para solicitar un especialista.
- [ ] No se introducen dependencias nuevas innecesarias ni errores de compilación/lint.
- [ ] El agente entrega resumen de archivos modificados y evidencia de las verificaciones que pudo ejecutar.

## 6. Precauciones editoriales y de negocio

Estas respuestas están formuladas deliberadamente sin prometer disponibilidad inmediata, precios fijos, certificaciones universales de especialistas ni garantías de duración determinada. **No introducir afirmaciones de ese tipo** sin validación del responsable de Mil Oficios.

Antes de publicar, confirmar con negocio que las descripciones de revisión de especialistas, cobertura geográfica y gestión de garantías reflejan el proceso operativo vigente. Si alguna afirmación no está sustentada, reportarla como punto pendiente en vez de inventar una política.

## 7. Fuera de alcance

- Crear o modificar APIs de solicitudes.
- Cambiar la experiencia de WhatsApp Flows.
- Rediseñar por completo la landing.
- Incorporar nuevas funcionalidades de marketing, tracking o chat.
