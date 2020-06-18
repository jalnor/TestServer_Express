const braintree = require('braintree')
const auth = require('../auth/auth')


var gateway = braintree.connect({
  environment:braintree.Environment.Sandbox,
  merchantId: "Your Merchant Id Here", 
  publicKey: "Your Public Key Here", 
  privateKey: "Your Private Key Here"
})

gateway.clientToken.generate({}, function (err, response) {
  var ct = response.clientToken.token
  return ct
})

gateway.clientToken.generate({
      customerId: this
  }, function (err, response) {
      var clientToken = response.clientToken.token
      return clientToken
})

gateway.customer.create({
    id: "customer_123",
    firstName: "customerFirstName",
    lastName: "customerLastName",
    email: "customerEmail"
  }, function (err, result) {
    // console.log("The result from braintree: " + result)
    if ( result.success ) {
      console.log("The result from braintree: " + result)
      return result
    } else {
      // console.log("The err from braintree: " + err)
      // return err
    }
    
})

gateway.customer.create({
    id: "this",
    firstName: "this",
    lastName: "this",
    paymentMethodNonce: "this"
  }, function (err, result) {

    if ( err ) {
      return err;
    }
    return result
     
  });

  gateway.customer.update("theCustomerId", {
      paymentMethodNonce: "new payment method nonce"
    }, function (err, result) {
      if ( err ) {
        return err;
      }
      return result 
  });

gateway.transaction.sale({
      amount: "10.00",
      paymentMethodNonce: "nonceFromTheClient",
      options: {
        submitForSettlement: true
      }
  }, function (err, result) {
   
    return "Result " + result + " err " + err
})



module.exports = gateway