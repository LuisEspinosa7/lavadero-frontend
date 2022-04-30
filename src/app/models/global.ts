export var GLOBAL = {

  //URL BASE PARA TODOS LOS SERVICIOS (API)
  urlBase: '/api',

  // CODIGOS ROLES
  rolAdministrador: 1,
  rolPropietario: 2,
  rolOperario: 3,
  rolTecnico: 4,
  rolCliente: 5,
  roleAdministrador: 'ROLE_ADMINISTRADOR',
  rolePropietario: 'ROLE_PROPIETARIO',
  roleOperario: 'ROLE_OPERARIO',
  roleTecnico: 'ROLE_TECNICO',
  roleCliente: 'ROLE_CLIENTE',

  tipoPromocionNoAplica: 3,



  //URL ESPECIFICA PARA AUTENTICACION
  //urlAutentication: 'http://localhost:8080/lavadero/login',

  // MENSAJES PARA LA APP
  mensajeError: 'Lo sentimos ha ocurrido un error, no fue posible realizar la operacion.',
  mensajeSuccess: 'La operacion se realizo correctamente.',
  expiredSession: 'La sesion expiro.',
  ticketError: 'No fue posible imprimir el ticket.',

  // PREGUNTAS
  confirmacionCambiarEstado: '¿Esta seguro de cambiar el estado?.',

  confirmacionLiquidacion: '¿Esta seguro de generar la liquidacion?, le recomendamos revisar en el historial de liquidaciones en la parte inferior.',
  confirmacionImpresionTicket: '¿Esta seguro de imprimir el ticket de la liquidacion?, recuerde que este debe ser firmado por el trabajador.',


  /**
   * Servidor de Desarrollo
   */
  urlAutentication: 'http://localhost:8080/lavadero/login',
  urlBackend: 'http://localhost:8080/lavadero',
  urlBaseBackend: 'http://localhost:8080',



  /**
   * Servidor de Produccion
   */
  //urlAutentication: 'https://brilliantic.com.co:8443/lavadero/login',
  //urlBackend: 'https://brilliantic.com.co:8443/lavadero',
  //urlBaseBackend: 'https://brilliantic.com.co:8443',





  //COLORES
  primaryColor: '#03A9F4',
  accentColor: '#FFEB3B',
  warnColor: '#E91E63'

};
