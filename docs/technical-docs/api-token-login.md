# POST `/api/token` — credenciales de acceso (LoginRequest / LoginResponse)

## Alcance

Define el contrato del recurso HTTP que, tras validar usuario y contraseña, devuelve un **JWT** de acceso y un **refresh token**. Sirve como referencia para implementación del backend y para clientes que integren autenticación por token.

La firma del JWT, claves, tiempos de expiración y el endpoint de renovación con `refresh_token` **no** sustituyen la política de seguridad del entorno productivo; deben completarse en especificación de backend o ADR cuando existan.

## Endpoint

| Aspecto                                    | Valor              |
| ------------------------------------------ | ------------------ |
| Método                                     | `POST`             |
| Ruta                                       | `/api/token`       |
| `Content-Type` (petición y respuesta JSON) | `application/json` |

Las rutas públicas del proyecto **deben** usar segmentos en **inglés**; `/api/token` cumple esa convención.

## Cuerpo de petición — `LoginRequest`

Objeto JSON con los campos:

| Campo      | Tipo   | Obligatorio | Descripción                                         |
| ---------- | ------ | ----------- | --------------------------------------------------- |
| `username` | string | Sí          | Identificador del usuario en el sistema de cuentas. |
| `password` | string | Sí          | Secreto asociado al usuario.                        |

**Ejemplo:**

```json
{
  "username": "demo.user",
  "password": "••••••••"
}
```

## Respuesta exitosa — `LoginResponse`

En caso de credenciales válidas, el cuerpo es un objeto JSON:

| Campo           | Tipo   | Descripción                                                                                                                                                                                                    |
| --------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `token`         | string | **JWT** de acceso. Su payload **incluye** el nombre de usuario del titular autenticado. Las peticiones autenticadas envían este valor en la cabecera `Authorization` como esquema **Bearer**.                  |
| `refresh_token` | string | Credencial opaca o semántica propia del backend para **renovar** el acceso sin volver a enviar usuario y contraseña; el contrato del endpoint de renovación se documenta cuando producto o backend lo definan. |

**Ejemplo (valores ilustrativos):**

```json
{
  "token": "eyJhbGciOi...",
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

## Uso del JWT en peticiones autenticadas

Incluir el JWT emitido en `LoginResponse.token`:

```http
Authorization: Bearer <token>
```

El servidor valida el JWT (firma, expiración y, si aplica, revocación) antes de atender el recurso protegido.

## Notas de implementación

- En la demo actual del repositorio puede seguir usándose sesión mock sin este contrato hasta que exista backend acordado (véase preferencias en `.agents/MEMORY.md`).
- Cuando este contrato se implemente de verdad, conviene documentar en el mismo directorio `technical-docs/` (o en ADR de producto) algoritmo de firma, claims estándar (`iss`, `aud`, `exp`, etc.) y política de `refresh_token`.
