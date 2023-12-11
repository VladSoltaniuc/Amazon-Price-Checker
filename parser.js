// HOW TO USE (Example):
// add sender's UserName and Password bellow
// insert into console terminal(bash): node parser.js url targetPrice recipient
// example: node parser.js https://www.amazon.com/AMD-Ryzen-5600X-12-Thread-Processor/dp/B08166SLDF 160 example@gmail.com
// example checks if item featured in the url (AMD CPU) is cheaper or equal with the price 160 and sends the result to example@gmail.com


// nodemailer allows sending emails
const  nodemailer = require('nodemailer')

// add sender's UserName and Password here
const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        // Email adress which will send the email
        // ADD EMAIL ADDRESS
		user: "",
		// ADD PASSWORD
        pass: ""
    }
})

// nightmare allows web scraping from Amazon.com (or any website which is rendered using front end frameworks or javascript) giving back the HTML
const nightmare = require('nightmare')()

const args = process.argv.slice(2)
// url of the Amazon product (Eg. https://www.amazon.com/AMD-Ryzen-5600X-12-Thread-Processor/dp/B08166SLDF)
const url = args[0]
// will check for this price or lower
const targetPrice = args[1]
// email adress which will recive the email
const recipient = args [2]
// dynamic part of the email's text based on price comparison
let result = "default"

checkPrice();

async function checkPrice() {
    
    const priceString = await nightmare.goto(url)
                                        .wait("#corePrice_feature_div")
                                        .evaluate(() => document
                                                                .getElementById("corePrice_feature_div")
                                                                .getElementsByClassName("a-section")[0]
                                                                .getElementsByClassName("a-price")[0]
                                                                .getElementsByClassName("a-offscreen")[0].innerText)
                                        .end()
    const priceNumber = parseFloat(priceString.replace('$',''));
    // comparing Amazon price with desired price
    if(priceNumber <= targetPrice) {
        result=("cheaper than " + targetPrice +"$ , order it right away! ")
    } else {
        result=("more expensive than " + targetPrice + "$ , you should wait a while longer.")
    }

    // email object
    const options = {
        // ADD SENDER'S EMAIL ADDRESS
        from: "",
        // recipient contains reciver's email adress
        to: recipient,
        subject: "Amazon Price Update",
        text: "Your requested item is " + result  + " " + url 
    }

    transporter.sendMail(options,function(err, info){
        if(err){
            console.log(err)
            return
        }
        console.log("Sent: " + info.response)
    })

}