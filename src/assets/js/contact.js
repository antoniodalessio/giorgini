$.extend($.validator.messages, {
	required: "Campo obbligatorio",
	remote: "Controlla questo campo",
	email: "Inserisci un indirizzo email valido",
	url: "Inserisci un indirizzo web valido",
	date: "Inserisci una data valida",
	dateISO: "Inserisci una data valida (ISO)",
	number: "Inserisci un numero valido",
	digits: "Inserisci solo numeri",
	creditcard: "Inserisci un numero di carta di credito valido",
	equalTo: "Il valore non corrisponde",
	extension: "Inserisci un valore con un&apos;estensione valida",
	maxlength: $.validator.format("Non inserire pi&ugrave; di {0} caratteri"),
	minlength: $.validator.format("Inserisci almeno {0} caratteri"),
	rangelength: $.validator.format("Inserisci un valore compreso tra {0} e {1} caratteri"),
	range: $.validator.format("Inserisci un valore compreso tra {0} e {1}"),
	max: $.validator.format("Inserisci un valore minore o uguale a {0}"),
	min: $.validator.format("Inserisci un valore maggiore o uguale a {0}"),
	nifES: "Inserisci un NIF valido",
	nieES: "Inserisci un NIE valido",
	cifES: "Inserisci un CIF valido",
	currency: "Inserisci una valuta valida"
});



$(document).ready(function(){

    $('button.submit').on('click', function(e) {
        e.preventDefault();
    })
    
    var $form = $('.contact-form');
    var $infoMessage = $form.find('.info-message')
    var $successMsg = $('.success-msg-container');

    $form.validate({
        lang : 'it',
        submitHandler: function(form) {
            
            var formData = $form.serializeArray();
            console.log(formData)
            var msg = {
                name: formData[0].value,
                phone: formData[1].value,
                email: formData[2].value,
                message: formData[3].value,
                ['g-recaptcha-response']: formData[4].value
            }

            console.log(msg)
            $('.contact-form button').addClass("loading")
    
            $.ajax({
                url: 'public/contact.php',
                type: 'POST',
                data: JSON.stringify(msg),
                contentType: 'application/json',
                dataType: "json",
                success: function(response) {
                    if (response.result) {
                        $('.contact-form button').removeClass("loading")
                        $successMsg.css({display: 'flex'});
                    }else{
                        $('.contact-form button').removeClass("loading")
                        $infoMessage.text("Errore. La tua richiesta non è andata a buon fine. Controlla il campo email o il captcha").css({color: '#cc0000'})
                    }
                },
                error: function(e) {
                    $('.contact-form button').removeClass("loading")
                    $infoMessage.text("Errore. La tua richiesta non è andata a buon fine. Controlla il campo email o il captcha").css({color: '#cc0000'})
                }
            })
          
        }
       });  

})