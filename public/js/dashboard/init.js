/**
 * Detect Development Environment On Client-Side, in case you need to know
 */
var environment = $('#dashboard-container').attr('data-dashboard');
if (environment === 'development') { console.log('Environment: Development'); }



// End