const nodemailer = require('nodemailer')

class MailService {
    async sendActivationMail(to, link) {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.mail.ru",
                port: 465,
                secure: true,
                auth: {
                    user: 'soninnomok@mail.ru',
                    pass: 'rHykDd6idG0vTv5Gfyuz'
                },
            });

            let info = await transporter.sendMail({
                from: 'soninnomok@mail.ru',
                to: to,
                subject: "Hi",
                text: "Podtverdi akaynt",
                html: `
                    <div>
                        <b>Activation url</b><br>
                        <a href="${link}">${link}</a>
                    </div>`
            });
        } catch (e) {
        }
    }

    async sendRemovePasswordMail(to, link) {
        let transporter = nodemailer.createTransport({
            host: "smtp.mail.ru",
            port: 465,
            secure: true,
            auth: {
                user: 'soninnomok@mail.ru',
                pass: 'rHykDd6idG0vTv5Gfyuz'
            },
        });
        let info = await transporter.sendMail({
            from: 'soninnomok@mail.ru', 
            to: to,
            subject: "Hi", 
            text: "Для востановления пароля перейлите по ссылки", 
            html: `
                <div>
                    <b>Link for remove password</b>, 
                    <a href="${link}">${link}</a>
                </div>`
        });
    }

    async requestforAddPointhelpMail(to ,name,nameBoss, email,phone,region,address,city,listThings, description) {
        let transporter = nodemailer.createTransport({
            host: "smtp.mail.ru",
            port: 465,
            secure: true,
            auth: {
                user: 'soninnomok@mail.ru',
                pass: 'rHykDd6idG0vTv5Gfyuz'
            },
        });

        let info = await transporter.sendMail({
            from: 'soninnomok@mail.ru', 
            to: to,
            subject: "Hi", 
            text: "Заявка на добавление Пункта Гум Помощи", 
           
            html: `Здраствуйте ${nameBoss}. Ваща заявка поступила на расмотрение, в течении 48 часов появиться на сайте.
                <div>
                <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Название</label>
                <input type="email" class="form-control" id="exampleFormControlInput1"
                    value=${name}
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Имя Руководитель</label>
                <input type="email" class="form-control" id="exampleFormControlInput1"
                    value=${nameBoss}
                   
                </input>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">Телефон</label>
                <input class="form-control" id="exampleFormControlTextarea1" rows="3"
                    value=${phone}
                </input>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Адрес</label>
                <input type="email" class="form-control" id="exampleFormControlInput1"
                    value=${address}
                </input>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Город</label>
                <input type="email" class="form-control" id="exampleFormControlInput1"
                    value=${city}
                </input>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Адрес электороной почты</label>
                <input type="email" class="form-control" id="exampleFormControlInput1"
                    value=${email}
                </input>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Область</label>
                <input type="email" class="form-control" id="exampleFormControlInput1"
                    value=${region}
                </input>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Чем можете помочь</label>
                <input type="email" class="form-control" id="exampleFormControlInput1"
                    value=${listThings}
                </input>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Напишите о своем пункте помоши</label>
                <input type="email" class="form-control" id="exampleFormControlInput1"
                                    value=${description}
                </input>
            </div>
                </div>`
        });
    }

}
module.exports = new MailService();