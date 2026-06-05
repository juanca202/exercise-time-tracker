# GET `/api/settings` — configuración de usuario (`Settings`)

## Alcance

Define el contrato del recurso HTTP que expone la **configuración asociada al usuario autenticado**, en particular los datos de perfil necesarios para la pantalla de configuración y otros flujos que los consuman.

La autorización exacta (p. ej. validación de JWT **Bearer** según [api-token-login](./api-token-login.md)) y las reglas de negocio de exposición de datos personales **no** sustituyen la política de privacidad ni la implementación de backend; deben acordarse con producto y seguridad.

## Endpoint

| Aspecto   | Valor                           |
| --------- | ------------------------------- |
| Método    | `GET`                           |
| Ruta      | `/api/settings`                 |
| Respuesta | `application/json` (`Settings`) |

Las rutas públicas del proyecto **deben** usar segmentos en **inglés**; `/api/settings` cumple esa convención.

**Petición autenticada:** el servidor identifica al usuario mediante el mecanismo de sesión o token acordado (cabecera `Authorization: Bearer` u otro contrato vigente). El cuerpo de respuesta **solo** refleja al usuario cuya sesión es válida.

## Respuesta exitosa — `Settings`

Objeto JSON raíz con una propiedad `user` que agrupa los datos de perfil:

| Ruta (JSON)      | Tipo   | Descripción                                    |
| ---------------- | ------ | ---------------------------------------------- |
| `user.username`  | string | Identificador de inicio de sesión del usuario. |
| `user.firstName` | string | Nombre de pila.                                |
| `user.lastName`  | string | Apellido(s).                                   |
| `user.email`     | string | Dirección de correo electrónico.               |

**Ejemplo:**

```json
{
  "user": {
    "username": "demo.user",
    "firstName": "María",
    "lastName": "Pérez",
    "email": "maria.perez@example.com"
  }
}
```

## Errores (referencia)

Los códigos y cuerpos de error concretos dependen del gateway y del backend; de forma habitual, una sesión inválida o ausente produce **401 Unauthorized** y un recurso no encontrado **404 Not Found** solo si el contrato del producto lo define así.

## Notas de implementación

- En la demo del repositorio puede existir una variante mock hasta que exista API real acordada (véase `.agents/MEMORY.md`).
- Si en el futuro `Settings` incluye más bloques (preferencias, legales, etc.), ampliar este documento o versionar el contrato sin romper clientes existentes.
