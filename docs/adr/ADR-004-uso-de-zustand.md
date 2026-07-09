# ADR-004: Uso de Zustand para manejo de estado

Estado: Accepted
Fecha de creación: 2026-07-06
Última actualización: 2026-07-06
Decisores: Equipo de desarrollo
Etiquetas: state-management, zustand, react

## Contexto

A medida que el proyecto crece, distintas partes de la aplicación necesitan compartir estado que no está directamente relacionado por props (estado global de UI, datos de sesión, preferencias, etc.). Sin un lineamiento único, cada feature podría adoptar su propia solución de manejo de estado global, fragmentando patrones, duplicando lógica y complicando el mantenimiento a largo plazo.

## Decision

El estado global compartido entre componentes se maneja exclusivamente con Zustand. No se introducen otras librerías de manejo de estado global (Redux, Recoil, Jotai, MobX, etc.) como convención vigente. El estado local de un componente sigue resolviéndose con los hooks nativos de React (`useState`, `useReducer`) sin necesidad de pasar por una store global.

## Consecuencias

### Positivas

- API mínima y sin boilerplate en comparación con soluciones como Redux.
- Buen ajuste con Server/Client Components de Next.js al no requerir un Provider global obligatorio envolviendo toda la aplicación.
- Curva de aprendizaje baja para el equipo.

### Negativas / trade-offs

- Ecosistema de middleware y dev tools más reducido que el de Redux.
- Requiere disciplina para no convertir las stores globales en un estado global mal organizado ("god store") a medida que crece el número de features.

## Referencias

- [Zustand Documentation](https://zustand.docs.pmnd.rs/)
