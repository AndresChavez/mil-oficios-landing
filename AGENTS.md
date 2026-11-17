# AGENTS.md — Mil Oficios Landing (reconstrucción desde cero)

## 1. Propósito y alcance

Construir **desde cero la experiencia de la landing pública de Mil Oficios** utilizando las dos referencias visuales proporcionadas por el propietario del proyecto. No se trata de una migración visual gradual de Bootstrap ni de reproducir el sitio actual sección por sección. Se permite reutilizar el repositorio, infraestructura, activos legítimos y contratos existentes, pero la UI se diseña e implementa nuevamente con una arquitectura limpia.

Objetivos de producto:
- **Clientes:** comprender la propuesta de valor, conocer los servicios y solicitar atención/cotización por WhatsApp.
- **Especialistas:** descubrir la oportunidad, registrarse, escoger especialidades y distritos, enviar datos para evaluación y recibir confirmación de recepción.
- Cobertura inicial: Lima Metropolitana.
- El éxito se mide por solicitudes y registros válidos, no solo por la apariencia.

## 2. Fuentes de verdad y referencias

Referencias visuales entregadas (rutas relativas al workspace, verificar ubicación real antes de usarlas):
- `mil-oficios-landing-propuesta-gpt-1.jpeg`: landing móvil completa, distribuida en dos vistas largas del mismo recorrido.
- `mil-oficios-landing-especialistas-registro-propuesta-gpt-1.jpeg`: registro de especialistas con paso 1, paso 2 y confirmación, mostrados juntos para explicar el flujo; **en producto serán vistas secuenciales, no tres columnas simultáneas**.

Tomarlas como **guía visual, no como especificación literal ni como prueba de funcionamiento**. Respetar el lenguaje visual, el orden de secciones, la progresión, las diagonales y la jerarquía de CTA. Ajustar proporciones, accesibilidad y responsive con criterio profesional.

Antes de implementar, leer: este archivo, el `AGENTS.md` superior, los assets oficiales (logo/manual), los contratos reales de API y el código pertinente del repositorio. En caso de conflicto de identidad, prevalece el manual de marca oficial. Nunca inventar logotipos ni usar personajes/fotografías de referencia como activos finales sin derechos y autorización.

## 3. Stack tecnológico obligatorio (objetivo)

- Angular 21 y TypeScript (conservar la base Angular existente, salvo aprobación explícita para actualizar).
- **Tailwind CSS v4** para la nueva capa de presentación; CSS para estilos globales puntuales y efectos no expresables de manera clara con utilidades.
- Angular Router para rutas públicas.
- Angular Reactive Forms para registro y validación.
- Componentes Angular standalone cuando encajen con el proyecto y convenciones actuales.
- Tailwind `@theme` para tokens visuales; no utilizar por defecto la configuración obsoleta de Tailwind v3.
- SVG accesibles para iconos; evaluar Lucide solo si aporta valor y se aprueba la dependencia.
- Vitest para pruebas unitarias (ya declarado); Playwright como opción a incorporar para E2E y capturas responsive, previa evaluación.
- Despliegue compatible con el hosting existente DigitalOcean + Nginx + HTTPS; verificar configuración real antes de modificarla.
- Integración con `https://api.miloficios.pe` **solo a través de endpoints verificados**.

### Estado actual vs objetivo

Los `package.json` y `angular.json` compartidos muestran Angular 21.1.x, Bootstrap 5.3.8, `src/styles.css` y Bootstrap JS/CSS global. Tailwind **no figura instalado** en los archivos revisados.

Esta tarea es **reconstrucción de UI desde cero dentro del proyecto Angular**. Por tanto:
1. Inventariar las dependencias y funcionalidades de Bootstrap realmente usadas.
2. Configurar Tailwind v4 con la vía oficial (`ng add tailwindcss`) o la integración PostCSS equivalente, compatible con el proyecto.
3. Retirar los imports de Bootstrap del `angular.json` y la dependencia cuando los nuevos componentes ya no dependan de Bootstrap.
4. Evitar mantener Bootstrap y Tailwind simultáneamente como frameworks de diseño permanentes.
5. No introducir Angular Material, React, Next.js ni otro sistema UI sin aprobación.
6. Asegurar que build, test y estilos no fallen tras retirar Bootstrap.
7. Preservar únicamente funcionalidades existentes expresamente requeridas; no copiar el markup antiguo como base visual.

## 4. Identidad visual

Tokens de referencia sujetos a validación con el manual oficial:
- Azul violeta: `#4C5BD4` — color de marca y CTAs de especialistas.
- Verde agua: `#3EC1B6` — acentos y figuras diagonales.
- Azul profundo: `#2A2F6A` — títulos, fondos oscuros y footer.
- Amarillo suave: `#F2C94C` — CTA de cotización de clientes.
- Fondo claro: `#F9F9F9`; texto secundario: `#4F4F4F`.
- Tipografías: Montserrat para títulos y botones; Poppins para contenido. Confirmar fuentes y licencias disponibles.

Construir tokens semánticos con `@theme` (p. ej., `--color-brand-primary`, `--color-brand-accent`, `--color-brand-navy`, `--color-brand-cta`, `--font-heading`, `--font-body`). Evitar colores hardcodeados repetidos en templates. Diseñar estados hover/focus/disabled, espaciado, sombras, radios y tipografía consistente.

Estilo: amable, profesional, moderno, confiable; tarjetas suaves, iconografía de línea uniforme, composiciones limpias, contrastes suficientes y diagonales de marca utilizadas con moderación. No usar gradientes y efectos por decoración sin propósito.

## 5. Arquitectura de información y rutas

- `/`: landing de clientes.
- `/especialistas`: página independiente de captación de especialistas, con beneficios y CTA de inicio de registro.
- `/especialistas/registro`: registro secuencial de **dos pasos** y confirmación de envío; preferible un mismo flujo con estados internos y navegación adecuada. También puede colocarse en `/especialistas` si la implementación justifica evitar una ruta adicional. Documentar la decisión.
- Otras rutas legales como privacidad y términos: enlazar únicamente si existen documentos o contenido aprobado.
- Manejo de rutas desconocidas y navegación de regreso sin pérdida inesperada de datos.

No mostrar las tres pantallas de registro una al lado de otra en producción: eso es solo un storyboard de diseño.

## 6. Landing principal: estructura de referencia

Seguir el recorrido observado en la imagen móvil:
1. **Header:** logo oficial ubicado en la carpeta 'C:\Users\ASUS\Documents\Mil Oficios\Identidad Digital\1.LOGO\PNG', CTA compacto de WhatsApp y menú móvil accesible.
2. **Hero:** mensaje «Tu hogar en buenas manos», explicación de servicio en Lima, fotografía autorizada del técnico con uniforme, CTA amarillo de cotización, señales de confianza y figuras diagonales de marca.
3. **Servicios:** «¿Qué necesitas arreglar?»; Gasfitería, Electricidad, Línea blanca y Pintura como categorías iniciales; tarjetas y CTA contextual de WhatsApp. Las especialidades reales deben venir de la oferta aprobada.
4. **Así de simple:** tres pasos (cuéntanos qué necesitas, te asignamos un técnico, resuelve y confirma). Alinear el texto al proceso operativo real, evitando prometer asignación automática si no existe.
5. **Por qué Mil Oficios:** verificaciones, claridad de cotización, garantía y cobertura; incluir exclusivamente promesas respaldadas por políticas/operación.
6. **Testimonios:** solo contenido real y autorizado. Si no existe, sustituir temporalmente por otra sección de confianza; nunca publicar testimonios ficticios, fotos de clientes inventadas o estrellas sin sustento.
7. **Preguntas frecuentes:** acorde con las políticas de atención vigentes.
8. **CTA final cliente:** «¿Listo para resolverlo?» → WhatsApp.
9. **CTA especialistas:** «¿Eres técnico? Únete a la red» → `/especialistas`.
10. **Footer:** marca, contacto real, enlaces legales vigentes y canales confirmados. No inventar RUC, correo, horarios o URLs.

El mockup muestra dos dispositivos para representar una sola landing extensa. La implementación será una página responsive con scroll continuo, no dos columnas de teléfonos.

## 7. Landing de especialistas

En `/especialistas` mostrar:
- Propuesta de valor específica para especialistas («Únete a la red de especialistas de Mil Oficios»).
- Beneficios verificados y expectativas claras (oportunidades según cobertura/demanda, registro sencillo y verificación).
- Especialidades disponibles y cobertura.
- Explicación breve de cómo funciona el proceso de evaluación.
- CTA principal «Comenzar registro» hacia el formulario.
- Evitar promesas no verificadas sobre volumen de clientes, ingresos o tiempos de aprobación.

## 8. Registro de especialistas: flujo funcional

**Paso 1 — Tus datos:**
- Nombre completo.
- Celular peruano de 9 dígitos; validar formato y proporcionar mensajes útiles. Mostarr un teclado numérico.
- Especialidades de selección múltiple (Gasfitería, Electricidad, Línea blanca, Pintura, Otro, sujetas al catálogo vigente).
- CTA «Continuar» habilitado según validación.

**Paso 2 — Zona y verificación:**
- Distritos de atención con búsqueda y selección múltiple; catálogo verificado de Lima.
- Tipo y número de documento según requisitos aprobados; no presumir DNI como única opción si la operación admite otros documentos.
- Descripción adicional opcional.
- Consentimiento de datos con enlace a política vigente; no premarcar.
- CTA «Atrás» y «Enviar solicitud».

**Confirmación:**
- «¡Recibimos tu solicitud!» únicamente después de respuesta positiva del backend.
- Informar revisión y contacto posterior por WhatsApp sin inventar plazos.
- Aclarar que enviar el formulario **no implica aceptación ni verificación completada**.
- CTA «Volver al inicio».

Requisitos de comportamiento:
- Conservar información al retroceder entre pasos.
- Validar cliente y servidor; dar errores específicos y accesibles.
- Contemplar loading, error de red, errores API, solicitud duplicada y reintento seguro.
- Evitar doble submit.
- No exponer DNI, teléfono ni otros datos personales en URLs, registros, eventos analíticos o mensajes públicos.
- No crear endpoints ficticios; documentar contratos faltantes antes de conectar.
- Respetar legislación y política de privacidad aplicables, con revisión legal cuando corresponda.

## 9. Responsive y accesibilidad

Diseñar **mobile-first**; validar al menos 360, 390, 768 y 1440 px. Usar breakpoints de contenido, no tamaños fijos de dispositivo. Evitar scroll horizontal y textos minúsculos. El mockup de tres paneles es material de presentación, no una grilla de producción.

Apuntar a WCAG 2.2 AA: contraste, navegación por teclado, foco visible, controles con nombre accesible, etiquetas y errores vinculados, estados no expresados solo por color y compatibilidad con lectores de pantalla. Priorizar reducción de movimiento cuando el usuario lo solicite. Los CTA deben ser táctiles y claros.

## 10. SEO, performance y seguridad

- Metadatos por ruta, HTML semántico, open graph, sitemap/canonical si corresponde.
- Evaluar prerender/SSR para páginas públicas; **no asumir que el proyecto actual lo tiene**.
- Imágenes optimizadas, dimensiones explícitas, lazy loading fuera del hero y LCP cuidado.
- Fuentes optimizadas; evitar dependencias visuales innecesarias.
- Mantener presupuestos actuales del build como referencia: initial warning 500 kB / error 1 MB; component style warning 4 kB / error 8 kB. Revisar adecuación si la nueva arquitectura lo requiere, sin elevarlos automáticamente.
- HTTPS, sin secretos en frontend, sanitización y validación servidor, protección frente a abuso del formulario acorde con el backend.

## 11. Métricas (si existe analítica aprobada)

Definir sin enviar PII: `landing_view`, `service_selected`, `whatsapp_cta_clicked`, `specialist_landing_view`, `specialist_registration_started`, `specialist_registration_step_completed`, `specialist_registration_submitted`, `specialist_registration_failed`. Verificar nomenclatura e implementación existente antes de emitir eventos. Medir conversión y abandono, no declarar resultados sin medición.

## 12. Agentes y responsabilidades

- `ux-ui-designer`: arquitectura de información, journeys, mockups, design system y criterios UX.
- `frontend`: Angular, Tailwind, routing, formularios, integración y componentes.
- `backend`: revisar contratos de registro, validación/persistencia y seguridad de API cuando sea necesario.
- `qa`: pruebas unitarias/E2E, accesibilidad, responsive y regresión visual.
- `tech-lead`: decisiones de arquitectura, dependencias y riesgos.

No suponer que un agente haya ejecutado tareas si no existe evidencia. La aprobación del diseño antecede a los cambios funcionales cuando el encargo sea solo una propuesta.

## 13. Fases de ejecución y entregables

**Fase A — Descubrimiento:** inventariar assets, rutas, dependencias, API, reglas de marca y brechas entre referencias y capacidades reales. Documentar decisiones.

**Fase B — UX/UI:** entregar mapa de páginas, journey, pantallas (mobile + desktop), componentes, estados y comparación de fidelidad contra referencias. Resolver encabezados repetidos del registro usando títulos por paso («Tus datos», «Zona y verificación») y un indicador de progreso; reservar «Únete como especialista» para la página de captación.

**Fase C — Implementación base:** configurar Tailwind v4, tokens, tipografías, layout, rutas, componentes básicos y retirar Bootstrap del nuevo frontend tras verificar que ya no se usa. Hacer builds.

**Fase D — Landing + captación:** crear `/`, `/especialistas`, flujo de registro y confirmación. Conectar API solo con contrato verificado.

**Fase E — Validación:** capturas reales a 390 y 1440 px, pruebas de formularios, teclado, contraste, navegación y errores; corregir divergencias y documentar pendientes.

El agente debe entregar cambios incrementales y verificables. No desplegar producción sin autorización expresa.

## 14. Criterios de aceptación

- La landing es una implementación nueva en Angular + Tailwind, coherente con las imágenes de referencia, pero adaptada correctamente a responsive.
- Existe una landing principal y un flujo especializado de captación de técnicos.
- El registro ocurre secuencialmente en dos pasos con pantalla final de confirmación; no hay encabezados duplicados innecesarios.
- El CTA de cliente distingue visualmente del de especialistas y conduce al destino real.
- No se publican claims, testimonios, calificaciones, plazos ni datos legales ficticios.
- No quedan imports ni dependencia de Bootstrap si la reconstrucción ya cubre los componentes usados.
- El proyecto compila y supera las pruebas acordadas.
- Existen capturas verificadas de mobile y desktop, o se documenta explícitamente si no pudieron generarse.
- No se modifican servidores ni producción sin autorización.
