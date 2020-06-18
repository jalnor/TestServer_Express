const express = require('express')
const bTree = require('../braintree/braintree')
const auth = require('../auth/auth')
const bodyParser = require('body-parser')

const router = express.Router()
const jsonParser = bodyParser.json()

router.post("/delete_customer", jsonParser, async (req,res) => {
    let id = req.body.id
    let e = bTree.customer.delete({})
    res.status(200).send({e})
})

router.get("/client_token", async (req,res) => {
    try {
        let token = await bTree.clientToken.generate()
        res.status(200).send({token})
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post("/client_token_withCred", jsonParser, async (req,res) => {
    console.log("Inside createtoken with cred " + req.body.id)
    try {
        let token = await bTree.clientToken.generate({
            customerId:req.body.id
        })
        res.status(200).send({token})
    } catch ( error ) {
        // console.log("Error in client_token_withCred: " + error)
        res.status(500).send({error})
    }
})

router.post("/create_client_withCred", jsonParser, async (req,res) => {
    try {
        let token = await bTree.customer.create({
            id:req.body.id,
            firstName:req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        })
        // console.log("The result from createWithCred: " + token.toString())
        res.status(200).send({token})
    } catch (error) {
        // console.log("Error in createwithCred: " + error)
        res.status(400).send(error)
    }
})

router.post("/create_client_withCard", jsonParser, async (req,res) => {
    console.log("This is the request for create_client: " + req.body.mPaymentMethodNonce.N)
    try {
        let result = await bTree.customer.create({
            id:req.body.id, 
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            paymentMethodNonce:req.body.mPaymentMethodNonce})
        res.send({result})
    } catch ( error ) {
        // console.log("Error in createwithCard: " + error)
        res.status(500).send(error)
    }
})

router.post("/update_client", jsonParser, async (req,res) => {
    try {
        let result = await bTree.customer.update(req.body.id, {
            paymentMethodNonce: req.body.paymentMethodNonce
        })
        // console.log("result in update_client: " + result)
        res.status(200).send({result})
    } catch ( error ) {
        // console.log("Error in update_client: " + error)
        res.status(500).send({error})
    } 
})

router.post("/sale", jsonParser, async (req,res) => {
    try {
        // console.log("This is the request for sale: " + req.body.paymentMethodNonce)
        let result = bTree.transaction.sale({
            amount:req.body.amount,
            paymentMethodNonce:req.body.paymentMethodNonce,
            options:{submitForSettlement: true}
        })
        res.send({result})
    } catch ( error ) {
        // console.log("Error in sale: " + error)
        res.status(500).send(error)
    }
})

module.exports = router