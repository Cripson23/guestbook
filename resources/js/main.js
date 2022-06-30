import axios from 'axios';

window.onload = function () {
    new Main().main();
};

/**
 * Главный класс
 */
class Main {
    constructor() {
        this.modal_form = new ModalForm();
        this.captcha = new Captcha();
    }
}
Object.assign(Main.prototype, {
    main() {
        this.getElementsAndRegListeners();
        this.modal_form.checkAlertErrors();
    },
    getElementsAndRegListeners () {
        const modal_window = document.getElementById('addMessageModal');

        // обработка ESC при открытом модальном окне
        window.onkeydown = function (event) {
            if (event.key !== undefined) {
                if (event.key === "Escape") {
                    if (modal_window.style.display === "block") {
                        this.modal_form.closeAddMessageModal(modal_window);
                    }
                }
            }
        };

        // получение элементов
        const btn_message = document.getElementById('btn-message');
        const btn_close_modal = document.getElementsByClassName('btn-close')[0];
        const btn_reset_message_form = document.getElementById('btn-reset-message-form');
        const btn_submit_message_form = document.getElementById('btn-submit-message-form');
        const btn_captcha_refresh = document.getElementsByClassName('captcha__refresh')[0];

        // добавление обработчиков
        btn_message.addEventListener("click", this.modal_form.showAddMessageModal.bind(this.modal_form, modal_window), false);
        for (let b of [btn_close_modal, btn_reset_message_form]) {
            b.addEventListener("click", this.modal_form.closeAddMessageModal.bind(this.modal_form, modal_window), false);
        }
        btn_submit_message_form.addEventListener("click", this.modal_form.submitMessageForm.bind(this.modal_form), false);
        btn_captcha_refresh.addEventListener("click", this.captcha.getCaptcha.bind(this.captcha), false);
    }
})

/**
 * Класс для работы с формой и модальным окном
 */
class ModalForm {
    constructor() {
    }
}

Object.assign(ModalForm.prototype, {
    // Показать модальное окно формы отправки сообщения
    showAddMessageModal (modal_window) {
        modal_window.style.display = "block";
        Object.create(Captcha).prototype.getCaptcha();
    },

    // Закрытие модального окна формы отправки сообщения
    closeAddMessageModal (modal_window) {
        modal_window.style.display = "none";
        document.getElementById("sendMessageForm").reset();
        this.clearValidErrors();
    },

    // Проверка наличия ошибок формы с сервера и показ окна с формой
    checkAlertErrors() {
        const alertErrors = document.getElementsByClassName("alert-errors")[0];
        if (alertErrors !== undefined) {
            const modal_window = document.getElementById('addMessageModal');
            this.showAddMessageModal(modal_window);
        }
    },

    // Очистить ошибки валидации
    clearValidErrors() {
        let valid_error_divs = document.getElementsByClassName('validation-errors')
        for (const d of valid_error_divs) {
            d.innerHTML = "";
        }

        const form = document.getElementById("sendMessageForm");
        form.elements['uname'].style.borderColor = "";
        form.elements['email'].style.borderColor = "";
        form.elements['text-message'].style.borderColor = "";
        form.elements['captcha'].style.borderColor = "";

        const alertErrors = document.getElementsByClassName("alert-errors")[0];
        if (alertErrors !== undefined) {
            alertErrors.innerHTML = "";
            alertErrors.style.display = "none";
        }
    },

    // Обработка отправки формы
    submitMessageForm (event) {
        event.preventDefault();
        const form = document.getElementById("sendMessageForm");
        let formData = new FormData(form);

        let formValues = {
            "userName": formData.get("uname"),
            "email": formData.get("email"),
            "textMessage": formData.get("text-message"),
            "captcha": formData.get("captcha")
        }

        let valid = new FormSendMessageValidation(form, formValues);
        if (valid.validation_result) {
            (async () => {
                const captcha = new Captcha();
                let result = await captcha.checkCaptcha(formValues.captcha);
                if (!result) {
                    valid.validationErrorsShow(3, 'captcha', ['Wrong captcha!'])
                }
                else {
                    form.submit();
                    form.reset();
                }
            })()
        }
    }
})

/**
 * Класс для работы с капчей
 */
class Captcha {
    constructor() {
    }
}
Object.assign(Captcha.prototype, {
    // Получить изображение капчи
    getCaptcha () {
        axios.post('/get-captcha').then(response => {
            this.setCaptchaImg(response.data['img_path']);
        }).catch(error => {
            console.error('There was an error!', error);
        });
    },
    // Задать изображение капчи
    setCaptchaImg (img_path) {
        let captcha_img = document.getElementsByClassName("captcha__image")[0];
        captcha_img.setAttribute("src", img_path + "?" + new Date().getTime());
    },
    // Проверка капчи
    async checkCaptcha (captcha) {
        return await axios.post('/check-captcha', {'captcha': captcha}).then(response => response.data.result)
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
})

/**
 * Класс для валидации полей формы
*/
class FormSendMessageValidation {
    constructor(form, formValues) {
        this.form = form;
        this.formValues = formValues;
        this.validation_result = true;
        this.allFieldVal();
    }
}

Object.assign(FormSendMessageValidation.prototype, {
    allFieldVal () {
        this.nameVal();
        this.emailVal();
        this.textVal();
        this.captchaVal();
    },
    nameVal () {
        const min_name_length = 3;
        const max_name_length = 40;

        let notValidErrorsName = [];
        if(this.formValues.userName.length < min_name_length || this.formValues.userName.length > max_name_length) {
            notValidErrorsName.push(`Length must be between ${min_name_length} and ${max_name_length} characters`);
        }

        const regex = /^[a-zA-Z\d]+$/;
        if(!regex.test(this.formValues.userName.toString())) {
            notValidErrorsName.push("Only latin characters and numbers");
        }

        this.validationErrorsShow(0, 'uname', notValidErrorsName);
    },
    emailVal () {
        const min_email_length = 5;
        const max_email_length = 100;

        let notValidErrorsEmail = [];
        if(this.formValues.email.length < min_email_length || this.formValues.email.length > max_email_length) {
            notValidErrorsEmail.push(`Length must be between ${min_email_length} and ${max_email_length} characters`);
        }

        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!regex.test(this.formValues.email.toString())) {
            notValidErrorsEmail.push("Not correctly e-mail address");
        }

        this.validationErrorsShow(1, 'email', notValidErrorsEmail);
    },
    textVal() {
        const min_text_length = 10;
        const max_text_length = 540;

        let notValidErrorsText = [];
        // Удаление всех html тегов
        this.formValues.textMessage = this.formValues.textMessage.replace(/(\<(\/?[^>]+)>)/g, '').replace(/\s{2,}/g, ' ');

        if (this.formValues.textMessage.length < min_text_length) {
            notValidErrorsText.push(`Message length must be at least ${min_text_length} characters`);
        } else if (this.formValues.textMessage.length > max_text_length) {
            notValidErrorsText.push('Too long message');
        }

        this.validationErrorsShow(2, 'text-message', notValidErrorsText);
    },
    captchaVal() {
        const captcha_length = 6;
        let notValidErrorsCaptcha = [];
        if (this.formValues.captcha.length !== captcha_length) {
            notValidErrorsCaptcha.push("Not correctly captcha");
        }
        this.validationErrorsShow(3, 'captcha', notValidErrorsCaptcha);
    },
    validationErrorsShow(div_id, elem_name, notValidErrors) {
        let valid_error_div = document.getElementsByClassName("validation-errors")[div_id];
        let input_elem = this.form.elements[elem_name];
        input_elem.style.borderColor = '';

        valid_error_div.innerHTML = "";
        if (notValidErrors.length > 0) {
            input_elem.style.borderColor = 'red';
            for (let i = 0; i < notValidErrors.length; i++) {
                valid_error_div.innerHTML += "- " + notValidErrors[i] + "<br>";
                valid_error_div.style.color = 'red';
            }
            this.validation_result = false;
        }
    }
})
