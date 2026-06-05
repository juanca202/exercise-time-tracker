# POST `/transfer` — ejecucion de transferencia (`TransferRequest` / `TransferResponse`)

## Alcance

Define el contrato HTTP para ejecutar una transferencia entre cuentas en el flujo de US-003.
La peticion reutiliza la estructura de `TransferFormDraft` como `TransferRequest` y la respuesta confirma exito con `TransferResponse`.

## Endpoint

| Aspecto                                    | Valor              |
| ------------------------------------------ | ------------------ |
| Metodo                                     | `POST`             |
| Ruta                                       | `/transfer`        |
| `Content-Type` (peticion y respuesta JSON) | `application/json` |
| Codigo exitoso                             | `200 OK`           |

## Cuerpo de peticion — `TransferRequest`

Objeto JSON con los campos:

| Campo                 | Tipo   | Obligatorio | Descripcion                                     |
| --------------------- | ------ | ----------- | ----------------------------------------------- |
| `sourceAccountNumber` | string | Si          | Numero de la cuenta origen.                     |
| `targetAccountNumber` | string | Si          | Numero de la cuenta destino.                    |
| `routerNumber`        | string | Si          | Numero de ruta bancaria de la transferencia.    |
| `amount`              | number | Si          | Monto a transferir. Debe ser mayor que cero.    |
| `description`         | string | Si          | Descripcion de la transferencia para el recibo. |

**Ejemplo:**

```json
{
  "sourceAccountNumber": "001234567890",
  "targetAccountNumber": "009876543210",
  "routerNumber": "021000021",
  "amount": 150.75,
  "description": "Pago de servicios"
}
```

## Respuesta exitosa — `TransferResponse`

Objeto JSON de confirmacion:

| Campo     | Tipo   | Obligatorio | Descripcion                           |
| --------- | ------ | ----------- | ------------------------------------- |
| `message` | string | Si          | Mensaje de exito de la transferencia. |

**Ejemplo:**

```json
{
  "message": "Transferencia realizada con exito."
}
```

## Reglas de negocio (contrato minimo)

- El backend o mock debe rechazar peticiones donde `sourceAccountNumber` y `targetAccountNumber` sean iguales.
- El backend o mock debe rechazar peticiones con `amount` menor o igual a `0`.
- Las validaciones de saldo disponible y mensajes de error detallados se alinean con reglas de US-003 y se implementan en la capa correspondiente.

## Notas de implementacion

- En alcance demo se permite implementacion mock del endpoint.
- En integracion real se debe ampliar la respuesta con identificador de operacion y trazabilidad segun necesidades regulatorias.
